// POST /api/admin/orders/[number]/status  { status }  → advance fulfillment.
import { NextResponse } from 'next/server'
import { isAdmin } from '@/app/lib/admin'
import { type OrderStatus, FULFILLMENT_FLOW, updateOrderStatus } from '@/app/lib/orders'

export const dynamic = 'force-dynamic'

const ALLOWED = new Set<OrderStatus>(FULFILLMENT_FLOW)

export async function POST(
  request: Request,
  ctx: RouteContext<'/api/admin/orders/[number]/status'>,
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const { number } = await ctx.params
  let status: string
  try {
    status = String(((await request.json()) as { status?: string }).status ?? '')
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  if (!ALLOWED.has(status as OrderStatus)) {
    return NextResponse.json({ ok: false, error: 'Invalid status.' }, { status: 400 })
  }

  const order = await updateOrderStatus(number, status as OrderStatus)
  if (!order) {
    return NextResponse.json({ ok: false, error: 'Order not found.' }, { status: 404 })
  }

  return NextResponse.json({ ok: true, order })
}
