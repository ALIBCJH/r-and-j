// GET /api/admin/waitlist → the Founding-Customer reservation list. Admin-only.
import { NextResponse } from 'next/server'
import { isAdmin } from '@/app/lib/admin'
import { listWaitlist } from '@/app/lib/waitlist'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const reservations = await listWaitlist()
  return NextResponse.json({ ok: true, reservations, count: reservations.length })
}
