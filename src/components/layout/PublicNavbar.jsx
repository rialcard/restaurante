import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

export default function PublicNavbar() {
  const { session, profile, isAdmin, signOut } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  async function handleSignOut() {
    try {
      await signOut()
      showToast('Sesión cerrada correctamente.', 'success')
      navigate('/')
    } catch {
      showToast('Error al cerrar sesión.', 'error')
    }
    setUserMenuOpen(false)
  }

  const navLinkClass = ({ isActive }) =>
    `font-body text-body-md transition-colors ${isActive ? 'text-secondary-container' : 'text-on-surface-variant hover:text-on-surface'}`

  return (
    <header className="sticky top-0 z-50 bg-surface-dim border-b border-outline-variant/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-container-margin py-stack-md flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-display font-black text-title-md text-secondary-container uppercase tracking-tight">
          Estan Burger
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/carta" className={navLinkClass}>Carta</NavLink>
          <NavLink to="/reservas" className={navLinkClass}>Reservas</NavLink>
        </nav>

        {/* Acciones usuario */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(v => !v)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-surface-container transition-colors"
              >
                <span className="icon text-2xl text-on-surface-variant">account_circle</span>
                <span className="text-body-md text-on-surface-variant font-body truncate max-w-[120px]">
                  {profile?.nombre_completo || profile?.email || 'Usuario'}
                </span>
                <span className="icon text-lg text-on-surface-variant">expand_more</span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface-container-high border border-outline-variant rounded-xl shadow-ambient-lg overflow-hidden">
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-3 text-body-md text-on-surface hover:bg-surface-container transition-colors font-body"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <span className="icon text-xl">admin_panel_settings</span>
                      Panel Admin
                    </Link>
                  )}
                  <Link
                    to="/reservas"
                    className="flex items-center gap-2 px-4 py-3 text-body-md text-on-surface hover:bg-surface-container transition-colors font-body"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <span className="icon text-xl">event</span>
                    Mis Reservas
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-3 text-body-md text-error hover:bg-error-container/20 transition-colors font-body border-t border-outline-variant"
                  >
                    <span className="icon text-xl">logout</span>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/acceso" className="btn-secondary py-2 px-4 text-sm">
                Iniciar Sesión
              </Link>
              <Link to="/acceso?modo=registro" className="btn-primary py-2 px-4 text-sm">
                Registrarse
              </Link>
            </>
          )}
        </div>

        {/* Hamburger mobile */}
        <button
          className="md:hidden p-2 text-on-surface-variant"
          onClick={() => setMenuOpen(v => !v)}
        >
          <span className="icon text-2xl">{menuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface-container-low border-t border-outline-variant/30 px-container-margin py-stack-md flex flex-col gap-4">
          <NavLink to="/carta" className={navLinkClass} onClick={() => setMenuOpen(false)}>Carta</NavLink>
          <NavLink to="/reservas" className={navLinkClass} onClick={() => setMenuOpen(false)}>Reservas</NavLink>
          {session ? (
            <>
              {isAdmin && (
                <Link to="/admin" className="text-body-md text-secondary-container font-body" onClick={() => setMenuOpen(false)}>
                  Panel Admin
                </Link>
              )}
              <button onClick={() => { handleSignOut(); setMenuOpen(false) }} className="text-left text-body-md text-error font-body">
                Cerrar Sesión
              </button>
            </>
          ) : (
            <Link to="/acceso" className="btn-primary w-full text-center" onClick={() => setMenuOpen(false)}>
              Iniciar Sesión
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
