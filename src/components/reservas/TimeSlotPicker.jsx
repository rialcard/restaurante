export default function TimeSlotPicker({ franjas, disponibilidad, selected, onSelect }) {
  if (!franjas.length) {
    return <p className="text-body-md text-on-surface-variant font-body">No hay franjas disponibles.</p>
  }

  return (
    <div className="flex flex-wrap gap-2">
      {franjas.map(franja => {
        const disp = disponibilidad[franja.id]
        const lleno = disp?.lleno
        const isSelected = selected === franja.id

        return (
          <button
            key={franja.id}
            type="button"
            disabled={lleno}
            onClick={() => !lleno && onSelect(franja.id)}
            className={`
              px-4 py-2 rounded-full border font-body text-label-bold uppercase tracking-wider transition-all
              ${isSelected
                ? 'bg-secondary-container border-secondary-container text-on-secondary-container shadow-glow'
                : lleno
                  ? 'border-surface-variant text-outline cursor-not-allowed opacity-60'
                  : 'border-outline-variant text-on-surface-variant hover:border-secondary-container hover:text-secondary-container'
              }
            `}
          >
            {String(franja.hora).slice(0, 5)}
            {lleno && ' (Lleno)'}
          </button>
        )
      })}
    </div>
  )
}
