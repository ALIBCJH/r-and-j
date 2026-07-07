// POST /api/admin/login  { password }  → sets the admin session cookie.
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { rateLimit } from '@/app/lib/security'
import { adminConfigured, passwordOk, startSession } from '@/app/lib/admin'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  // Throttle brute-force: 5 attempts / 10 min per IP.
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!rateLimit(`admin-login:${ip}`, 5, 10 * 60_000)) {
    return NextResponse.json({ ok: false, error: 'Too many attempts. Wait a few minutes.' }, { status: 429 })
  }

  if (!adminConfigured()) {
    return NextResponse.json({ ok: false, error: 'Admin is not configured (set ADMIN_PASSWORD).' }, { status: 503 })
  }

  let password = ''
  try {
    password = String(((await request.json()) as { password?: string }).password ?? '')
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  if (!passwordOk(password)) {
    return NextResponse.json({ ok: false, error: 'Incorrect password.' }, { status: 401 })
  }

  await startSession()
  return NextResponse.json({ ok: true })
}
