import { randomBytes } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { Router } from 'express'
import { signToken, requireAuth } from '../auth.js'
import { db, newId } from '../db.js'
import { authenticatedLimits, authLimits } from '../rateLimit.js'

export const authRouter = Router()

const publicProfile = (row) => ({ id: row.id, name: row.name, email: row.email })
const PASSWORD_MIN_LENGTH = 8
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000

const getFrontendBaseUrl = () => (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '')

const buildResetUrl = (token) => `${getFrontendBaseUrl()}/login?reset=${encodeURIComponent(token)}`

const sendResetEmail = async ({ to, resetUrl }) => {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM

  if (!apiKey || !from) {
    throw new Error('Resend is not configured. Set RESEND_API_KEY and RESEND_FROM in server environment variables.')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': 'cyperflow-api/1.0',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: 'Reset your Pennywise AI password',
      html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Pennywise AI Password Reset</h2>
        <p>You requested to reset your Pennywise AI password.</p>
        <p>
          <a href="${resetUrl}">
            Reset your password
          </a>
        </p>
        <p>This link expires in 1 hour.</p>
        <p>If you did not request this, you can safely ignore this email.</p>
      </div>
    `,
    }),
    signal: AbortSignal.timeout(10_000),
  })

  if (!response.ok) {
    throw new Error(`Resend email request failed with status ${response.status}`)
  }
}

authRouter.post('/signup', ...authLimits('signup', {
  ipMax: 6,
  ipWindowMs: 60 * 60_000,
  accountMax: 3,
  accountWindowMs: 60 * 60_000,
}), (req, res) => {
  const { name, email, password } = req.body ?? {}

  if (!name || String(name).trim().length < 2) {
    return res.status(400).json({ error: 'Name must be at least 2 characters' })
  }
  if (!email || !String(email).includes('@')) {
    return res.status(400).json({ error: 'Valid email required' })
  }
  if (!password || String(password).length < PASSWORD_MIN_LENGTH) {
    return res.status(400).json({ error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` })
  }

  const normalizedEmail = String(email).trim().toLowerCase()
  const existing = db.prepare('SELECT id FROM profiles WHERE email = ?').get(normalizedEmail)
  if (existing) {
    return res.status(409).json({ error: 'An account with that email already exists' })
  }

  const id = newId()
  db.prepare('INSERT INTO profiles (id, name, email, password_hash) VALUES (?, ?, ?, ?)').run(
    id,
    String(name).trim(),
    normalizedEmail,
    bcrypt.hashSync(String(password), 10),
  )

  const profile = db.prepare('SELECT * FROM profiles WHERE id = ?').get(id)
  return res.status(201).json({ token: signToken(id), user: publicProfile(profile) })
})

authRouter.post('/login', ...authLimits('login', {
  ipMax: 15,
  ipWindowMs: 15 * 60_000,
  accountMax: 5,
  accountWindowMs: 15 * 60_000,
}), (req, res) => {
  const { email, password } = req.body ?? {}
  const profile = db
    .prepare('SELECT * FROM profiles WHERE email = ?')
    .get(String(email ?? '').trim().toLowerCase())

  if (!profile || !bcrypt.compareSync(String(password ?? ''), profile.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password' })
  }

  return res.json({ token: signToken(profile.id), user: publicProfile(profile) })
})

authRouter.post(
  '/forgot-password',
  ...authLimits('forgot-password', {
    ipMax: 6,
    ipWindowMs: 15 * 60_000,
    accountMax: 3,
    accountWindowMs: 60 * 60_000,
  }),
  async (req, res) => {
    const email = String(req.body?.email ?? '')
      .trim()
      .toLowerCase()

    if (!email || !email.includes('@')) {
      return res.status(400).json({
        error: 'Valid email required',
      })
    }

    const profile = db
      .prepare('SELECT id FROM profiles WHERE email = ?')
      .get(email)
      console.log('[auth] Forgot password:', email, 'Profile:', profile)

    // Don't reveal whether an email is registered.
    if (!profile) {
      return res.json({
        message: 'If an account exists, a reset link has been sent.',
      })
    }

    const now = new Date().toISOString()

    db.prepare(`
      UPDATE password_reset_tokens
      SET used_at = ?
      WHERE user_id = ?
      AND used_at IS NULL
    `).run(now, profile.id)

    const rawToken = randomBytes(32).toString('hex')
    const tokenHash = bcrypt.hashSync(rawToken, 10)

    const expiresAt = new Date(
      Date.now() + RESET_TOKEN_TTL_MS
    ).toISOString()

    const id = newId()

    db.prepare(`
      INSERT INTO password_reset_tokens
      (id, user_id, token_hash, expires_at, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      id,
      profile.id,
      tokenHash,
      expiresAt,
      now
    )

    const resetUrl = buildResetUrl(rawToken)

    try {
      await sendResetEmail({
        to: email,
        resetUrl,
      })

      console.log(`[auth] Password reset email sent to ${email}`)

      return res.json({
        message: 'If an account exists, a reset link has been sent.',
      })
    } catch (error) {
      console.error(
        `[auth] Password reset email failed for ${email}:`,
        error
      )

      db.prepare(`
        DELETE FROM password_reset_tokens
        WHERE id = ?
      `).run(id)

      return res.status(500).json({
        error: 'Unable to send password reset email. Please try again.',
      })
    }
  }
)

authRouter.post('/reset-password', ...authLimits('reset-password', {
  ipMax: 10,
  ipWindowMs: 15 * 60_000,
  accountMax: 5,
  accountWindowMs: 60 * 60_000,
}), (req, res) => {
  const { token, password } = req.body ?? {}
  const resetToken = String(token ?? '').trim()
  const newPassword = String(password ?? '')

  if (!resetToken) {
    return res.status(400).json({ error: 'Reset token is required' })
  }
  if (newPassword.length < PASSWORD_MIN_LENGTH) {
    return res.status(400).json({ error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters` })
  }

  const now = new Date().toISOString()
  const rows = db.prepare('SELECT * FROM password_reset_tokens WHERE used_at IS NULL AND expires_at > ?').all(now)
  const match = rows.find((row) => bcrypt.compareSync(resetToken, row.token_hash))

  if (!match) {
    return res.status(400).json({ error: 'Invalid or expired reset token' })
  }

  db.prepare('UPDATE password_reset_tokens SET used_at = ? WHERE user_id = ? AND used_at IS NULL').run(now, match.user_id)
  db.prepare('UPDATE profiles SET password_hash = ? WHERE id = ?').run(bcrypt.hashSync(newPassword, 10), match.user_id)

  return res.json({ message: 'Password updated successfully' })
})

authRouter.get('/me', requireAuth, ...authenticatedLimits('auth-me', { userMax: 120, ipMax: 300 }), (req, res) => {
  const profile = db.prepare('SELECT * FROM profiles WHERE id = ?').get(req.userId)
  if (!profile) return res.status(404).json({ error: 'Profile not found' })
  return res.json({ user: publicProfile(profile) })
})
