import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-container-margin">
      <div className="text-center">
        <span className="icon text-8xl text-secondary-container block mb-6">error</span>
        <h1 className="font-display font-black text-display-lg text-on-surface mb-4">404</h1>
        <p className="text-body-lg text-on-surface-variant font-body mb-8">
          Página no encontrada. Esta ruta no existe.
        </p>
        <Link to="/" className="btn-primary px-8 py-4">
          <span className="icon">home</span>
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
