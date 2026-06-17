import Badge from '../ui/Badge'

export default function ReservationCard({ reserva, onCancel, selected = false, onClick }) {
  const fecha = new Date(reserva.fecha + 'T00:00:00')
  const fechaStr = fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
  const horaStr = reserva.franja_horaria?.hora ? String(reserva.franja_horaria.hora).slice(0, 5) : '--:--'

  return (
    <div
      onClick={onClick}
      className={`card-elevated transition-all duration-200 overflow-hidden ${onClick ? 'cursor-pointer hover:-translate-y-1' : ''} ${selected ? 'border-secondary-container shadow-glow' : ''}`}
    >
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="bg-surface-variant rounded-lg px-3 py-2 text-center min-w-[56px]">
              <span className="font-display font-bold text-title-md text-secondary-container block">{horaStr}</span>
            </div>
            <div>
              <p className="font-display font-bold text-label-bold text-on-surface">
                Mesa para {reserva.num_comensales}
              </p>
              <p className="text-caption text-on-surface-variant font-body capitalize">{fechaStr}</p>
              {reserva.mesa_asignada && (
                <p className="text-caption text-on-surface-variant font-body">Mesa: {reserva.mesa_asignada}</p>
              )}
            </div>
          </div>
          <Badge estado={reserva.estado} />
        </div>

        {reserva.notas && (
          <p className="text-caption text-on-surface-variant font-body italic border-l-2 border-secondary-container/30 pl-3">
            {reserva.notas}
          </p>
        )}

        {reserva.estado !== 'cancelada' && onCancel && (
          <div className="border-t border-outline-variant/30 pt-3 flex gap-2">
            <button
              onClick={e => { e.stopPropagation(); onCancel(reserva) }}
              className="btn-danger py-2 px-4 text-sm flex-1"
            >
              <span className="icon text-base">cancel</span>
              Cancelar
            </button>
          </div>
        )}
        {reserva.estado === 'cancelada' && (
          <p className="text-caption text-error font-body italic">Esta reserva fue cancelada.</p>
        )}
      </div>
    </div>
  )
}
