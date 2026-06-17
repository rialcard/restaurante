import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAdminReservations } from '../../hooks/useAdminReservations'
import { useAuth } from '../../context/AuthContext'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'

export default function AdminDashboardPage() {
  const { profile } = useAuth()
  const { reservas, loading, getStatsHoy } = useAdminReservations()
  const [stats, setStats] = useState({ totalReservas: 0, totalComensales: 0, ocupacion: 0 })

  useEffect(() => {
    getStatsHoy().then(setStats)
  }, [])

  const hoy = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const reservasHoy = reservas.filter(r => r.fecha === new Date().toISOString().split('T')[0])

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <p className="text-caption text-on-surface-variant font-body uppercase tracking-wider capitalize">{hoy}</p>
        <h1 className="font-display font-black text-headline-xl text-on-surface">Panel de Control</h1>
        <p className="text-body-md text-on-surface-variant font-body mt-1">
          Bienvenido, {profile?.nombre_completo || 'Administrador'}. Visión general del restaurante.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-elevated p-6 relative overflow-hidden">
          <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-secondary-container/10 flex items-center justify-center">
            <span className="icon text-3xl text-secondary-container">event</span>
          </div>
          <p className="text-caption text-on-surface-variant font-body uppercase tracking-wider mb-2">Reservas de Hoy</p>
          <span className="font-display font-black text-display-lg text-secondary-container">{stats.totalReservas}</span>
          <p className="text-body-md text-on-surface-variant font-body">reservas</p>
        </div>

        <div className="card-elevated p-6 relative overflow-hidden">
          <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-outline/5 flex items-center justify-center">
            <span className="icon text-3xl text-on-surface-variant">group</span>
          </div>
          <p className="text-caption text-on-surface-variant font-body uppercase tracking-wider mb-2">Total Comensales</p>
          <span className="font-display font-black text-display-lg text-on-surface">{stats.totalComensales}</span>
          <p className="text-body-md text-on-surface-variant font-body">personas</p>
        </div>

        <div className="card-elevated p-6">
          <p className="text-caption text-on-surface-variant font-body uppercase tracking-wider mb-2">Ocupación Estimada</p>
          <span className="font-display font-bold text-title-md text-secondary-container">{stats.ocupacion}%</span>
          <div className="mt-3 h-2 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-secondary-fixed to-secondary-container rounded-full shadow-glow transition-all duration-500"
              style={{ width: `${Math.min(stats.ocupacion, 100)}%` }}
            />
          </div>
          <p className="text-caption text-on-surface-variant font-body mt-2">
            {stats.ocupacion >= 80 ? 'Alta demanda' : stats.ocupacion >= 50 ? 'Demanda media' : 'Baja demanda'}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="font-display font-bold text-title-md text-on-surface mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { to: '/admin/carta', icon: 'restaurant_menu', label: 'Gestionar Carta' },
            { to: '/admin/reservas', icon: 'list_alt', label: 'Ver Reservas' },
          ].map(a => (
            <Link
              key={a.to}
              to={a.to}
              className="flex items-center gap-4 p-5 bg-surface-container-high border border-outline-variant/50 rounded-xl hover:bg-surface-container hover:border-secondary-container/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-surface-variant group-hover:bg-surface-bright flex items-center justify-center transition-colors">
                <span className="icon text-2xl text-on-surface-variant group-hover:text-secondary-container">{a.icon}</span>
              </div>
              <span className="font-display font-bold text-label-bold text-on-surface uppercase tracking-wider">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Próximas reservas del día */}
      <div className="card-elevated overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/30">
          <h2 className="font-display font-bold text-title-md text-on-surface">Reservas de Hoy</h2>
          <Link to="/admin/reservas" className="text-secondary-container text-body-md font-body hover:underline flex items-center gap-1">
            Ver todas <span className="icon text-lg">arrow_forward</span>
          </Link>
        </div>
        {loading ? (
          <div className="flex justify-center p-8"><Spinner /></div>
        ) : reservasHoy.length === 0 ? (
          <div className="p-8 text-center">
            <span className="icon text-4xl text-outline block mb-3">event_busy</span>
            <p className="text-body-md text-on-surface-variant font-body">No hay reservas para hoy.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-outline-variant/30">
                  <th className="text-left px-6 py-3 text-caption text-on-surface-variant font-body uppercase tracking-wider">Hora</th>
                  <th className="text-left px-6 py-3 text-caption text-on-surface-variant font-body uppercase tracking-wider">Cliente</th>
                  <th className="text-left px-6 py-3 text-caption text-on-surface-variant font-body uppercase tracking-wider">Pax</th>
                  <th className="text-left px-6 py-3 text-caption text-on-surface-variant font-body uppercase tracking-wider">Mesa</th>
                  <th className="text-left px-6 py-3 text-caption text-on-surface-variant font-body uppercase tracking-wider">Estado</th>
                </tr>
              </thead>
              <tbody>
                {reservasHoy.slice(0, 8).map(r => (
                  <tr key={r.id} className={`border-b border-outline-variant/20 hover:bg-surface-container transition-colors ${r.estado === 'cancelada' ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-4 font-body text-body-md text-secondary-container font-medium">
                      {String(r.franja_horaria?.hora || '--').slice(0, 5)}
                    </td>
                    <td className="px-6 py-4 font-body text-body-md text-on-surface">
                      <span className={r.estado === 'cancelada' ? 'line-through text-on-surface-variant' : ''}>
                        {r.cliente?.nombre_completo || r.cliente?.email || 'Desconocido'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-body text-body-md text-on-surface-variant">{r.num_comensales}</td>
                    <td className="px-6 py-4 font-body text-body-md text-on-surface-variant">{r.mesa_asignada || '—'}</td>
                    <td className="px-6 py-4"><Badge estado={r.estado} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
