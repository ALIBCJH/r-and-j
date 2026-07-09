// POST /api/admin/reset → wipe all orders + reservations for a clean slate.
// Admin-only, destructive, irreversible.
import { NextResponse } from 'next/server'
import { isAdmin } from '@/app/lib/admin'
import { clearAllOrders } from '@/app/lib/orders'
import { clearWaitlist } from '@/app/lib/waitlist'

export const dynamic = 'force-dynamic'

export async function POST() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const [orders, reservations] = await Promise.all([clearAllOrders(), clearWaitlist()])
  return NextResponse.json({ ok: true, cleared: { orders, reservations } })
}
