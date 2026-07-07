// POST /api/orders
// Creates an order, kicks off an M-Pesa STK push for the total, and returns the
// order number + checkout id the client polls on. Called by CheckoutClient.

import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { rateLimit } from '@/app/lib/security'
import { initiateStkPush } from '@/app/lib/mpesa'
import {
  type Order,
  type OrderItem,
  type Payment,
  computeTotal,
  generateOrderNumber,
  normalizePhone,
  saveOrder,
  savePayment,
} from '@/app/lib/orders'

export const dynamic = 'force-dynamic'

type Body = {
  name?: string
  phone?: string
  email?: string
  county?: string
  town?: string
  building?: string
  instructions?: string | null
  items?: OrderItem[]
}

export async function POST(request: Request) {
  // Throttle: max 5 checkout attempts per 10 minutes per IP.
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!rateLimit(`order:${ip}`, 5, 10 * 60_000)) {
    return NextResponse.json(
      { ok: false, error: 'Too many attempts. Please wait a few minutes.' },
      { status: 429 },
    )
  }

  let body: Body
  try {
    body = (await request.json()) as Body
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  const name = (body.name ?? '').trim()
  const phone = normalizePhone(body.phone ?? '')
  const items = Array.isArray(body.items) ? body.items : []

  if (!name || !phone) {
    return NextResponse.json(
      { ok: false, error: 'A valid name and M-Pesa phone number are required.' },
      { status: 400 },
    )
  }
  if (items.length === 0) {
    return NextResponse.json({ ok: false, error: 'Your cart is empty.' }, { status: 400 })
  }

  // Recompute the total server-side — never trust a client-sent amount.
  const total = computeTotal(items)
  if (total <= 0 || total > 5_000_000) {
    return NextResponse.json({ ok: false, error: 'Invalid order total.' }, { status: 400 })
  }

  const orderNumber = generateOrderNumber()

  let checkoutRequestId: string
  let mock: boolean
  try {
    const stk = await initiateStkPush(phone, total, orderNumber)
    checkoutRequestId = stk.checkoutRequestId
    mock = stk.mock
  } catch (err) {
    console.error('STK push failed:', err)
    return NextResponse.json(
      { ok: false, error: 'Could not start M-Pesa payment. Please try again.' },
      { status: 502 },
    )
  }

  const now = new Date().toISOString()

  const order: Order = {
    order_number: orderNumber,
    status: 'pending_payment',
    name,
    phone,
    email: (body.email ?? '').trim(),
    county: (body.county ?? '').trim(),
    town: (body.town ?? '').trim(),
    building: (body.building ?? '').trim(),
    instructions: body.instructions?.trim() || null,
    items,
    total_ksh: total,
    checkout_request_id: checkoutRequestId,
    mpesa_receipt: null,
    created_at: now,
  }

  const payment: Payment = {
    checkout_request_id: checkoutRequestId,
    status: 'pending',
    amount: total,
    phone,
    ref: null,
    order_number: orderNumber,
    mock,
    created_at: now,
  }

  await Promise.all([saveOrder(order), savePayment(payment)])

  return NextResponse.json({
    ok: true,
    order_number: orderNumber,
    checkout_request_id: checkoutRequestId,
  })
}
