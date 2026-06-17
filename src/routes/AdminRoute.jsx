import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Spinner from '../components/ui/Spinner'
import { useEffect, useRef } from 'react'

export default function AdminRoute() {
  const { session, isAdmin, loading } = useAuth()
  const { showToast } = useToast()
  const hasShownToast = useRef(false)

  useEffect(() => {
    if (!loading && session && !isAdmin && !hasShownToast.current) {
      hasShownToast.current = true
      showToast('No tienes permisos para acceder al panel de administración.', 'error')
    }
  }, [loading, session, isAdmin, showToast])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!session) return <Navigate to="/acceso" replace />
  if (!isAdmin) return <Navigate to="/" replace />

  return <Outlet />
}
