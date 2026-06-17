import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function BottomNavMobile() {
  const { session } = useAuth()

  const items = [
    { to: '/', icon: 'home', label: 'Inicio', exact: true },
    { to: '/carta', icon: 'restaurant_menu', label: 'Carta' },
    { to: '/reservas', icon: 'event', label: 'Reservas' },
    { to: session ? '/reservas' : '/acceso', icon: 'account_circle', label: 'Perfil' },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-container-highest border-t border-outline-variant/30 h-16">
      <div className="h-full flex items-center justify-around">
        {items.map(item => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1 transition-all ${
                isActive ? 'text-secondary-fixed scale-110' : 'text-on-surface-variant'
              }`
            }
          >
            <span className="icon text-2xl">{item.icon}</span>
            <span className="text-caption font-body">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
