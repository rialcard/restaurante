import MenuCard from './MenuCard'
import Spinner from '../ui/Spinner'

export default function MenuGrid({ platos, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="lg" />
      </div>
    )
  }

  if (platos.length === 0) {
    return (
      <div className="text-center py-16">
        <span className="icon text-5xl text-outline block mb-4">restaurant_menu</span>
        <p className="text-body-lg text-on-surface-variant font-body">No hay platos en esta categoría.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {platos.map((plato, index) => (
        <MenuCard key={plato.id} plato={plato} featured={index === 0 && platos.length > 2} />
      ))}
    </div>
  )
}
