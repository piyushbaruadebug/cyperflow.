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
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans flex flex-col justify-between">
      {/* Clideo Top Header Bar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900">
                pennywise
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
              <span className="cursor-pointer hover:text-slate-900">Overview</span>
              <span className="cursor-pointer hover:text-slate-900">Features ▾</span>
              <span className="cursor-pointer hover:text-slate-900">Security</span>
              <span className="cursor-pointer hover:text-slate-900">Pricing</span>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => { setMode('login'); setForgotMode(false); }}
              className="rounded-xl px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setForgotMode(false); }}
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all"
            >
              Sign up
            </button>
          </div>
        </div>
      </header>

      {/* Clideo Main Hero Content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10 sm:px-8">
        <section className="text-center py-6 sm:py-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Home &gt; Personal Finance
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Personal Finance
          </h1>
          <p className="mt-3 text-base text-slate-500 max-w-lg mx-auto font-normal">
            Track daily spending, set monthly budgets, and grow savings online
          </p>
        </section>

        {/* Hero Form & Preview Card Grid */}
        <div className="mx-auto max-w-4xl grid gap-8 md:grid-cols-2 items-start pt-4">
          {/* Left Form Card */}
          <div className="rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xl shadow-slate-900/5">
            {!resetPasswordVisible ? (
              <>
                <div className="mb-6 grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
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
                      className={`rounded-lg py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                        mode === option
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                          : 'text-slate-600 hover:text-slate-900'
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
                    <button type="button" className="text-sm font-semibold text-apex-blue hover:underline" onClick={() => setForgotMode(true)}>
                      Forgot password?
                    </button>
                  </div>
                )}

                {forgotMode && (
                  <div className="rounded-2xl border border-black/[0.08] bg-apex-canvas p-4">
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
              <button type="button" className="w-full text-sm text-blue-600 hover:underline" onClick={() => navigate('/login')}>
                Back to sign in
              </button>
            </form>
          )}
          </div>

          {/* Right Side Clideo Showcase Preview Card */}
          <div className="space-y-6">
            <div className="relative rounded-3xl bg-slate-100 p-6 border border-slate-200/80 shadow-inner">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Dashboard Preview</span>
                <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-extrabold text-white shadow-md shadow-emerald-500/30">
                  -72% Saved
                </span>
              </div>

              {/* Sample Card Stack like Clideo Image Compression demo */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-200/80 shadow-md">
                  <span className="absolute top-3 right-3 rounded-lg bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white">
                    Budget Limit
                  </span>
                  <p className="text-xs font-semibold text-slate-400">Monthly Target</p>
                  <p className="mt-2 text-2xl font-black text-slate-900">₹34,000</p>
                  <p className="mt-1 text-[11px] text-slate-500">Allocated budget</p>
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-white p-5 border border-slate-200/80 shadow-md">
                  <span className="absolute top-3 right-3 rounded-lg bg-blue-600 px-2 py-0.5 text-[10px] font-bold text-white">
                    Actual Spent
                  </span>
                  <p className="text-xs font-semibold text-slate-400">Monthly Spending</p>
                  <p className="mt-2 text-2xl font-black text-slate-900">₹9,320</p>
                  <p className="mt-1 text-[11px] text-emerald-600 font-bold">₹24,680 remaining</p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-white p-5 border border-slate-200/80 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Safety Net Savings Progress</p>
                  <p className="text-xs text-slate-500">20% rule automated target</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-24 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[72%] bg-emerald-500 rounded-full" />
                  </div>
                  <span className="text-xs font-bold text-slate-900">72%</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center text-xs text-slate-500 shadow-sm">
              🔒 Encrypted JWT Authentication • Isolated per user • MIT Licensed
            </div>
          </div>
        </div>
      </main>

      {/* Clideo Footer */}
      <footer className="border-t border-slate-200 bg-white pt-12 pb-8">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5 pb-12 border-b border-slate-100">
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-900">Expense Tracking</h3>
              <ul className="space-y-2.5 text-xs text-slate-500">
                <li>Add transaction</li>
                <li>Category breakdown</li>
                <li>Search & filter</li>
                <li>Monthly history</li>
                <li>CSV Export</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-900">Budgeting Tools</h3>
              <ul className="space-y-2.5 text-xs text-slate-500">
                <li>Monthly limits</li>
                <li>Category budget</li>
                <li>Savings target</li>
                <li>Budget alerts</li>
                <li>Auto recalculate</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-900">Financial Insights</h3>
              <ul className="space-y-2.5 text-xs text-slate-500">
                <li>Spending charts</li>
                <li>Trend comparison</li>
                <li>Financial assistant</li>
                <li>Average transaction</li>
                <li>Monthly reports</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-900">Account & Security</h3>
              <ul className="space-y-2.5 text-xs text-slate-500">
                <li>Account profile</li>
                <li>Reset password</li>
                <li>JWT Authentication</li>
                <li>Data privacy</li>
                <li>Encrypted password</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-900">Resources</h3>
              <ul className="space-y-2.5 text-xs text-slate-500">
                <li>Documentation</li>
                <li>API Guide</li>
                <li>Help Center</li>
                <li>Community</li>
                <li>MIT License</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 pt-6 sm:flex-row text-xs text-slate-500">
            <p>© 2019 – 2026 Pennywise Ltd. All rights reserved</p>
            <div className="flex flex-wrap items-center gap-6">
              <span className="hover:text-slate-900 cursor-pointer">Terms</span>
              <span className="hover:text-slate-900 cursor-pointer">Privacy</span>
              <span className="hover:text-slate-900 cursor-pointer">Cookies</span>
              <span className="hover:text-slate-900 cursor-pointer">Refund</span>
              <span className="hover:text-slate-900 cursor-pointer">Help</span>
              <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-700">
                🌐 English ▾
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

