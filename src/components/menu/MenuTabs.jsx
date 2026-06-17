export default function MenuTabs({ secciones, activeId, onSelect }) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full border font-body text-label-bold uppercase tracking-wider transition-all ${
          activeId === null
            ? 'bg-secondary-container/10 border-secondary-container text-secondary-container'
            : 'border-outline-variant text-on-surface-variant hover:border-outline hover:text-on-surface'
        }`}
      >
        Todos
      </button>
      {secciones.map(s => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border font-body text-label-bold uppercase tracking-wider transition-all ${
            activeId === s.id
              ? 'bg-secondary-container/10 border-secondary-container text-secondary-container'
              : 'border-outline-variant text-on-surface-variant hover:border-outline hover:text-on-surface'
          }`}
        >
          <span className="icon text-base">{s.icono || 'restaurant_menu'}</span>
          {s.nombre}
        </button>
      ))}
    </div>
  )
}
