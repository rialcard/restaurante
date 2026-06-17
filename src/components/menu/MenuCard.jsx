export default function MenuCard({ plato, featured = false }) {
  const precioFormateado = Number(plato.precio).toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  })

  if (featured) {
    return (
      <div className="menu-card md:flex-row flex-col flex col-span-1 md:col-span-2">
        {plato.imagen_url && (
          <div className="relative h-48 md:h-auto md:w-1/2 flex-shrink-0">
            <img
              src={plato.imagen_url}
              alt={plato.nombre}
              className="w-full h-full object-cover"
            />
            <div className="img-overlay" />
          </div>
        )}
        <div className="p-6 flex flex-col justify-center gap-3 flex-1">
          <span className="text-caption text-secondary uppercase tracking-wider font-body">Destacado</span>
          <h3 className="font-display font-bold text-headline-lg text-on-surface uppercase">{plato.nombre}</h3>
          {plato.descripcion && (
            <p className="text-body-md text-on-surface-variant font-body">{plato.descripcion}</p>
          )}
          <span className="font-display font-bold text-title-md text-secondary-container">{precioFormateado}</span>
          {plato.estado === 'agotado' && (
            <span className="badge-agotado self-start">Agotado</span>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="menu-card flex flex-col">
      {plato.imagen_url ? (
        <div className="relative h-48 flex-shrink-0">
          <img
            src={plato.imagen_url}
            alt={plato.nombre}
            className="w-full h-full object-cover"
          />
          <div className="img-overlay" />
          {plato.estado === 'agotado' && (
            <div className="absolute top-3 right-3">
              <span className="badge-agotado">Agotado</span>
            </div>
          )}
        </div>
      ) : (
        <div className="h-48 bg-surface-container flex items-center justify-center flex-shrink-0">
          <span className="icon text-5xl text-outline">restaurant</span>
        </div>
      )}
      <div className="p-6 flex flex-col gap-2 flex-1">
        <h3 className={`font-display font-bold text-title-md uppercase ${plato.estado === 'agotado' ? 'text-on-surface-variant' : 'text-on-surface'}`}>
          {plato.nombre}
        </h3>
        {plato.descripcion && (
          <p className="text-body-md text-on-surface-variant font-body flex-1 line-clamp-3">{plato.descripcion}</p>
        )}
        <span className={`font-display font-bold text-title-md mt-auto ${plato.estado === 'agotado' ? 'text-outline line-through' : 'text-secondary-container'}`}>
          {precioFormateado}
        </span>
      </div>
    </div>
  )
}
