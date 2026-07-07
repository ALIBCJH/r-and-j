// GET /api/orders/track?order_number=RJ-XXXX&phone=07...
// Order lookup for the tracking page. Requires both the order number and the
// phone used at checkout, so an order number alone can't be enumerated.

import { NextResponse } from 'next/server'
import { getOrder, normalizePhone } from '@/app/lib/orders'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const orderNumber = (searchParams.get('order_number') ?? '').trim().toUpperCase()
  const phone = normalizePhone(searchParams.get('phone') ?? '')

  const notFound = NextResponse.json(
    { detail: 'Order not found. Check your order number and phone number.' },
    { status: 404 },
  )

  if (!orderNumber || !phone) return notFound

  const order = await getOrder(orderNumber)
  if (!order || order.phone !== phone) return notFound

  return NextResponse.json({
    order_number: order.order_number,
    status: order.status,
    name: order.name,
    total_ksh: order.total_ksh,
    created_at: order.created_at,
    items: order.items.map((i) => ({
      product_name: i.product_name,
      collection: i.collection,
      quantity: i.quantity,
      width_cm: i.width_cm ?? 0,
      height_cm: i.height_cm ?? 0,
      price_ksh: i.price_ksh,
    })),
  })
}
