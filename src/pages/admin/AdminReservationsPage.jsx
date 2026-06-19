import { useState } from 'react'
import { useAdminReservations } from '../../hooks/useAdminReservations'
import { useToast } from '../../context/ToastContext'
import Badge from '../../components/ui/Badge'
import ConfirmModal from '../../components/ui/ConfirmModal'
import Modal from '../../components/ui/Modal'
import Spinner from '../../components/ui/Spinner'

export default function AdminReservationsPage() {
  const { reservas, loading, filtros, setFiltros, actualizarReserva, cancelarReserva } = useAdminReservations()
  const { showToast } = useToast()
  const [selectedId, setSelectedId] = useState(null)
  const [cancelarModal, setCancelarModal] = useState(null)
  const [editarModal, setEditarModal] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [procesando, setProcesando] = useState(false)

  const selected = reservas.find(r => r.id === selectedId)

  function abrirEditar(reserva) {
    setEditForm({
      estado: reserva.estado,
      mesa_asignada: reserva.mesa_asignada || '',
      notas_admin: reserva.notas_admin || '',
      llegada_confirmada: reserva.llegada_confirmada,
    })
    setEditarModal(reserva)
  }

  async function handleActualizar(e) {
    e.preventDefault()
    if (!editarModal || procesando) return
    setProcesando(true)
    try {
      await actualizarReserva(editarModal.id, editForm)
      showToast('Reserva actualizada correctamente.', 'success')
      setEditarModal(null)
      if (selectedId === editarModal.id) setSelectedId(editarModal.id)
    } catch (err) {
      showToast('Error al actualizar: ' + (err.message || 'Inténtalo de nuevo.'), 'error')
    }
    setProcesando(false)
  }

  async function handleCancelar() {
    if (!cancelarModal || procesando) return
    setProcesando(true)
    try {
      await cancelarReserva(cancelarModal.id)
      showToast('Reserva cancelada.', 'success')
      setCancelarModal(null)
    } catch (err) {
      showToast('Error al cancelar: ' + (err.message || ''), 'error')
    }
    setProcesando(false)
  }

  async function handleMarcarLlegada(reserva) {
    try {
      await actualizarReserva(reserva.id, { llegada_confirmada: !reserva.llegada_confirmada })
      showToast(reserva.llegada_confirmada ? 'Llegada desmarcada.' : 'Llegada confirmada.', 'success')
    } catch {
      showToast('Error al actualizar llegada.', 'error')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display font-black text-headline-xl text-on-surface">Gestión de Reservas</h1>
        <p className="text-body-md text-on-surface-variant font-body mt-1">Administra las reservas activas y pasadas del restaurante.</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 p-4 bg-surface-container rounded-xl border border-outline-variant/30">
        <div className="flex items-center gap-2 flex-1 min-w-[180px]">
          <span className="icon text-xl text-on-surface-variant">calendar_today</span>
          <input
            type="date"
            className="input-field flex-1"
            value={filtros.fecha}
            onChange={e => setFiltros(f => ({ ...f, fecha: e.target.value }))}
          />
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-[180px]">
          <span className="icon text-xl text-on-surface-variant">filter_list</span>
          <select
            className="input-field flex-1"
            value={filtros.estado}
            onChange={e => setFiltros(f => ({ ...f, estado: e.target.value }))}
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmada">Confirmada</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
        {(filtros.fecha || filtros.estado) && (
          <button
            onClick={() => setFiltros({ fecha: '', estado: '' })}
            className="btn-ghost px-4"
          >
            <span className="icon text-lg">clear</span>
            Limpiar
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Lista */}
        <div className="xl:col-span-7 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <h2 className="font-display font-bold text-title-md text-on-surface">Reservas</h2>
            <span className="badge-pendiente">{reservas.length} total</span>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Spinner size="lg" /></div>
          ) : reservas.length === 0 ? (
            <div className="card-elevated p-8 text-center">
              <span className="icon text-5xl text-outline block mb-3">search_off</span>
              <p className="text-body-md text-on-surface-variant font-body">No hay reservas que coincidan con los filtros.</p>
            </div>
          ) : (
            <div className="card-elevated overflow-hidden">
              <table className="w-full text-sm font-body">
                <thead>
                  <tr className="border-b border-outline-variant/30 bg-surface-variant/40">
                    <th className="text-left px-3 py-2 text-caption text-on-surface-variant uppercase tracking-wider font-bold">Hora</th>
                    <th className="text-left px-3 py-2 text-caption text-on-surface-variant uppercase tracking-wider font-bold">Fecha</th>
                    <th className="text-left px-3 py-2 text-caption text-on-surface-variant uppercase tracking-wider font-bold">Cliente</th>
                    <th className="text-center px-3 py-2 text-caption text-on-surface-variant uppercase tracking-wider font-bold">Pax</th>
                    <th className="text-left px-3 py-2 text-caption text-on-surface-variant uppercase tracking-wider font-bold hidden md:table-cell">Mesa</th>
                    <th className="text-left px-3 py-2 text-caption text-on-surface-variant uppercase tracking-wider font-bold">Estado</th>
                    <th className="text-center px-3 py-2 text-caption text-on-surface-variant uppercase tracking-wider font-bold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map((r, i) => (
                    <tr
                      key={r.id}
                      onClick={() => setSelectedId(r.id)}
                      className={`cursor-pointer border-b border-outline-variant/20 transition-colors duration-150 hover:bg-surface-variant/30
                        ${selectedId === r.id ? 'bg-secondary-container/10' : i % 2 === 0 ? '' : 'bg-surface-container/30'}
                        ${r.estado === 'cancelada' ? 'opacity-60' : ''}`}
                    >
                      <td className="px-3 py-2">
                        <span className="font-display font-bold text-secondary-container">
                          {String(r.franja_horaria?.hora || '--').slice(0, 5)}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-on-surface-variant whitespace-nowrap">
                        {new Date(r.fecha + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-3 py-2">
                        <p className={`font-medium truncate max-w-[140px] ${r.estado === 'cancelada' ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                          {r.cliente?.nombre_completo || r.cliente?.email || 'Desconocido'}
                        </p>
                        {r.notas && (
                          <span className="icon text-sm text-secondary-container" title={r.notas}>sticky_note_2</span>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center text-on-surface">
                        <span className="flex items-center justify-center gap-1">
                          {r.num_comensales}
                          {r.llegada_confirmada && <span className="icon text-sm text-secondary-container">check_circle</span>}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-on-surface-variant hidden md:table-cell">
                        {r.mesa_asignada || <span className="text-outline">—</span>}
                      </td>
                      <td className="px-3 py-2">
                        <Badge estado={r.estado} />
                      </td>
                      <td className="px-3 py-2">
                        {r.estado !== 'cancelada' ? (
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={e => { e.stopPropagation(); abrirEditar(r) }}
                              className="p-1.5 rounded-lg bg-surface-variant hover:bg-secondary-container/20 text-on-surface-variant hover:text-secondary-container transition-colors"
                              title="Modificar"
                            >
                              <span className="icon text-base">edit</span>
                            </button>
                            <button
                              onClick={e => { e.stopPropagation(); setCancelarModal(r) }}
                              className="p-1.5 rounded-lg bg-surface-variant hover:bg-error/20 text-on-surface-variant hover:text-error transition-colors"
                              title="Cancelar"
                            >
                              <span className="icon text-base">cancel</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-outline text-center block">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Panel de detalle */}
        <div className="xl:col-span-5">
          <div className="sticky top-8">
            {selected ? (
              <div className="card-elevated overflow-hidden">
                <div className="h-1 bg-secondary-container" />
                <div className="p-6 border-b border-outline-variant/30">
                  <p className="text-caption text-secondary-container font-body uppercase tracking-wider">
                    Detalle de Reserva
                  </p>
                  <h2 className="font-display font-black text-headline-lg text-on-surface mt-1">
                    {selected.cliente?.nombre_completo || selected.cliente?.email}
                  </h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge estado={selected.estado} />
                    {selected.llegada_confirmada && (
                      <span className="badge bg-surface-variant text-on-surface border border-outline-variant">
                        <span className="icon text-base text-secondary-container">check_circle</span>
                        Llegó
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center">
                        <span className="icon text-xl text-secondary-container">calendar_today</span>
                      </div>
                      <div>
                        <p className="text-caption text-on-surface-variant font-body">Fecha</p>
                        <p className="text-body-md text-on-surface font-body font-medium">
                          {new Date(selected.fecha + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center">
                        <span className="icon text-xl text-secondary-container">schedule</span>
                      </div>
                      <div>
                        <p className="text-caption text-on-surface-variant font-body">Hora</p>
                        <p className="text-body-md text-on-surface font-body font-medium">
                          {String(selected.franja_horaria?.hora || '--').slice(0, 5)}
                        </p>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center">
                        <span className="icon text-xl text-secondary-container">group</span>
                      </div>
                      <div>
                        <p className="text-caption text-on-surface-variant font-body">Comensales</p>
                        <p className="text-body-md text-on-surface font-body font-medium">
                          {selected.num_comensales} personas{selected.mesa_asignada && ` · Mesa ${selected.mesa_asignada}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {(selected.cliente?.email || selected.cliente?.telefono) && (
                    <div className="border-t border-outline-variant/30 pt-4">
                      <h3 className="font-display font-bold text-label-bold text-on-surface uppercase tracking-wider mb-3">Contacto</h3>
                      <div className="flex flex-col gap-2">
                        {selected.cliente?.email && (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-surface-variant flex items-center justify-center">
                              <span className="icon text-lg text-secondary-container">mail</span>
                            </div>
                            <a href={`mailto:${selected.cliente.email}`} className="text-body-md text-on-surface font-body hover:text-secondary-container transition-colors">
                              {selected.cliente.email}
                            </a>
                          </div>
                        )}
                        {selected.cliente?.telefono && (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-surface-variant flex items-center justify-center">
                              <span className="icon text-lg text-secondary-container">call</span>
                            </div>
                            <a href={`tel:${selected.cliente.telefono}`} className="text-body-md text-on-surface font-body hover:text-secondary-container transition-colors">
                              {selected.cliente.telefono}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {selected.notas && (
                    <div className="bg-secondary-container/15 border border-secondary-container/40 rounded-xl p-4">
                      <h3 className="font-display font-bold text-label-bold text-secondary-container uppercase tracking-wider mb-2 flex items-center gap-2">
                        <span className="icon text-lg">sticky_note_2</span>
                        Notas del cliente
                      </h3>
                      <p className="text-body-md text-on-surface font-body italic">{selected.notas}</p>
                    </div>
                  )}

                  {selected.notas_admin && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                      <h3 className="font-display font-bold text-label-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{color:'#5b8cff'}}>
                        <span className="icon text-lg">chat</span>
                        Comentario del restaurante
                      </h3>
                      <p className="text-body-md text-on-surface font-body">{selected.notas_admin}</p>
                    </div>
                  )}

                  {selected.estado !== 'cancelada' && (
                    <div className="border-t border-outline-variant/30 pt-4 flex flex-col gap-2">
                      <button
                        onClick={() => handleMarcarLlegada(selected)}
                        className="btn-primary w-full"
                      >
                        <span className="icon">{selected.llegada_confirmada ? 'undo' : 'check_circle'}</span>
                        {selected.llegada_confirmada ? 'Desmarcar llegada' : 'Marcar llegada'}
                      </button>
                      <button onClick={() => abrirEditar(selected)} className="btn-secondary w-full">
                        <span className="icon">edit</span>
                        Modificar reserva
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="card-elevated p-8 text-center">
                <span className="icon text-5xl text-outline block mb-3">touch_app</span>
                <p className="text-body-md text-on-surface-variant font-body">Selecciona una reserva para ver los detalles.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal editar */}
      <Modal open={!!editarModal} onClose={() => setEditarModal(null)} title="Modificar Reserva" size="md">
        <form onSubmit={handleActualizar} noValidate className="flex flex-col gap-4">
          <div>
            <label className="field-label">Estado</label>
            <select
              className="input-field"
              value={editForm.estado || ''}
              onChange={e => setEditForm(f => ({ ...f, estado: e.target.value }))}
            >
              <option value="pendiente">Pendiente</option>
              <option value="confirmada">Confirmada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>
          <div>
            <label className="field-label">Mesa asignada</label>
            <input
              type="text"
              className="input-field"
              placeholder="Ej: M-12, Mesa 3..."
              value={editForm.mesa_asignada || ''}
              onChange={e => setEditForm(f => ({ ...f, mesa_asignada: e.target.value }))}
            />
          </div>
          {editarModal?.notas && (
            <div className="bg-surface-variant/40 border border-outline-variant/30 rounded-xl p-3">
              <p className="text-caption text-on-surface-variant uppercase tracking-wider font-bold mb-1 flex items-center gap-1">
                <span className="icon text-sm">sticky_note_2</span>
                Nota del cliente
              </p>
              <p className="text-body-md text-on-surface font-body italic">{editarModal.notas}</p>
            </div>
          )}
          <div>
            <label className="field-label">Comentario para el cliente</label>
            <textarea
              className="input-field resize-none"
              rows={3}
              placeholder="Este mensaje se enviará al cliente por email..."
              value={editForm.notas_admin || ''}
              onChange={e => setEditForm(f => ({ ...f, notas_admin: e.target.value }))}
            />
          </div>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="llegada"
              checked={editForm.llegada_confirmada || false}
              onChange={e => setEditForm(f => ({ ...f, llegada_confirmada: e.target.checked }))}
              className="w-4 h-4 accent-[#FF4D00]"
            />
            <label htmlFor="llegada" className="text-body-md text-on-surface font-body cursor-pointer">
              Llegada confirmada
            </label>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button type="button" className="btn-secondary" onClick={() => setEditarModal(null)}>Cancelar</button>
            <button type="submit" className="btn-primary" disabled={procesando}>
              {procesando ? <Spinner size="sm" /> : <><span className="icon">save</span> Guardar</>}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmModal
        open={!!cancelarModal}
        title="Cancelar reserva"
        message={`¿Seguro que quieres cancelar la reserva de ${cancelarModal?.cliente?.nombre_completo || 'este cliente'}?`}
        confirmLabel="Sí, cancelar"
        cancelLabel="Volver"
        variant="danger"
        onConfirm={handleCancelar}
        onCancel={() => setCancelarModal(null)}
        loading={procesando}
      />
    </div>
  )
}
