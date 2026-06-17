const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export async function enviarEmailEstadoReserva(reserva) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return
  if (!reserva.cliente?.email) return

  await fetch(`${SUPABASE_URL}/functions/v1/send-reservation-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify(reserva),
  })
}
