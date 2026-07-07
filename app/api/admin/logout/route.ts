// POST /api/admin/logout → clears the admin session cookie.
import { NextResponse } from 'next/server'
import { endSession } from '@/app/lib/admin'

export const dynamic = 'force-dynamic'

export async function POST() {
  await endSession()
  return NextResponse.json({ ok: true })
}
