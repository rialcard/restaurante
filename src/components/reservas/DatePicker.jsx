import { useState } from 'react'

const DIAS_SEMANA = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do']
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export default function DatePicker({ value, onChange }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [viewDate, setViewDate] = useState(() => {
    const d = value ? new Date(value + 'T00:00:00') : new Date()
    return new Date(d.getFullYear(), d.getMonth(), 1)
  })

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  // Días de la semana ajustados a lunes=0
  let startDow = firstDay.getDay() - 1
  if (startDow < 0) startDow = 6

  const dias = []
  for (let i = 0; i < startDow; i++) dias.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) dias.push(d)

  function prevMonth() {
    setViewDate(new Date(year, month - 1, 1))
  }
  function nextMonth() {
    setViewDate(new Date(year, month + 1, 1))
  }

  function selectDay(day) {
    if (!day) return
    const selected = new Date(year, month, day)
    if (selected < today) return
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    onChange(iso)
  }

  function isSelected(day) {
    if (!day || !value) return false
    const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return iso === value
  }

  function isPast(day) {
    if (!day) return false
    const d = new Date(year, month, day)
    return d < today
  }

  function isToday(day) {
    if (!day) return false
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear()
  }

  return (
    <div className="bg-surface-container rounded-xl p-4">
      {/* Header mes */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={prevMonth}
          className="p-2 rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface"
        >
          <span className="icon text-xl">chevron_left</span>
        </button>
        <span className="font-display font-bold text-label-bold text-on-surface uppercase tracking-wider">
          {MESES[month]} {year}
        </span>
        <button
          type="button"
          onClick={nextMonth}
          className="p-2 rounded-lg hover:bg-surface-container-high transition-colors text-on-surface-variant hover:text-on-surface"
        >
          <span className="icon text-xl">chevron_right</span>
        </button>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DIAS_SEMANA.map(d => (
          <div key={d} className="text-center text-caption text-on-surface-variant font-body py-1 uppercase tracking-wider">
            {d}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-1">
        {dias.map((day, i) => (
          <button
            key={i}
            type="button"
            onClick={() => selectDay(day)}
            disabled={!day || isPast(day)}
            className={`
              aspect-square flex items-center justify-center rounded-lg text-body-md font-body transition-all
              ${!day ? 'invisible' : ''}
              ${isPast(day) ? 'text-outline cursor-not-allowed' : ''}
              ${isSelected(day) ? 'bg-secondary-container text-on-secondary-container font-bold scale-105 shadow-glow' : ''}
              ${!isSelected(day) && !isPast(day) && isToday(day) ? 'border border-secondary-container text-secondary-container' : ''}
              ${!isSelected(day) && !isPast(day) && !isToday(day) && day ? 'hover:bg-surface-variant text-on-surface' : ''}
            `}
          >
            {day}
          </button>
        ))}
      </div>
    </div>
  )
}
