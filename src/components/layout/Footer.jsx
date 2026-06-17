import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/30 py-section-gap mb-16 md:mb-0">
      <div className="max-w-7xl mx-auto px-container-margin grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <span className="font-display font-black text-title-md text-secondary-container uppercase tracking-tight">
            Estan Burger
          </span>
          <p className="mt-2 text-body-md text-on-surface-variant font-body">
            Hamburguesas artesanales con el mejor sabor a la brasa.
          </p>
        </div>
        <div>
          <h3 className="font-display font-bold text-label-bold text-on-surface uppercase tracking-wider mb-3">
            Menú
          </h3>
          <ul className="flex flex-col gap-2">
            <li><Link to="/carta" className="text-body-md text-on-surface-variant hover:text-secondary-container font-body transition-colors">Nuestra Carta</Link></li>
            <li><Link to="/reservas" className="text-body-md text-on-surface-variant hover:text-secondary-container font-body transition-colors">Reservar Mesa</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-display font-bold text-label-bold text-on-surface uppercase tracking-wider mb-3">
            Información
          </h3>
          <ul className="flex flex-col gap-2">
            <li className="text-body-md text-on-surface-variant font-body">Lunes a Domingo</li>
            <li className="text-body-md text-on-surface-variant font-body">13:00 – 16:00 | 20:00 – 22:30</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-container-margin mt-8 pt-6 border-t border-outline-variant/30">
        <p className="text-caption text-on-surface-variant font-body text-center">
          © {new Date().getFullYear()} Estan Burger. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  )
}
