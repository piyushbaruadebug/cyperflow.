import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useApp } from '../store/appContext'

const NAV_LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/add', label: 'Add Expense' },
  { to: '/history', label: 'Expense History' },
  { to: '/budget', label: 'Budget' },
  { to: '/chat', label: 'Financial Assistant' },
]

export function Layout() {
  const { user, logout } = useApp()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans flex flex-col justify-between">
      {/* Clideo-Style Top Navigation Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 sm:px-8">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <NavLink to="/dashboard" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 transition-transform group-hover:scale-105">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900">
                pennywise
              </span>
            </NavLink>

            {/* Navigation Bar Links */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-slate-100 text-blue-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          {/* Right Header Action Controls */}
          <div className="flex items-center gap-3">
            <NavLink
              to="/add"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all"
            >
              <span>+ Add Expense</span>
            </NavLink>

            <div className="h-5 w-[1px] bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden lg:inline text-xs font-semibold text-slate-700 capitalize">{user?.name}</span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              Log out
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <nav className="flex md:hidden overflow-x-auto border-t border-slate-100 px-4 py-2 gap-1 bg-white">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-slate-600'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-8">
        <Outlet />
      </main>

      {/* Clideo-Style Multi-Column Footer */}
      <footer className="border-t border-slate-200 bg-white pt-12 pb-8">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-5 pb-12 border-b border-slate-100">
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-900">Expense Tracking</h3>
              <ul className="space-y-2.5 text-xs text-slate-500">
                <li><NavLink to="/add" className="hover:text-slate-900">Add transaction</NavLink></li>
                <li><NavLink to="/history" className="hover:text-slate-900">Category breakdown</NavLink></li>
                <li><NavLink to="/history" className="hover:text-slate-900">Search & filter</NavLink></li>
                <li><NavLink to="/history" className="hover:text-slate-900">Monthly history</NavLink></li>
                <li><NavLink to="/dashboard" className="hover:text-slate-900">CSV Export</NavLink></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-900">Budgeting Tools</h3>
              <ul className="space-y-2.5 text-xs text-slate-500">
                <li><NavLink to="/budget" className="hover:text-slate-900">Monthly limits</NavLink></li>
                <li><NavLink to="/budget" className="hover:text-slate-900">Category budget</NavLink></li>
                <li><NavLink to="/dashboard" className="hover:text-slate-900">Savings target</NavLink></li>
                <li><NavLink to="/dashboard" className="hover:text-slate-900">Budget alerts</NavLink></li>
                <li><NavLink to="/budget" className="hover:text-slate-900">Auto recalculate</NavLink></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-900">Financial Insights</h3>
              <ul className="space-y-2.5 text-xs text-slate-500">
                <li><NavLink to="/dashboard" className="hover:text-slate-900">Spending charts</NavLink></li>
                <li><NavLink to="/dashboard" className="hover:text-slate-900">Trend comparison</NavLink></li>
                <li><NavLink to="/chat" className="hover:text-slate-900">Financial assistant</NavLink></li>
                <li><NavLink to="/dashboard" className="hover:text-slate-900">Average transaction</NavLink></li>
                <li><NavLink to="/dashboard" className="hover:text-slate-900">Monthly reports</NavLink></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-900">Account & Security</h3>
              <ul className="space-y-2.5 text-xs text-slate-500">
                <li><NavLink to="/login" className="hover:text-slate-900">Account profile</NavLink></li>
                <li><NavLink to="/login" className="hover:text-slate-900">Reset password</NavLink></li>
                <li><NavLink to="/login" className="hover:text-slate-900">JWT Authentication</NavLink></li>
                <li><NavLink to="/login" className="hover:text-slate-900">Data privacy</NavLink></li>
                <li><NavLink to="/login" className="hover:text-slate-900">Encrypted password</NavLink></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-900">Resources</h3>
              <ul className="space-y-2.5 text-xs text-slate-500">
                <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-900">Documentation</a></li>
                <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-900">API Guide</a></li>
                <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-900">Help Center</a></li>
                <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-900">Community</a></li>
                <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-900">MIT License</a></li>
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

