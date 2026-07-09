// POST /api/admin/reset → wipe all reservations for a clean slate.
// Admin-only, destructive, irreversible. (Legacy orders/payments self-expire
// via their 30-day TTL and are no longer shown in the admin.)
import { NextResponse } from 'next/server'
import { isAdmin } from '@/app/lib/admin'
import { clearWaitlist } from '@/app/lib/waitlist'

export const dynamic = 'force-dynamic'

export async function POST() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const reservations = await clearWaitlist()
  return NextResponse.json({ ok: true, cleared: { reservations } })
}
