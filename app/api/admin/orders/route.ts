// GET /api/admin/orders → the full order list + headline totals. Admin-only.
import { NextResponse } from 'next/server'
import { isAdmin } from '@/app/lib/admin'
import { listOrders } from '@/app/lib/orders'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const orders = await listOrders()

  // Totals reflect real money — only paid (non-pending) orders count.
  const paid = orders.filter(o => o.status !== 'pending_payment')
  const totals = {
    backers: paid.length,
    collected_ksh: paid.reduce((sum, o) => sum + (o.deposit_ksh || 0), 0),
    pending: orders.length - paid.length,
  }

  return NextResponse.json({ ok: true, totals, orders })
}
