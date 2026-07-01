'use server'

import { Resend } from 'resend'
import { headers } from 'next/headers'
import { escapeHtml, isValidEmail, rateLimit, stripNewlines } from '@/app/lib/security'

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
  const name = (data.name ?? '').trim()
  const email = (data.email ?? '').trim()
  const company = (data.company ?? '').trim()
  const subject = (data.subject ?? '').trim()
  const message = (data.message ?? '').trim()

  if (!name || !email || !message) {
    return { ok: false, error: 'Please fill in all required fields.' }
  }
  if (!isValidEmail(email)) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }

  // Throttle: max 5 messages per 10 minutes per IP.
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!rateLimit(`contact:${ip}`, 5, 10 * 60_000)) {
    return { ok: false, error: 'Too many messages. Please wait a few minutes and try again.' }
  }

  const label = SUBJECT_LABELS[subject] ?? subject
  // Escape everything that lands in HTML; strip newlines from header fields.
  const e = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    company: escapeHtml(company),
    message: escapeHtml(message),
    label: escapeHtml(label),
  }

  try {
    await resend.emails.send({
      from: 'R&J Interiors <contact@rjinteriors.studio>',
      to: 'simonjuma465@gmail.com',
      replyTo: email,
      subject: stripNewlines(`[${label}] Message from ${name}`),
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px;background:#FAFAF8;color:#1A1A1D">
          <div style="border-bottom:2px solid #C9A84C;padding-bottom:20px;margin-bottom:28px">
            <h1 style="margin:0;font-size:22px;color:#0D1F3C">New enquiry via Curtain VR</h1>
          </div>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#706860;font-size:13px;width:120px">Name</td><td style="padding:8px 0;font-size:14px">${e.name}</td></tr>
            <tr><td style="padding:8px 0;color:#706860;font-size:13px">Email</td><td style="padding:8px 0;font-size:14px"><a href="mailto:${e.email}" style="color:#1B3A6B">${e.email}</a></td></tr>
            ${company ? `<tr><td style="padding:8px 0;color:#706860;font-size:13px">Company</td><td style="padding:8px 0;font-size:14px">${e.company}</td></tr>` : ''}
            <tr><td style="padding:8px 0;color:#706860;font-size:13px">Subject</td><td style="padding:8px 0;font-size:14px">${e.label}</td></tr>
          </table>
          <div style="margin-top:28px;padding:20px;background:#F0EBE0;border-left:3px solid #C9A84C">
            <p style="margin:0;font-size:14px;line-height:1.7;white-space:pre-wrap">${e.message}</p>
          </div>
        </div>
      `,
    })

    return { ok: true }
  } catch {
    return { ok: false, error: 'Failed to send message. Please try again or email us directly.' }
  }
}
