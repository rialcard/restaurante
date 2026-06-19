import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts'

// Configuración SMTP de Mailcaw (definida en los Secrets de la Edge Function)
const SMTP_HOST = Deno.env.get('SMTP_HOST') || 'mail.estandartecnologia.com'
const SMTP_PORT = Number(Deno.env.get('SMTP_PORT') || '465')
const SMTP_USER = Deno.env.get('SMTP_USER') || 'restaurante@estandartecnologia.com'
const SMTP_PASS = Deno.env.get('SMTP_PASS') || ''
const FROM_NAME = 'Estan Burger'
const FROM_EMAIL = SMTP_USER

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
  <title>Reserva · Estan Burger</title>
</head>
<body style="margin:0;padding:0;background-color:#111111;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:16px 12px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="max-width:480px;width:100%;background-color:#1c1c1c;border-radius:10px;overflow:hidden;border:1px solid #2a2a2a;">

          <!-- HEADER -->
          <tr>
            <td style="background:#e03d00;padding:14px 24px;text-align:center;">
              <span style="font-size:18px;font-weight:900;color:#fff;text-transform:uppercase;letter-spacing:1px;">Estan Burger</span>
            </td>
          </tr>

          <!-- ESTADO + SALUDO -->
          <tr>
            <td style="padding:16px 24px 0;">
              <div style="display:inline-block;background-color:${c.fondo};border:1px solid ${c.borde};border-radius:6px;padding:5px 14px;margin-bottom:12px;">
                <span style="font-size:12px;font-weight:700;color:${c.texto};text-transform:uppercase;letter-spacing:1px;">${c.icono} ${c.etiqueta}</span>
              </div>
              <p style="margin:0 0 2px;font-size:15px;font-weight:700;color:#e4e2e1;">Hola, ${nombreCliente}</p>
              <p style="margin:0;font-size:13px;line-height:1.5;color:#888888;">${mensajes[estado] || mensajes.pendiente}</p>
            </td>
          </tr>

          <!-- DETALLES -->
          <tr>
            <td style="padding:12px 24px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #2e2e2e;border-radius:8px;overflow:hidden;">
                <tr>
                  <td style="padding:10px 14px;border-bottom:1px solid #2e2e2e;border-right:1px solid #2e2e2e;width:50%;vertical-align:top;">
                    <p style="margin:0 0 2px;font-size:10px;color:#ff571a;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Fecha</p>
                    <p style="margin:0;font-size:13px;color:#e4e2e1;font-weight:600;">${formatearFecha(fecha)}</p>
                  </td>
                  <td style="padding:10px 14px;border-bottom:1px solid #2e2e2e;width:50%;vertical-align:top;">
                    <p style="margin:0 0 2px;font-size:10px;color:#ff571a;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Hora</p>
                    <p style="margin:0;font-size:13px;color:#e4e2e1;font-weight:600;">${formatearHora(hora)}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 14px;border-right:1px solid #2e2e2e;width:50%;vertical-align:top;">
                    <p style="margin:0 0 2px;font-size:10px;color:#ff571a;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Comensales</p>
                    <p style="margin:0;font-size:13px;color:#e4e2e1;font-weight:600;">${numComensales} persona${numComensales !== 1 ? 's' : ''}</p>
                  </td>
                  <td style="padding:10px 14px;width:50%;vertical-align:top;">
                    <p style="margin:0 0 2px;font-size:10px;color:#ff571a;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Mesa</p>
                    <p style="margin:0;font-size:13px;color:#e4e2e1;font-weight:600;">${mesaAsignada || '—'}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${notas ? `
          <tr>
            <td style="padding:10px 24px 0;">
              <div style="border-left:3px solid #ff571a;padding:8px 12px;background:#1e1a12;border-radius:0 6px 6px 0;">
                <p style="margin:0 0 2px;font-size:10px;color:#ff571a;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Tu nota</p>
                <p style="margin:0;font-size:13px;color:#888888;font-style:italic;">"${notas}"</p>
              </div>
            </td>
          </tr>` : ''}

          ${notasAdmin ? `
          <tr>
            <td style="padding:10px 24px 0;">
              <div style="border-left:3px solid #5b8cff;padding:8px 12px;background:#161a26;border-radius:0 6px 6px 0;">
                <p style="margin:0 0 2px;font-size:10px;color:#5b8cff;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Mensaje del restaurante</p>
                <p style="margin:0;font-size:13px;color:#c0c8e0;">${notasAdmin}</p>
              </div>
            </td>
          </tr>` : ''}

          <!-- FOOTER -->
          <tr>
            <td style="padding:16px 24px;text-align:center;border-top:1px solid #2a2a2a;margin-top:12px;">
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

    const client = new SMTPClient({
      connection: {
        hostname: SMTP_HOST,
        port: SMTP_PORT,
        tls: SMTP_PORT === 465,
        auth: { username: SMTP_USER, password: SMTP_PASS },
      },
    })

    await client.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: emailCliente,
      subject: asuntos[reserva.estado] || 'Actualización de tu reserva · Estan Burger',
      html,
    })
    await client.close()

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
