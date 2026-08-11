import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useApp } from '../store/appContext'

export function LoginPage() {
  const { login, signup } = useApp()
  const navigate = useNavigate()
  const location = useLocation()
  const resetToken = new URLSearchParams(location.search).get('reset') ?? ''
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [resetPassword, setResetPassword] = useState('')
  const [forgotEmail, setForgotEmail] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [forgotMode, setForgotMode] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!email.includes('@')) {
      setError('Enter a valid email address.')
      return
    }
    if (!password) {
      setError('Enter your password.')
      return
    }
    if (mode === 'signup' && password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (mode === 'signup' && name.trim().length < 2) {
      setError('Enter your full name.')
      return
    }

    setError('')
    setMessage('')
    setBusy(true)
    try {
      if (mode === 'signup') {
        await signup(name.trim(), email, password)
      } else {
        await login(email, password)
      }
      navigate('/dashboard')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  const handleForgotPassword = async (event: FormEvent) => {
    event.preventDefault()
    if (!forgotEmail.includes('@')) {
      setError('Enter a valid email address.')
      return
    }

    setError('')
    setMessage('')
    setBusy(true)
    try {
      await api.forgotPassword(forgotEmail)
      setMessage('If an account exists, a reset link has been sent.')
      setForgotMode(false)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  const handleResetPassword = async (event: FormEvent) => {
    event.preventDefault()
    if (!resetToken) {
      setError('Reset token is missing.')
      return
    }
    if (resetPassword.length < 8) {
      setError('New password must be at least 8 characters.')
      return
    }

    setError('')
    setMessage('')
    setBusy(true)
    try {
      await api.resetPassword(resetToken, resetPassword)
      setMessage('Password updated successfully. You can sign in now.')
      setResetPassword('')
      setTimeout(() => navigate('/login', { replace: true }), 1200)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  const passwordInputClasses = 'input pr-12'

  const resetPasswordVisible = Boolean(resetToken)

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-dark-950 to-blue-950/70 p-6 text-slate-100">
      <div className="w-full max-w-md space-y-6">
        <div className="-mt-6 mb-2 text-center space-y-2 sm:-mt-8">
          <h1 className="inline-block bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent drop-shadow-[0_0_20px_rgba(59,130,246,0.32)] sm:text-5xl">
            Pennywise AI
          </h1>
          <p className="text-base text-slate-400">Personal finance analytics & AI assistant</p>
        </div>

        <div className="card border border-slate-800/90 bg-dark-900/90 shadow-2xl backdrop-blur-xl p-8 rounded-3xl">
          {!resetPasswordVisible ? (
            <>
              <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-dark-950 p-1 border border-slate-800">
                {(['login', 'signup'] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => {
                      setMode(option)
                      setError('')
                      setMessage('')
                      setForgotMode(false)
                    }}
                    className={`rounded-lg py-2 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                      mode === option
                        ? 'bg-gradient-to-r from-brand-600 to-blue-600 text-white shadow-md shadow-blue-500/20'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {option === 'login' ? 'Log In' : 'Sign Up'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="label" htmlFor="name">
                      Full Name
                    </label>
                    <input
                      id="name"
                      className="input"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Piyush Barua"
                    />
                  </div>
                )}
                <div>
                  <label className="label" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="input"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                <div>
                  <label className="label" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className={passwordInputClasses}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-200"
                      onClick={() => setShowPassword((value) => !value)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                          <path d="M3 3l18 18" />
                          <path d="M10.6 10.6a2.5 2.5 0 003.4 3.4" />
                          <path d="M9.2 5.2A10.8 10.8 0 0112 5c4.2 0 7.8 2.5 9.5 6.2a10.9 10.9 0 01-2.3 3.2" />
                          <path d="M6.1 7.9A10.9 10.9 0 002.5 11.2a10.8 10.8 0 003.5 4.6" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {mode === 'login' && (
                  <div className="text-right">
                    <button type="button" className="text-sm text-blue-400 hover:text-blue-300" onClick={() => setForgotMode(true)}>
                      Forgot password?
                    </button>
                  </div>
                )}

                {forgotMode && (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <label className="label" htmlFor="forgotEmail">
                      Recover account
                    </label>
                    <input
                      id="forgotEmail"
                      type="email"
                      className="input"
                      value={forgotEmail}
                      onChange={(event) => setForgotEmail(event.target.value)}
                      placeholder="you@example.com"
                    />
                    <button type="button" className="btn-secondary mt-3 w-full py-2 text-sm" disabled={busy} onClick={() => void handleForgotPassword({ preventDefault() {} } as FormEvent)}>
                      {busy ? 'Please wait…' : 'Send reset link'}
                    </button>
                  </div>
                )}

                {error && <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-400">{error}</p>}
                {message && <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">{message}</p>}

                <button type="submit" className="btn-primary w-full py-3 text-base" disabled={busy}>
                  {busy ? 'Please wait…' : mode === 'login' ? 'Sign In to Pennywise AI' : 'Create Account'}
                </button>
              </form>
            </>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-white">Set a new password</h2>
                <p className="mt-2 text-sm text-slate-400">Choose a new password for your account.</p>
              </div>

              <div>
                <label className="label" htmlFor="resetPassword">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="resetPassword"
                    type={showResetPassword ? 'text' : 'password'}
                    className={passwordInputClasses}
                    value={resetPassword}
                    onChange={(event) => setResetPassword(event.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-200"
                    onClick={() => setShowResetPassword((value) => !value)}
                    aria-label={showResetPassword ? 'Hide password' : 'Show password'}
                  >
                    {showResetPassword ? (
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.6a2.5 2.5 0 003.4 3.4" />
                        <path d="M9.2 5.2A10.8 10.8 0 0112 5c4.2 0 7.8 2.5 9.5 6.2a10.9 10.9 0 01-2.3 3.2" />
                        <path d="M6.1 7.9A10.9 10.9 0 002.5 11.2a10.8 10.8 0 003.5 4.6" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current stroke-2">
                        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {error && <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-400">{error}</p>}
              {message && <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">{message}</p>}

              <button type="submit" className="btn-primary w-full py-3 text-base" disabled={busy}>
                {busy ? 'Please wait…' : 'Update Password'}
              </button>
              <button type="button" className="w-full text-sm text-blue-400 hover:text-blue-300" onClick={() => navigate('/login')}>
                Back to sign in
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-[11px] text-slate-500">
            © 2026 Pennywise AI • Licensed under MIT
          </p>
        </div>
      </div>
    </div>
  )
}
