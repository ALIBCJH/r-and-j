// GET /api/mpesa/status/[id]
// The browser polls this every 3s while waiting for payment. Returns the
// payment's current status; in mock mode this is also where the simulated
// confirmation happens (see resolvePayment). Used by CheckoutClient + GateScreen.

import { NextResponse } from 'next/server'
import { resolvePayment } from '@/app/lib/orders'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request, ctx: RouteContext<'/api/mpesa/status/[id]'>) {
  const { id } = await ctx.params
  const payment = await resolvePayment(id)

  if (!payment) {
    return NextResponse.json({ status: 'not_found' }, { status: 404 })
  }

  return NextResponse.json({ status: payment.status, ref: payment.ref })
}
