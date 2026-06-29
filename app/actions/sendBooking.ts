'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendBooking(data: {
  name:  string
  phone: string
  email: string
  note:  string
  date:  string
  time:  string
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { name, phone, email, note, date, time } = data

  try {
    await resend.emails.send({
      from:    'R&J Interiors <contact@rjinteriors.studio>',
      to:      'simonjuma465@gmail.com',
      replyTo: email,
      subject: `VR Studio Booking — ${date} at ${time} — ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#FAFAF8;color:#1A1A1D">
          <div style="border-bottom:2px solid #C9A84C;padding-bottom:20px;margin-bottom:28px">
            <h1 style="margin:0;font-size:22px;color:#0D1F3C">New VR Studio Booking</h1>
          </div>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#706860;font-size:13px;width:100px">Name</td><td style="padding:8px 0;font-size:14px">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#706860;font-size:13px">Phone</td><td style="padding:8px 0;font-size:14px">${phone}</td></tr>
            <tr><td style="padding:8px 0;color:#706860;font-size:13px">Email</td><td style="padding:8px 0;font-size:14px"><a href="mailto:${email}" style="color:#1B3A6B">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#706860;font-size:13px">Date</td><td style="padding:8px 0;font-size:14px;font-weight:600;color:#0D1F3C">${date}</td></tr>
            <tr><td style="padding:8px 0;color:#706860;font-size:13px">Time</td><td style="padding:8px 0;font-size:14px;font-weight:600;color:#0D1F3C">${time}</td></tr>
          </table>
          ${note ? `
          <div style="margin-top:28px;padding:20px;background:#F0EBE0;border-left:3px solid #C9A84C">
            <p style="margin:0;font-size:13px;color:#706860;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px">Note from client</p>
            <p style="margin:0;font-size:14px;line-height:1.7;white-space:pre-wrap">${note}</p>
          </div>` : ''}
          <div style="margin-top:28px;padding:16px;background:#EDF4FF;border-radius:4px">
            <p style="margin:0;font-size:13px;color:#1B3A6B">Deposit of <strong>KES 2,500</strong> is payable at arrival. Confirm slot with client via WhatsApp or email within 24 hours.</p>
          </div>
        </div>
      `,
    })

    await resend.emails.send({
      from:    'R&J Interiors <contact@rjinteriors.studio>',
      to:      email,
      subject: `Your VR Studio session is confirmed — ${date}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#FAFAF8;color:#1A1A1D">
          <div style="border-bottom:2px solid #C9A84C;padding-bottom:20px;margin-bottom:28px">
            <h1 style="margin:0;font-size:22px;color:#0D1F3C">R&J Interiors — Booking Received</h1>
          </div>
          <p style="font-size:16px;line-height:1.7">Hi ${name.split(' ')[0]},</p>
          <p style="font-size:15px;line-height:1.7;color:#3A4A5A">
            We've received your booking request for the VR Studio session below. Our consultant will
            contact you within 24 hours to confirm your slot.
          </p>
          <div style="margin:28px 0;padding:24px;border:1px solid #E0D8C8;border-radius:6px;background:#FFFFFF">
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#706860;font-size:13px;border-bottom:1px solid #F0EBE0;width:100px">Date</td><td style="padding:8px 0;font-size:14px;font-weight:600;border-bottom:1px solid #F0EBE0">${date}</td></tr>
              <tr><td style="padding:8px 0;color:#706860;font-size:13px;border-bottom:1px solid #F0EBE0">Time</td><td style="padding:8px 0;font-size:14px;font-weight:600;border-bottom:1px solid #F0EBE0">${time}</td></tr>
              <tr><td style="padding:8px 0;color:#706860;font-size:13px;border-bottom:1px solid #F0EBE0">Duration</td><td style="padding:8px 0;font-size:14px;border-bottom:1px solid #F0EBE0">60–90 minutes</td></tr>
              <tr><td style="padding:8px 0;color:#706860;font-size:13px">Deposit</td><td style="padding:8px 0;font-size:14px">KES 2,500 — payable at arrival</td></tr>
            </table>
          </div>
          <p style="font-size:14px;line-height:1.7;color:#3A4A5A">
            The deposit is credited in full toward your curtain order. No payment is required today.
          </p>
          <p style="font-size:14px;line-height:1.7;color:#3A4A5A">We look forward to seeing you.</p>
          <p style="font-size:14px;color:#C9A84C;font-style:italic;margin-top:28px">— The R&J Interiors Team</p>
        </div>
      `,
    })

    return { ok: true }
  } catch {
    return { ok: false, error: 'Failed to send. Please contact us directly.' }
  }
}
