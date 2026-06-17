import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminRoute from './routes/AdminRoute'

import LandingPage from './pages/public/LandingPage'
import MenuPage from './pages/public/MenuPage'
import AuthPage from './pages/public/AuthPage'
import NotFoundPage from './pages/public/NotFoundPage'
import ReservationsPage from './pages/client/ReservationsPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminReservationsPage from './pages/admin/AdminReservationsPage'
import AdminMenuPage from './pages/admin/AdminMenuPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Rutas públicas */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/carta" element={<MenuPage />} />
              <Route path="/acceso" element={<AuthPage />} />

              {/* Rutas privadas de cliente */}
              <Route element={<ProtectedRoute />}>
                <Route path="/reservas" element={<ReservationsPage />} />
              </Route>
            </Route>

            {/* Rutas de administración */}
            <Route element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/reservas" element={<AdminReservationsPage />} />
                <Route path="/admin/carta" element={<AdminMenuPage />} />
              </Route>
            </Route>

            {/* Redirecciones y 404 */}
            <Route path="/login" element={<Navigate to="/acceso" replace />} />
            <Route path="/registro" element={<Navigate to="/acceso?modo=registro" replace />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
