// POST /api/admin/purge-orders → delete all legacy backing/order records.
// Admin-only. Keeps reservations untouched. (Orders are no longer created by
// the free founding flow; this is a one-time cleanup of old test/demo data.)
import { NextResponse } from 'next/server'
import { isAdmin } from '@/app/lib/admin'
import { clearAllOrders } from '@/app/lib/orders'

export const dynamic = 'force-dynamic'

export async function POST() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const orders = await clearAllOrders()
  return NextResponse.json({ ok: true, cleared: { orders } })
}
