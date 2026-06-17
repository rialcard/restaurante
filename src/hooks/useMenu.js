import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export function useMenu() {
  const [secciones, setSecciones] = useState([])
  const [platos, setPlatos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchMenu() {
      setLoading(true)
      const [seccionesRes, platosRes] = await Promise.all([
        supabase.from('secciones_carta').select('*').order('orden'),
        supabase.from('platos').select('*').order('orden'),
      ])
      if (seccionesRes.error) { setError(seccionesRes.error.message); setLoading(false); return }
      if (platosRes.error) { setError(platosRes.error.message); setLoading(false); return }
      setSecciones(seccionesRes.data)
      setPlatos(platosRes.data)
      setLoading(false)
    }
    fetchMenu()
  }, [])

  function platosPorSeccion(seccionId) {
    return platos.filter(p => p.seccion_id === seccionId)
  }

  return { secciones, platos, platosPorSeccion, loading, error }
}
