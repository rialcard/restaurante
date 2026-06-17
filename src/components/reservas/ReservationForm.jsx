import { useEffect, useState } from 'react'
import { useReservations } from '../../hooks/useReservations'
import { useToast } from '../../context/ToastContext'
import DatePicker from './DatePicker'
import TimeSlotPicker from './TimeSlotPicker'
import PartySizeStepper from './PartySizeStepper'
import Spinner from '../ui/Spinner'

export default function ReservationForm({ onCreated }) {
  const { franjas, crearReserva, getDisponibilidadPorFranjas } = useReservations()
  const { showToast } = useToast()

  const [fecha, setFecha] = useState('')
  const [franjaId, setFranjaId] = useState('')
  const [numComensales, setNumComensales] = useState(2)
  const [notas, setNotas] = useState('')
  const [disponibilidad, setDisponibilidad] = useState({})
  const [cargandoDisp, setCargandoDisp] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!fecha || !franjas.length) return
    setCargandoDisp(true)
    setFranjaId('')
    getDisponibilidadPorFranjas(fecha, numComensales).then(disp => {
      setDisponibilidad(disp)
      setCargandoDisp(false)
    })
  }, [fecha, numComensales, franjas])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!fecha) { showToast('Selecciona una fecha.', 'error'); return }
    if (!franjaId) { showToast('Selecciona una franja horaria.', 'error'); return }
    if (submitting) return
    setSubmitting(true)
    try {
      const reserva = await crearReserva({ fecha, franja_horaria_id: franjaId, num_comensales: numComensales, notas: notas.trim() || null })
      showToast('¡Reserva creada correctamente!', 'success')
      setFecha(''); setFranjaId(''); setNumComensales(2); setNotas(''); setDisponibilidad({})
      if (onCreated) onCreated(reserva)
    } catch (err) {
      if (err.message?.includes('No hay disponibilidad')) {
        showToast('No hay disponibilidad para esa franja. Elige otra hora o fecha.', 'error')
      } else {
        showToast('Error al crear la reserva: ' + (err.message || 'Inténtalo de nuevo.'), 'error')
      }
    }
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      <div>
        <h3 className="font-display font-bold text-label-bold text-on-surface uppercase tracking-wider mb-3 flex items-center gap-2">
          <span className="icon text-xl text-secondary-container">calendar_today</span>
          1. Selecciona la fecha
        </h3>
        <DatePicker value={fecha} onChange={setFecha} />
      </div>

      {fecha && (
        <div>
          <h3 className="font-display font-bold text-label-bold text-on-surface uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="icon text-xl text-secondary-container">schedule</span>
            2. Elige la hora
          </h3>
          {cargandoDisp
            ? <div className="flex items-center gap-2 text-on-surface-variant font-body text-body-md"><Spinner size="sm" /> Comprobando disponibilidad...</div>
            : <TimeSlotPicker franjas={franjas} disponibilidad={disponibilidad} selected={franjaId} onSelect={setFranjaId} />
          }
        </div>
      )}

      {fecha && franjaId && (
        <>
          <div>
            <h3 className="font-display font-bold text-label-bold text-on-surface uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="icon text-xl text-secondary-container">group</span>
              3. Número de comensales
            </h3>
            <PartySizeStepper value={numComensales} min={1} max={20} onChange={setNumComensales} />
          </div>

          <div>
            <label className="field-label">Notas especiales (opcional)</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="Alergias, ocasión especial, preferencias..."
              value={notas}
              onChange={e => setNotas(e.target.value)}
              maxLength={500}
            />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? <Spinner size="sm" /> : <><span className="icon">check_circle</span> Confirmar Reserva</>}
          </button>
        </>
      )}
    </form>
  )
}
