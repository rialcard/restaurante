import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const FROM_EMAIL = 'Estan Burger <reservas@estandartecnologia.com>'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function formatearFecha(fecha: string): string {
  return new Date(fecha + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatearHora(hora: string): string {
  return String(hora || '').slice(0, 5)
}

function buildEmailHtml({ nombreCliente, fecha, hora, numComensales, mesaAsignada, estado, notas, notasAdmin }: {
  nombreCliente: string
  fecha: string
  hora: string
  numComensales: number
  mesaAsignada?: string
  estado: string
  notas?: string
  notasAdmin?: string
}): string {
  const colores: Record<string, { fondo: string; borde: string; texto: string; etiqueta: string; icono: string }> = {
    confirmada: { fondo: '#1a3a1a', borde: '#4caf50', texto: '#81c784', etiqueta: 'CONFIRMADA', icono: '✅' },
    cancelada:  { fondo: '#3a1a1a', borde: '#f44336', texto: '#e57373', etiqueta: 'CANCELADA',  icono: '❌' },
    pendiente:  { fondo: '#2a2a1a', borde: '#ff9800', texto: '#ffb74d', etiqueta: 'PENDIENTE',  icono: '⏳' },
  }
  const c = colores[estado] || colores.pendiente

  const mensajes: Record<string, string> = {
    confirmada: '¡Buenas noticias! Tu reserva ha sido <strong>confirmada</strong>. Te esperamos con los mejores ingredientes y una parrilla volcánica lista para ti.',
    cancelada:  'Lamentamos informarte que tu reserva ha sido <strong>cancelada</strong>. Si tienes alguna duda, no dudes en contactarnos.',
    pendiente:  'Tu reserva está <strong>en revisión</strong> por nuestro equipo. Te avisaremos cuando sea confirmada.',
  }

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Actualización de tu reserva · Estan Burger</title>
</head>
<body style="margin:0;padding:0;background-color:#0d0d0d;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d0d0d;padding:20px 12px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:#1a1a1a;border-radius:12px;overflow:hidden;border:1px solid #2a2a2a;">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#ff571a,#e03d00);padding:20px 28px;text-align:center;">
              <h1 style="margin:0;font-size:24px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;text-transform:uppercase;">Estan Burger</h1>
              <p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,0.7);letter-spacing:1px;text-transform:uppercase;">Artesanales y Jugosas</p>
            </td>
          </tr>

          <!-- ESTADO -->
          <tr>
            <td style="padding:20px 28px 0;text-align:center;">
              <div style="display:inline-block;background-color:${c.fondo};border:2px solid ${c.borde};border-radius:999px;padding:8px 20px;">
                <span style="font-size:13px;font-weight:700;color:${c.texto};letter-spacing:1px;text-transform:uppercase;">${c.icono} Reserva ${c.etiqueta}</span>
              </div>
            </td>
          </tr>

          <!-- SALUDO -->
          <tr>
            <td style="padding:16px 28px 0;">
              <h2 style="margin:0 0 6px;font-size:18px;font-weight:700;color:#e4e2e1;">Hola, ${nombreCliente}</h2>
              <p style="margin:0;font-size:14px;line-height:1.5;color:#9e9e9e;">${mensajes[estado] || mensajes.pendiente}</p>
            </td>
          </tr>

          <!-- DETALLES EN GRID 2 COLUMNAS -->
          <tr>
            <td style="padding:16px 28px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#222222;border-radius:10px;overflow:hidden;border:1px solid #333333;">
                <tr>
                  <td style="padding:14px 18px;border-bottom:1px solid #333333;border-right:1px solid #333333;width:50%;">
                    <p style="margin:0 0 3px;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#ff571a;">📅 Fecha</p>
                    <p style="margin:0;font-size:14px;font-weight:600;color:#e4e2e1;">${formatearFecha(fecha)}</p>
                  </td>
                  <td style="padding:14px 18px;border-bottom:1px solid #333333;width:50%;">
                    <p style="margin:0 0 3px;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#ff571a;">🕐 Hora</p>
                    <p style="margin:0;font-size:14px;font-weight:600;color:#e4e2e1;">${formatearHora(hora)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 18px;${mesaAsignada ? 'border-right:1px solid #333333;' : 'colspan:2;'}width:50%;">
                    <p style="margin:0 0 3px;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#ff571a;">👥 Comensales</p>
                    <p style="margin:0;font-size:14px;font-weight:600;color:#e4e2e1;">${numComensales} persona${numComensales !== 1 ? 's' : ''}</p>
                  </td>
                  ${mesaAsignada ? `
                  <td style="padding:14px 18px;width:50%;">
                    <p style="margin:0 0 3px;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#ff571a;">🪑 Mesa</p>
                    <p style="margin:0;font-size:14px;font-weight:600;color:#e4e2e1;">${mesaAsignada}</p>
                  </td>` : '<td style="width:50%;"></td>'}
                </tr>
              </table>
            </td>
          </tr>

          <!-- NOTAS CLIENTE -->
          ${notas ? `
          <tr>
            <td style="padding:12px 28px 0;">
              <div style="background-color:#1e1a12;border-left:3px solid #ff571a;border-radius:0 6px 6px 0;padding:12px 16px;">
                <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#ff571a;">📝 Tu nota</p>
                <p style="margin:0;font-size:13px;line-height:1.5;color:#9e9e9e;font-style:italic;">"${notas}"</p>
              </div>
            </td>
          </tr>` : ''}

          <!-- MENSAJE DEL RESTAURANTE -->
          ${notasAdmin ? `
          <tr>
            <td style="padding:12px 28px 0;">
              <div style="background-color:#1a1e2a;border-left:3px solid #5b8cff;border-radius:0 6px 6px 0;padding:12px 16px;">
                <p style="margin:0 0 4px;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#5b8cff;">💬 Mensaje del restaurante</p>
                <p style="margin:0;font-size:13px;line-height:1.5;color:#c0c8e0;">${notasAdmin}</p>
              </div>
            </td>
          </tr>` : ''}

          <!-- FOOTER -->
          <tr>
            <td style="padding:20px 28px;text-align:center;border-top:1px solid #2a2a2a;margin-top:16px;">
              <p style="margin:0 0 4px;font-size:12px;color:#666666;">¿Tienes alguna pregunta? Contacta con nosotros.</p>
              <p style="margin:0;font-size:11px;color:#444444;">© ${new Date().getFullYear()} Estan Burger · Todos los derechos reservados</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const reserva = await req.json()

    const nombreCliente = reserva.cliente?.nombre_completo || reserva.cliente?.email || 'Cliente'
    const emailCliente = reserva.cliente?.email
    if (!emailCliente) {
      return new Response(JSON.stringify({ error: 'Sin email de cliente' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const asuntos: Record<string, string> = {
      confirmada: '✅ Tu reserva en Estan Burger ha sido confirmada',
      cancelada:  '❌ Tu reserva en Estan Burger ha sido cancelada',
      pendiente:  '⏳ Tu reserva en Estan Burger está en revisión',
    }

    const html = buildEmailHtml({
      nombreCliente,
      fecha: reserva.fecha,
      hora: reserva.franja_horaria?.hora,
      numComensales: reserva.num_comensales,
      mesaAsignada: reserva.mesa_asignada,
      estado: reserva.estado,
      notas: reserva.notas,
      notasAdmin: reserva.notas_admin,
    })

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [emailCliente],
        subject: asuntos[reserva.estado] || 'Actualización de tu reserva · Estan Burger',
        html,
      }),
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
