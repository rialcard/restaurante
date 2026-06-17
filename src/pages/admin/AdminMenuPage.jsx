import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useToast } from '../../context/ToastContext'
import Badge from '../../components/ui/Badge'
import Modal from '../../components/ui/Modal'
import ConfirmModal from '../../components/ui/ConfirmModal'
import Spinner from '../../components/ui/Spinner'

const PLATO_INICIAL = { nombre: '', precio: '', seccion_id: '', descripcion: '', imagen_url: '', estado: 'activo' }
const SECCION_INICIAL = { nombre: '', icono: 'restaurant_menu', orden: 0 }

export default function AdminMenuPage() {
  const { showToast } = useToast()
  const [secciones, setSecciones] = useState([])
  const [platos, setPlatos] = useState([])
  const [loading, setLoading] = useState(true)

  const [platoModal, setPlatoModal] = useState(null) // null = cerrado, {} = nuevo, {id,...} = editar
  const [seccionModal, setSeccionModal] = useState(null)
  const [platoForm, setPlatoForm] = useState(PLATO_INICIAL)
  const [seccionForm, setSeccionForm] = useState(SECCION_INICIAL)
  const [eliminarPlato, setEliminarPlato] = useState(null)
  const [eliminarSeccion, setEliminarSeccion] = useState(null)
  const [procesando, setProcesando] = useState(false)

  async function fetchData() {
    setLoading(true)
    const [s, p] = await Promise.all([
      supabase.from('secciones_carta').select('*').order('orden'),
      supabase.from('platos').select('*').order('orden'),
    ])
    if (!s.error) setSecciones(s.data)
    if (!p.error) setPlatos(p.data)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  function platosDe(seccionId) {
    return platos.filter(p => p.seccion_id === seccionId)
  }

  function abrirNuevoPlato(seccionId = '') {
    setPlatoForm({ ...PLATO_INICIAL, seccion_id: seccionId })
    setPlatoModal({})
  }

  function abrirEditarPlato(plato) {
    setPlatoForm({ nombre: plato.nombre, precio: String(plato.precio), seccion_id: plato.seccion_id, descripcion: plato.descripcion || '', imagen_url: plato.imagen_url || '', estado: plato.estado })
    setPlatoModal(plato)
  }

  async function handleGuardarPlato(e) {
    e.preventDefault()
    if (!platoForm.nombre.trim()) { showToast('El nombre es obligatorio.', 'error'); return }
    if (!platoForm.precio || isNaN(Number(platoForm.precio))) { showToast('Introduce un precio válido.', 'error'); return }
    if (!platoForm.seccion_id) { showToast('Selecciona una categoría.', 'error'); return }
    setProcesando(true)
    try {
      const datos = {
        nombre: platoForm.nombre.trim(),
        precio: Number(platoForm.precio),
        seccion_id: platoForm.seccion_id,
        descripcion: platoForm.descripcion.trim() || null,
        imagen_url: platoForm.imagen_url.trim() || null,
        estado: platoForm.estado,
      }
      if (platoModal?.id) {
        const { error } = await supabase.from('platos').update(datos).eq('id', platoModal.id)
        if (error) throw error
        showToast('Plato actualizado.', 'success')
      } else {
        const { error } = await supabase.from('platos').insert(datos)
        if (error) throw error
        showToast('Plato creado correctamente.', 'success')
      }
      setPlatoModal(null)
      await fetchData()
    } catch (err) {
      showToast('Error: ' + (err.message || 'Inténtalo de nuevo.'), 'error')
    }
    setProcesando(false)
  }

  async function handleEliminarPlato() {
    if (!eliminarPlato || procesando) return
    setProcesando(true)
    try {
      const { error } = await supabase.from('platos').delete().eq('id', eliminarPlato.id)
      if (error) throw error
      showToast('Plato eliminado.', 'success')
      setEliminarPlato(null)
      await fetchData()
    } catch (err) {
      showToast('Error al eliminar: ' + (err.message || ''), 'error')
    }
    setProcesando(false)
  }

  async function handleGuardarSeccion(e) {
    e.preventDefault()
    if (!seccionForm.nombre.trim()) { showToast('El nombre es obligatorio.', 'error'); return }
    setProcesando(true)
    try {
      const datos = { nombre: seccionForm.nombre.trim(), icono: seccionForm.icono.trim() || 'restaurant_menu', orden: Number(seccionForm.orden) || 0 }
      if (seccionModal?.id) {
        const { error } = await supabase.from('secciones_carta').update(datos).eq('id', seccionModal.id)
        if (error) throw error
        showToast('Categoría actualizada.', 'success')
      } else {
        const { error } = await supabase.from('secciones_carta').insert(datos)
        if (error) throw error
        showToast('Categoría creada.', 'success')
      }
      setSeccionModal(null)
      await fetchData()
    } catch (err) {
      showToast('Error: ' + (err.message || ''), 'error')
    }
    setProcesando(false)
  }

  async function handleEliminarSeccion() {
    if (!eliminarSeccion || procesando) return
    setProcesando(true)
    try {
      const { error } = await supabase.from('secciones_carta').delete().eq('id', eliminarSeccion.id)
      if (error) throw error
      showToast('Categoría eliminada.', 'success')
      setEliminarSeccion(null)
      await fetchData()
    } catch (err) {
      if (err.message?.includes('foreign key') || err.message?.includes('violates')) {
        showToast('No se puede eliminar: la categoría tiene platos asignados. Elimina primero los platos.', 'error')
      } else {
        showToast('Error al eliminar: ' + (err.message || ''), 'error')
      }
    }
    setProcesando(false)
  }

  if (loading) {
    return <div className="flex justify-center py-16"><Spinner size="lg" /></div>
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-headline-xl text-on-surface">Gestión de Carta</h1>
          <p className="text-body-md text-on-surface-variant font-body mt-1">Administra categorías, platos y precios del menú.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => { setSeccionForm(SECCION_INICIAL); setSeccionModal({}) }} className="btn-secondary py-2 px-4 text-sm">
            <span className="icon text-base">add</span>
            Añadir Categoría
          </button>
          <button onClick={() => abrirNuevoPlato()} className="btn-primary py-2 px-4 text-sm">
            <span className="icon text-base">add</span>
            Nuevo Plato
          </button>
        </div>
      </div>

      {/* Cards por categoría */}
      {secciones.length === 0 ? (
        <div className="card-elevated p-8 text-center">
          <span className="icon text-5xl text-outline block mb-3">restaurant_menu</span>
          <p className="text-body-md text-on-surface-variant font-body mb-4">No hay categorías todavía.</p>
          <button onClick={() => { setSeccionForm(SECCION_INICIAL); setSeccionModal({}) }} className="btn-primary">
            Crear primera categoría
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {secciones.map(seccion => (
            <div key={seccion.id} className="card-elevated overflow-hidden flex flex-col hover:scale-[1.01] transition-transform duration-200">
              {/* Header categoría */}
              <div className="flex items-center justify-between p-5 bg-surface-container border-b border-outline-variant/30">
                <div className="flex items-center gap-3">
                  <span className="icon text-3xl text-secondary-container">{seccion.icono || 'restaurant_menu'}</span>
                  <div>
                    <h2 className="font-display font-bold text-title-md text-on-surface uppercase tracking-wide">
                      {seccion.nombre}
                    </h2>
                    <span className="text-caption text-on-surface-variant font-body">
                      {platosDe(seccion.id).length} platos
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setSeccionForm({ nombre: seccion.nombre, icono: seccion.icono || 'restaurant_menu', orden: seccion.orden }); setSeccionModal(seccion) }}
                    className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface transition-colors"
                  >
                    <span className="icon text-xl">edit</span>
                  </button>
                  <button
                    onClick={() => setEliminarSeccion(seccion)}
                    className="p-2 rounded-lg text-on-surface-variant hover:bg-error-container/20 hover:text-error transition-colors"
                  >
                    <span className="icon text-xl">delete</span>
                  </button>
                </div>
              </div>

              {/* Tabla de platos */}
              <div className="flex-1 overflow-x-auto">
                {platosDe(seccion.id).length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-body-md text-on-surface-variant font-body">Sin platos en esta categoría.</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-outline-variant/20">
                        <th className="text-left px-5 py-3 text-caption text-on-surface-variant font-body uppercase tracking-wider">Plato</th>
                        <th className="text-left px-4 py-3 text-caption text-on-surface-variant font-body uppercase tracking-wider">Precio</th>
                        <th className="text-left px-4 py-3 text-caption text-on-surface-variant font-body uppercase tracking-wider">Estado</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {platosDe(seccion.id).map(plato => (
                        <tr key={plato.id} className="border-b border-outline-variant/10 hover:bg-surface-container-low transition-colors group">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              {plato.imagen_url ? (
                                <img src={plato.imagen_url} alt={plato.nombre} className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                              ) : (
                                <div className="w-10 h-10 bg-surface-container rounded-lg flex items-center justify-center flex-shrink-0">
                                  <span className="icon text-lg text-outline">restaurant</span>
                                </div>
                              )}
                              <div>
                                <p className={`font-body text-body-md ${plato.estado === 'agotado' ? 'text-on-surface-variant' : 'text-on-surface'}`}>
                                  {plato.nombre}
                                </p>
                                {plato.descripcion && (
                                  <p className="text-caption text-on-surface-variant font-body line-clamp-1">{plato.descripcion}</p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-display font-bold text-label-bold text-secondary-container whitespace-nowrap">
                            {Number(plato.precio).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
                          </td>
                          <td className="px-4 py-3"><Badge estado={plato.estado} /></td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => abrirEditarPlato(plato)} className="p-1.5 rounded-lg hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors">
                                <span className="icon text-lg">edit</span>
                              </button>
                              <button onClick={() => setEliminarPlato(plato)} className="p-1.5 rounded-lg hover:bg-error-container/20 text-on-surface-variant hover:text-error transition-colors">
                                <span className="icon text-lg">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Footer añadir plato */}
              <div className="p-4 border-t border-outline-variant/20">
                <button
                  onClick={() => abrirNuevoPlato(seccion.id)}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-dashed border-outline-variant text-on-surface-variant hover:border-secondary-container hover:text-secondary-container transition-colors font-body text-body-md"
                >
                  <span className="icon text-xl">add</span>
                  Añadir plato
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Plato */}
      <Modal open={!!platoModal} onClose={() => setPlatoModal(null)} title={platoModal?.id ? 'Editar Plato' : 'Nuevo Plato'} size="lg">
        <form onSubmit={handleGuardarPlato} noValidate className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="field-label">Nombre del plato *</label>
              <input type="text" className="input-field" placeholder="Ej: La Estan Burger" value={platoForm.nombre} onChange={e => setPlatoForm(f => ({ ...f, nombre: e.target.value }))} required />
            </div>
            <div>
              <label className="field-label">Precio (€) *</label>
              <input type="number" className="input-field" placeholder="0.00" step="0.01" min="0" value={platoForm.precio} onChange={e => setPlatoForm(f => ({ ...f, precio: e.target.value }))} required />
            </div>
            <div>
              <label className="field-label">Categoría *</label>
              <select className="input-field" value={platoForm.seccion_id} onChange={e => setPlatoForm(f => ({ ...f, seccion_id: e.target.value }))} required>
                <option value="">Selecciona categoría...</option>
                {secciones.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">URL de imagen</label>
              <input type="url" className="input-field" placeholder="https://..." value={platoForm.imagen_url} onChange={e => setPlatoForm(f => ({ ...f, imagen_url: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label">Descripción</label>
              <textarea className="input-field resize-none" rows={3} placeholder="Ingredientes y detalles..." value={platoForm.descripcion} onChange={e => setPlatoForm(f => ({ ...f, descripcion: e.target.value }))} />
            </div>
            <div className="sm:col-span-2 flex items-center gap-3">
              <input type="checkbox" id="plato-activo" className="w-4 h-4 accent-[#FF4D00]" checked={platoForm.estado === 'activo'} onChange={e => setPlatoForm(f => ({ ...f, estado: e.target.checked ? 'activo' : 'agotado' }))} />
              <label htmlFor="plato-activo" className="text-body-md text-on-surface font-body cursor-pointer">
                Plato activo (visible en la carta)
              </label>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" className="btn-secondary" onClick={() => setPlatoModal(null)}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={procesando}>
              {procesando ? <Spinner size="sm" /> : <><span className="icon">save</span> Guardar Plato</>}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Sección */}
      <Modal open={!!seccionModal} onClose={() => setSeccionModal(null)} title={seccionModal?.id ? 'Editar Categoría' : 'Nueva Categoría'} size="sm">
        <form onSubmit={handleGuardarSeccion} noValidate className="flex flex-col gap-4">
          <div>
            <label className="field-label">Nombre *</label>
            <input type="text" className="input-field" placeholder="Ej: Hamburguesas" value={seccionForm.nombre} onChange={e => setSeccionForm(f => ({ ...f, nombre: e.target.value }))} required />
          </div>
          <div>
            <label className="field-label">Icono (Material Symbols)</label>
            <input type="text" className="input-field" placeholder="Ej: lunch_dining" value={seccionForm.icono} onChange={e => setSeccionForm(f => ({ ...f, icono: e.target.value }))} />
            {seccionForm.icono && (
              <div className="mt-2 flex items-center gap-2 text-on-surface-variant font-body text-body-md">
                <span className="icon text-2xl text-secondary-container">{seccionForm.icono}</span>
                Vista previa
              </div>
            )}
          </div>
          <div>
            <label className="field-label">Orden</label>
            <input type="number" className="input-field" min="0" value={seccionForm.orden} onChange={e => setSeccionForm(f => ({ ...f, orden: e.target.value }))} />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" className="btn-secondary" onClick={() => setSeccionModal(null)}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={procesando}>
              {procesando ? <Spinner size="sm" /> : <><span className="icon">save</span> Guardar</>}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={!!eliminarPlato}
        title="Eliminar plato"
        message={`¿Seguro que quieres eliminar "${eliminarPlato?.nombre}"? Esta acción no se puede deshacer.`}
        confirmLabel="Sí, eliminar"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={handleEliminarPlato}
        onCancel={() => setEliminarPlato(null)}
        loading={procesando}
      />

      <ConfirmModal
        open={!!eliminarSeccion}
        title="Eliminar categoría"
        message={`¿Seguro que quieres eliminar la categoría "${eliminarSeccion?.nombre}"? Asegúrate de que no tiene platos asignados.`}
        confirmLabel="Sí, eliminar"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={handleEliminarSeccion}
        onCancel={() => setEliminarSeccion(null)}
        loading={procesando}
      />
    </div>
  )
}
