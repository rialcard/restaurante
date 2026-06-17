import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { enviarEmailEstadoReserva } from '../lib/emailService'

export function useAdminReservations() {
  const [reservas, setReservas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filtros, setFiltros] = useState({ fecha: '', estado: '' })

  const fetchReservas = useCallback(async () => {
    setLoading(true)
    let query = supabase
      .from('reservas')
      .select('*, cliente:profiles(nombre_completo, email, telefono), franja_horaria:franjas_horarias(hora)')
      .order('fecha', { ascending: true })

    if (filtros.fecha) query = query.eq('fecha', filtros.fecha)
    if (filtros.estado) query = query.eq('estado', filtros.estado)

    const { data, error: e } = await query
    if (e) { setError(e.message) } else { setReservas(data) }
    setLoading(false)
  }, [filtros])

  useEffect(() => { fetchReservas() }, [fetchReservas])

  async function actualizarReserva(id, cambios) {
    const reservaAnterior = reservas.find(r => r.id === id)
    const { data, error: e } = await supabase
      .from('reservas')
      .update(cambios)
      .eq('id', id)
      .select('*, cliente:profiles(nombre_completo, email, telefono), franja_horaria:franjas_horarias(hora)')
      .single()
    if (e) throw e
    setReservas(prev => prev.map(r => r.id === id ? data : r))
    if (cambios.estado && cambios.estado !== reservaAnterior?.estado) {
      enviarEmailEstadoReserva(data).catch(() => {})
    }
    return data
  }

  async function cancelarReserva(id) {
    return actualizarReserva(id, { estado: 'cancelada' })
  }

  async function getStatsHoy() {
    const hoy = new Date().toISOString().split('T')[0]
    const { data } = await supabase
      .from('reservas')
      .select('num_comensales, estado')
      .eq('fecha', hoy)
      .neq('estado', 'cancelada')

    const totalReservas = data?.length || 0
    const totalComensales = (data || []).reduce((s, r) => s + r.num_comensales, 0)

    const { data: config } = await supabase
      .from('configuracion_restaurante')
      .select('capacidad_comensales_por_franja')
      .single()
    const capacidadTotal = (config?.capacidad_comensales_por_franja || 40) * 9
    const ocupacion = totalComensales > 0 ? Math.round((totalComensales / capacidadTotal) * 100) : 0

    return { totalReservas, totalComensales, ocupacion }
  }

  return { reservas, loading, error, filtros, setFiltros, actualizarReserva, cancelarReserva, refetch: fetchReservas, getStatsHoy }
}
