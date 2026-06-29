'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const SUBJECT_LABELS: Record<string, string> = {
  general: 'General Enquiry',
  demo: 'Book a Demo',
  partner: 'Partnership / Showroom Plan',
  enterprise: 'Enterprise Pricing',
  press: 'Press & Media',
  support: 'Support',
}

export async function sendContact(data: {
  name: string
  email: string
  company: string
  subject: string
  message: string
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { name, email, company, subject, message } = data

  if (!name.trim() || !email.trim() || !message.trim()) {
    return { ok: false, error: 'Please fill in all required fields.' }
  }

  try {
    await resend.emails.send({
      from: 'R&J Interiors <contact@rjinteriors.studio>',
      to: 'simonjuma465@gmail.com',
      replyTo: email,
      subject: `[${SUBJECT_LABELS[subject] ?? subject}] Message from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#FAFAF8;color:#1A1A1D">
          <div style="border-bottom:2px solid #C9A84C;padding-bottom:20px;margin-bottom:28px">
            <h1 style="margin:0;font-size:22px;color:#0D1F3C">New enquiry via Curtain VR</h1>
          </div>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#706860;font-size:13px;width:120px">Name</td><td style="padding:8px 0;font-size:14px">${name}</td></tr>
            <tr><td style="padding:8px 0;color:#706860;font-size:13px">Email</td><td style="padding:8px 0;font-size:14px"><a href="mailto:${email}" style="color:#1B3A6B">${email}</a></td></tr>
            ${company ? `<tr><td style="padding:8px 0;color:#706860;font-size:13px">Company</td><td style="padding:8px 0;font-size:14px">${company}</td></tr>` : ''}
            <tr><td style="padding:8px 0;color:#706860;font-size:13px">Subject</td><td style="padding:8px 0;font-size:14px">${SUBJECT_LABELS[subject] ?? subject}</td></tr>
          </table>
          <div style="margin-top:28px;padding:20px;background:#F0EBE0;border-left:3px solid #C9A84C">
            <p style="margin:0;font-size:14px;line-height:1.7;white-space:pre-wrap">${message}</p>
          </div>
        </div>
      `,
    })

    return { ok: true }
  } catch {
    return { ok: false, error: 'Failed to send message. Please try again or email us directly.' }
  }
}
