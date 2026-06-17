import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMenu } from '../../hooks/useMenu'
import MenuTabs from '../../components/menu/MenuTabs'
import MenuGrid from '../../components/menu/MenuGrid'

export default function LandingPage() {
  const { secciones, platos, platosPorSeccion, loading } = useMenu()
  const [seccionActiva, setSeccionActiva] = useState(null)

  const platosVisibles = seccionActiva
    ? platosPorSeccion(seccionActiva)
    : platos

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=1280"
            alt="Hamburguesa artesanal Estan Burger"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/75 to-surface/40" />
        </div>
        <div className="relative z-10 text-center px-container-margin max-w-4xl mx-auto">
          <h1 className="font-display font-black text-display-lg text-on-surface mb-4 leading-none">
            Artesanales<br />
            <span className="text-secondary-container">y Jugosas</span>
          </h1>
          <p className="text-body-lg text-on-surface-variant font-body mb-8 max-w-xl mx-auto">
            Hamburguesas elaboradas con ingredientes premium y carne madurada a la parrilla volcánica.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/reservas" className="btn-primary px-8 py-4">
              <span className="icon">event</span>
              Reservar Ahora
            </Link>
            <a href="#menu" className="btn-secondary px-8 py-4">
              <span className="icon">restaurant_menu</span>
              Ver Menú
            </a>
          </div>
        </div>
        {/* Decoración naranja */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary-container to-transparent opacity-60" />
      </section>

      {/* Sección Menú */}
      <section id="menu" className="py-section-gap px-container-margin max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display font-black text-headline-xl text-on-surface mb-3">
            Nuestras Especialidades
          </h2>
          <div className="w-24 h-1 bg-secondary-container mx-auto rounded-full" />
        </div>

        <div className="mb-8">
          <MenuTabs
            secciones={secciones}
            activeId={seccionActiva}
            onSelect={setSeccionActiva}
          />
        </div>

        <MenuGrid platos={platosVisibles} loading={loading} />

        <div className="text-center mt-12">
          <Link to="/carta" className="btn-secondary px-8 py-4">
            Ver la carta completa
            <span className="icon">arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="bg-secondary-container py-16 px-container-margin">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <span className="icon text-8xl text-on-secondary-container/20">local_fire_department</span>
          <div>
            <h2 className="font-display font-black text-headline-lg text-on-secondary-container mb-2 uppercase">
              Sabor Ahumado
            </h2>
            <p className="text-body-lg text-on-secondary-container/80 font-body mb-6">
              Todas nuestras carnes se cocinan en parrilla volcánica para un sabor único e inigualable.
            </p>
            <Link to="/reservas" className="inline-flex items-center gap-2 px-6 py-3 bg-on-secondary-container text-secondary-container font-display font-bold text-label-bold uppercase tracking-wider rounded-lg transition-all hover:-translate-y-0.5">
              Reserva tu mesa
              <span className="icon">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Espacio para bottom nav */}
      <div className="h-16 md:h-0" />
    </>
  )
}
