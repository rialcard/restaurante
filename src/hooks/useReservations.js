import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export function useReservations() {
  const { session } = useAuth()
  const [reservas, setReservas] = useState([])
  const [franjas, setFranjas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchReservas = useCallback(async () => {
    if (!session) return
    setLoading(true)
    const { data, error: e } = await supabase
      .from('reservas')
      .select('*, franja_horaria:franjas_horarias(hora)')
      .eq('cliente_id', session.user.id)
      .order('fecha', { ascending: true })
      .order('created_at', { ascending: false })
    if (e) { setError(e.message) } else { setReservas(data) }
    setLoading(false)
  }, [session])

  useEffect(() => {
    async function fetchFranjas() {
      const { data } = await supabase
        .from('franjas_horarias')
        .select('*')
        .eq('activa', true)
        .order('orden')
      if (data) setFranjas(data)
    }
    fetchFranjas()
    fetchReservas()
  }, [fetchReservas])

  async function getDisponibilidad(fecha, franjaId, numComensales) {
    const { data: config } = await supabase
      .from('configuracion_restaurante')
      .select('capacidad_comensales_por_franja')
      .single()
    const capacidad = config?.capacidad_comensales_por_franja || 40

    const { data } = await supabase
      .from('reservas')
      .select('num_comensales')
      .eq('fecha', fecha)
      .eq('franja_horaria_id', franjaId)
      .neq('estado', 'cancelada')

    const ocupado = (data || []).reduce((sum, r) => sum + r.num_comensales, 0)
    return { capacidad, ocupado, disponible: capacidad - ocupado, haySitio: capacidad - ocupado >= numComensales }
  }

  async function getDisponibilidadPorFranjas(fecha, numComensales) {
    const { data: config } = await supabase
      .from('configuracion_restaurante')
      .select('capacidad_comensales_por_franja')
      .single()
    const capacidad = config?.capacidad_comensales_por_franja || 40

    const { data } = await supabase
      .from('reservas')
      .select('franja_horaria_id, num_comensales')
      .eq('fecha', fecha)
      .neq('estado', 'cancelada')

    const ocupacion = {}
    ;(data || []).forEach(r => {
      ocupacion[r.franja_horaria_id] = (ocupacion[r.franja_horaria_id] || 0) + r.num_comensales
    })

    const result = {}
    franjas.forEach(f => {
      const ocupado = ocupacion[f.id] || 0
      result[f.id] = { ocupado, capacidad, disponible: capacidad - ocupado, lleno: capacidad - ocupado < numComensales }
    })
    return result
  }

  async function crearReserva({ fecha, franja_horaria_id, num_comensales, notas }) {
    const { data, error: e } = await supabase
      .from('reservas')
      .insert({ cliente_id: session.user.id, fecha, franja_horaria_id, num_comensales, notas })
      .select()
      .single()
    if (e) throw e
    await fetchReservas()
    return data
  }

  async function cancelarReserva(id) {
    const { error: e } = await supabase
      .from('reservas')
      .update({ estado: 'cancelada' })
      .eq('id', id)
      .eq('cliente_id', session.user.id)
    if (e) throw e
    await fetchReservas()
  }

  return { reservas, franjas, loading, error, crearReserva, cancelarReserva, getDisponibilidad, getDisponibilidadPorFranjas, refetch: fetchReservas }
}
