import { useState } from 'react'
import { useReservations } from '../../hooks/useReservations'
import { useToast } from '../../context/ToastContext'
import ReservationForm from '../../components/reservas/ReservationForm'
import ReservationCard from '../../components/reservas/ReservationCard'
import ConfirmModal from '../../components/ui/ConfirmModal'
import Spinner from '../../components/ui/Spinner'

export default function ReservationsPage() {
  const { reservas, loading, cancelarReserva, refetch } = useReservations()
  const { showToast } = useToast()
  const [reservaACancelar, setReservaACancelar] = useState(null)
  const [cancelando, setCancelando] = useState(false)

  async function handleCancelar() {
    if (!reservaACancelar || cancelando) return
    setCancelando(true)
    try {
      await cancelarReserva(reservaACancelar.id)
      showToast('Reserva cancelada correctamente.', 'success')
      setReservaACancelar(null)
    } catch (err) {
      showToast('Error al cancelar la reserva: ' + (err.message || 'Inténtalo de nuevo.'), 'error')
    }
    setCancelando(false)
  }

  const hoy = new Date().setHours(0, 0, 0, 0)
  const reservasProximas = reservas.filter(r => new Date(r.fecha) >= hoy && r.estado !== 'cancelada')
  const reservasPasadas = reservas.filter(r => new Date(r.fecha) < hoy || r.estado === 'cancelada')

  return (
    <div className="py-12 px-container-margin max-w-7xl mx-auto pb-24 md:pb-12">
      <h1 className="font-display font-black text-headline-xl text-on-surface mb-2">Mis Reservas</h1>
      <div className="w-20 h-1 bg-secondary-container rounded-full mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Formulario nueva reserva */}
        <div className="card-elevated p-6">
          <h2 className="font-display font-bold text-title-md text-on-surface mb-6 flex items-center gap-2">
            <span className="icon text-2xl text-secondary-container">add_circle</span>
            Haz una Reserva
          </h2>
          <ReservationForm onCreated={refetch} />
        </div>

        {/* Lista de reservas */}
        <div className="flex flex-col gap-4">
          <h2 className="font-display font-bold text-title-md text-on-surface flex items-center gap-2">
            <span className="icon text-2xl text-secondary-container">event</span>
            Próximas Reservas
          </h2>

          {loading ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : reservasProximas.length === 0 ? (
            <div className="card-elevated p-8 text-center">
              <span className="icon text-4xl text-outline block mb-3">event_busy</span>
              <p className="text-body-md text-on-surface-variant font-body">No tienes reservas próximas.</p>
            </div>
          ) : (
            reservasProximas.map(r => (
              <ReservationCard
                key={r.id}
                reserva={r}
                onCancel={setReservaACancelar}
              />
            ))
          )}

          {reservasPasadas.length > 0 && (
            <>
              <h3 className="font-display font-bold text-label-bold text-on-surface-variant uppercase tracking-wider mt-4">
                Historial
              </h3>
              {reservasPasadas.slice(0, 5).map(r => (
                <ReservationCard key={r.id} reserva={r} />
              ))}
            </>
          )}
        </div>
      </div>

      <ConfirmModal
        open={!!reservaACancelar}
        title="Cancelar reserva"
        message={`¿Seguro que quieres cancelar la reserva del ${reservaACancelar ? new Date(reservaACancelar.fecha + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }) : ''}? Esta acción no se puede deshacer.`}
        confirmLabel="Sí, cancelar"
        cancelLabel="Volver"
        variant="danger"
        onConfirm={handleCancelar}
        onCancel={() => setReservaACancelar(null)}
        loading={cancelando}
      />
    </div>
  )
}
