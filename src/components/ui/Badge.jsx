export default function Badge({ estado }) {
  const map = {
    confirmada: 'badge-confirmada',
    pendiente: 'badge-pendiente',
    cancelada: 'badge-cancelada',
    activo: 'badge-activo',
    agotado: 'badge-agotado',
  }
  const labels = {
    confirmada: 'Confirmada',
    pendiente: 'Pendiente',
    cancelada: 'Cancelada',
    activo: 'Activo',
    agotado: 'Agotado',
  }

  return (
    <span className={map[estado] || 'badge bg-surface-variant text-on-surface'}>
      {labels[estado] || estado}
    </span>
  )
}
