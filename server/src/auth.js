import 'dotenv/config'
import jwt from 'jsonwebtoken'

export const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET || JWT_SECRET === 'change-me-in-production') {
  throw new Error('JWT_SECRET must be set to a strong, unique value in server/.env')
}
const TOKEN_TTL = '7d'

export function signToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: TOKEN_TTL })
}

/** Rejects any request without a valid bearer token; every data route is scoped to req.userId. */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ error: 'Missing bearer token' })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.userId = payload.sub
    return next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}
