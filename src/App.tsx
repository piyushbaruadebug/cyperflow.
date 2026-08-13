import { DocumentationPage } from './pages/DocumentationPage'
import { ApiGuidePage } from './pages/ApiGuidePage'
import { HelpCenterPage } from './pages/HelpCenterPage'
import { CommunityPage } from './pages/CommunityPage'
import { MitLicensePage } from './pages/MitLicensePage'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AddExpensePage } from './pages/AddExpensePage'
import { BudgetPage } from './pages/BudgetPage'
import { ChatPage } from './pages/ChatPage'
import { DashboardPage } from './pages/DashboardPage'
import { HistoryPage } from './pages/HistoryPage'
import { LoginPage } from './pages/LoginPage'
import { InfoPage } from './pages/InfoPage'
import { JwtAuthenticationPage } from './pages/JwtAuthenticationPage'
import { AccountProfilePage } from './pages/AccountProfilePage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { DataPrivacyPage } from './pages/DataPrivacyPage'
import { EncryptedPasswordPage } from './pages/EncryptedPasswordPage'
import { useApp } from './store/appContext'

function RequireAuth({ children }: { children: React.ReactElement }) {
  const { user } = useApp()

  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  const { user, ready } = useApp()

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Loading…
      </div>
    )
  }

  return (
    <Routes>

      {/* Public information pages */}

      <Route path="/overview" element={<InfoPage />} />

      <Route path="/features" element={<InfoPage />} />

      <Route path="/security" element={<InfoPage />} />

      <Route
        path="/jwt-authentication"
        element={<JwtAuthenticationPage />}
      />

      <Route
        path="/account"
        element={<AccountProfilePage />}
      />

      <Route
        path="/reset-password"
        element={<ResetPasswordPage />}
      />

      <Route
        path="/data-privacy"
        element={<DataPrivacyPage />}
      />

      <Route
        path="/encrypted-password"
        element={<EncryptedPasswordPage />}
      />

      <Route path="/terms" element={<InfoPage />} />

      <Route path="/privacy" element={<InfoPage />} />

      <Route path="/cookies" element={<InfoPage />} />

      <Route path="/help" element={<InfoPage />} />
      <Route path="/documentation" element={<DocumentationPage />} />
<Route path="/api-guide" element={<ApiGuidePage />} />
<Route path="/help-center" element={<HelpCenterPage />} />
<Route path="/community" element={<CommunityPage />} />
<Route path="/mit-license" element={<MitLicensePage />} />


      {/* Login */}

      <Route
        path="/login"
        element={
          user
            ? <Navigate to="/dashboard" replace />
            : <LoginPage />
        }
      />


      {/* Protected application */}

      <Route
        element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }
      >
        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

        <Route
          path="/add"
          element={<AddExpensePage />}
        />

        <Route
          path="/history"
          element={<HistoryPage />}
        />

        <Route
          path="/budget"
          element={<BudgetPage />}
        />

        <Route
          path="/chat"
          element={<ChatPage />}
        />
      </Route>


      {/* Fallback */}

      <Route
        path="*"
        element={
          <Navigate
            to={user ? '/dashboard' : '/login'}
            replace
          />
        }
      />

    </Routes>
  )
}