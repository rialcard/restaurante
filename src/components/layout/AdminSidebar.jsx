import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

const navItems = [
  { to: '/admin', icon: 'dashboard', label: 'Dashboard', exact: true },
  { to: '/admin/reservas', icon: 'event_note', label: 'Reservas' },
  { to: '/admin/carta', icon: 'restaurant_menu', label: 'Gestión de Carta' },
]

export default function AdminSidebar() {
  const { profile, signOut } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  async function handleSignOut() {
    try {
      await signOut()
      showToast('Sesión cerrada correctamente.', 'success')
      navigate('/')
    } catch {
      showToast('Error al cerrar sesión.', 'error')
    }
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-surface-container-low border-r border-outline-variant/30 min-h-screen fixed left-0 top-0 z-40">
      <div className="p-6 border-b border-outline-variant/30">
        <span className="font-display font-black text-title-md text-secondary-container uppercase tracking-tight block">
          Estan Burger
        </span>
        <span className="text-caption text-on-surface-variant uppercase tracking-widest font-body">
          Admin Dashboard
        </span>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-body text-body-md ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container shadow-glow'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`
            }
          >
            <span className="icon text-2xl">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-outline-variant/30">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <span className="icon text-2xl text-on-surface-variant">account_circle</span>
          <div className="flex-1 min-w-0">
            <p className="text-label-bold text-on-surface font-body truncate">
              {profile?.nombre_completo || 'Admin'}
            </p>
            <p className="text-caption text-on-surface-variant font-body truncate">
              {profile?.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error-container/20 transition-colors font-body text-body-md"
        >
          <span className="icon text-2xl">logout</span>
          Cerrar Sesión
        </button>
      </div>
    </aside>
  )
}
