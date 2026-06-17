import { useState } from 'react'
import { useMenu } from '../../hooks/useMenu'
import MenuTabs from '../../components/menu/MenuTabs'
import MenuGrid from '../../components/menu/MenuGrid'

export default function MenuPage() {
  const { secciones, platos, platosPorSeccion, loading } = useMenu()
  const [seccionActiva, setSeccionActiva] = useState(null)

  const platosVisibles = seccionActiva
    ? platosPorSeccion(seccionActiva)
    : platos

  return (
    <div className="py-12 px-container-margin max-w-7xl mx-auto pb-24 md:pb-12">
      <div className="mb-10">
        <h1 className="font-display font-black text-headline-xl text-on-surface mb-2">Nuestra Carta</h1>
        <div className="w-20 h-1 bg-secondary-container rounded-full" />
        <p className="text-body-lg text-on-surface-variant font-body mt-4">
          Elaborada con ingredientes premium y pasión por el sabor auténtico.
        </p>
      </div>

      <div className="mb-8">
        <MenuTabs secciones={secciones} activeId={seccionActiva} onSelect={setSeccionActiva} />
      </div>

      <MenuGrid platos={platosVisibles} loading={loading} />
    </div>
  )
}
