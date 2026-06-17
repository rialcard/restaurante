import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

const navItems = [
  { to: '/admin', icon: 'dashboard', label: 'Dashboard', exact: true },
  { to: '/admin/reservas', icon: 'event_note', label: 'Reservas' },
  { to: '/admin/carta', icon: 'restaurant_menu', label: 'Carta' },
]

export default function AdminTopBarMobile() {
  const { signOut } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  async function handleSignOut() {
    try {
      await signOut()
      showToast('Sesión cerrada.', 'success')
      navigate('/')
    } catch {
      showToast('Error al cerrar sesión.', 'error')
    }
  }

  return (
    <header className="lg:hidden sticky top-0 z-50 bg-surface-dim border-b border-outline-variant/30">
      <div className="flex items-center justify-between px-container-margin py-stack-md">
        <button onClick={() => setOpen(v => !v)} className="text-on-surface-variant">
          <span className="icon text-2xl">{open ? 'close' : 'menu'}</span>
        </button>
        <span className="font-display font-black text-headline-lg-mobile text-secondary-container uppercase tracking-tight">
          Estan Burger
        </span>
        <span className="icon text-2xl text-on-surface-variant">account_circle</span>
      </div>
      {open && (
        <nav className="bg-surface-container-low border-t border-outline-variant/30 px-container-margin py-stack-md flex flex-col gap-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-body text-body-md ${
                  isActive
                    ? 'bg-secondary-container text-on-secondary-container'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`
              }
            >
              <span className="icon text-2xl">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error-container/20 transition-colors font-body text-body-md mt-2 border-t border-outline-variant/30 pt-4"
          >
            <span className="icon text-2xl">logout</span>
            Cerrar Sesión
          </button>
        </nav>
      )}
    </header>
  )
}
