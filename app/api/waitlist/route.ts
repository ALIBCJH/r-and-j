// POST /api/waitlist
// Free "notify me at launch" capture for customers not ready to pay a deposit.
// Stores the lead in KV (one key per entry, race-free) + a running count, and
// best-effort emails the team. This is the soft-signal tier beneath a paid
// founding reservation.

import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { Resend } from 'resend'
import { escapeHtml, isValidEmail, rateLimit, stripNewlines } from '@/app/lib/security'
import { kvIncr, kvSetJson } from '@/app/lib/store'
import { normalizePhone } from '@/app/lib/orders'

export const dynamic = 'force-dynamic'

type Body = {
  name?: string
  phone?: string
  email?: string
  product_name?: string
  message?: string
}

const MESSAGE_MAX = 500

export async function POST(request: Request) {
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!rateLimit(`waitlist:${ip}`, 5, 10 * 60_000)) {
    return NextResponse.json({ ok: false, error: 'Too many attempts. Please wait a few minutes.' }, { status: 429 })
  }

  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  const name = (body.name ?? '').trim()
  const phone = normalizePhone(body.phone ?? '')
  const email = (body.email ?? '').trim()
  const productName = (body.product_name ?? '').trim()
  const message = (body.message ?? '').trim().slice(0, MESSAGE_MAX)

  // Need at least a name and one reachable contact.
  if (!name || (!phone && !email)) {
    return NextResponse.json(
      { ok: false, error: 'Please enter your name and a phone number or email.' },
      { status: 400 },
    )
  }
  if (email && !isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 })
  }

  const entry = {
    name,
    phone: phone ?? (body.phone ?? '').trim(),
    email,
    product_name: productName,
    message,
    created_at: new Date().toISOString(),
  }

  const n = await kvIncr('waitlist:count')
  await kvSetJson(`waitlist:${n}`, entry, 180 * 24 * 60 * 60) // keep 180 days

  // Best-effort notification — never fail the signup if email is down.
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'R&J Interiors <contact@rjinteriors.studio>',
      to: 'simonjuma465@gmail.com',
      subject: stripNewlines(`Waitlist signup #${n} — ${name}`),
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1A1A1D">
          <h2 style="color:#0D1F3C;margin:0 0 16px">New waitlist signup #${n}</h2>
          <table style="width:100%;border-collapse:collapse;font-size:14px">
            <tr><td style="padding:6px 0;color:#706860;width:120px">Name</td><td>${escapeHtml(name)}</td></tr>
            <tr><td style="padding:6px 0;color:#706860">Phone</td><td>${escapeHtml(entry.phone)}</td></tr>
            <tr><td style="padding:6px 0;color:#706860">Email</td><td>${escapeHtml(email)}</td></tr>
            <tr><td style="padding:6px 0;color:#706860">Interested in</td><td>${escapeHtml(productName) || '—'}</td></tr>
            <tr><td style="padding:6px 0;color:#706860;vertical-align:top">Message</td><td>${escapeHtml(message).replace(/\n/g, '<br>') || '—'}</td></tr>
          </table>
        </div>`,
    })
  } catch (err) {
    console.error('Waitlist email failed (signup still recorded):', err)
  }

  return NextResponse.json({ ok: true, position: n })
}
