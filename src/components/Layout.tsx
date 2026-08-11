import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useApp } from '../store/appContext'

const NAV = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    ),
  },
  {
    to: '/add',
    label: 'Add Expense',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    to: '/history',
    label: 'Expense History',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
  },
  {
    to: '/budget',
    label: 'Budget',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
        />
      </svg>
    ),
  },
  {
    to: '/chat',
    label: 'AI Chatbot',
    badge: 'Groq',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
        />
      </svg>
    ),
  },
]

export function Layout() {
  const { user, logout } = useApp()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 lg:flex">
      {/* Sidebar */}
      <aside className="border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-dark-900 to-slate-950 backdrop-blur-xl lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between border-b border-blue-500/10 px-6 py-6">
          <div>
            <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-300 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent drop-shadow-[0_0_16px_rgba(59,130,246,0.28)]">
              Pennywise AI
            </span>
          </div>
        </div>

        {/* Navigation items with smooth hover effects */}
        <nav className="flex gap-1.5 overflow-x-auto px-4 pb-4 lg:flex-col lg:overflow-visible">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center gap-3 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600/90 to-blue-600/90 text-white shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/30'
                    : 'text-slate-400 hover:bg-dark-800/80 hover:text-white hover:translate-x-1'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`transition-colors duration-200 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-accent-cyan'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-indigo-500/20 text-indigo-300 group-hover:bg-indigo-500/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Header bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-800/80 bg-dark-900/80 px-6 py-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600/20 text-sm font-bold text-accent-cyan ring-1 ring-accent-cyan/30">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-xs text-slate-400">Welcome back,</p>
              <p className="text-sm font-semibold capitalize text-slate-100">{user?.name}</p>
            </div>
          </div>

          <button type="button" className="btn-ghost text-xs" onClick={handleLogout}>
            Log out
          </button>
        </header>

        {/* Dynamic page outlet */}
        <main className="mx-auto w-full max-w-7xl flex-1 p-6 lg:p-8">
          <Outlet />
        </main>

        <footer className="border-t border-slate-800/80 bg-dark-900/80 px-6 py-3 text-center text-xs text-slate-500">
          <span>© 2026 Pennywise AI. Licensed under MIT.</span>
        </footer>
      </div>
    </div>
  )
}
