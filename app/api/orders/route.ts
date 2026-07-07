// POST /api/orders
// Reserves a founding slot: creates the order, kicks off an M-Pesa STK push for
// the flat founding DEPOSIT (not the full price), and returns the order number +
// checkout id the client polls on. Called by CheckoutClient.

import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { rateLimit } from '@/app/lib/security'
import { initiateStkPush } from '@/app/lib/mpesa'
import { tierForAmount } from '@/app/lib/campaign'
import {
  type Order,
  type OrderItem,
  type Payment,
  FOUNDING_DEPOSIT_KSH,
  FOUNDING_SLOTS,
  computeTotal,
  generateOrderNumber,
  getFoundingReserved,
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
  kickstarter?: boolean // pre-launch "join" booking — no fabric picked yet
  amount?: number       // chosen backing tier (validated server-side)
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
  const kickstarter = body.kickstarter === true

  if (!name || !phone) {
    return NextResponse.json(
      { ok: false, error: 'A valid name and M-Pesa phone number are required.' },
      { status: 400 },
    )
  }
  // A pre-launch "join" booking has no fabric yet; an ordinary reservation must
  // have items.
  if (items.length === 0 && !kickstarter) {
    return NextResponse.json({ ok: false, error: 'Your cart is empty.' }, { status: 400 })
  }

  // Stop taking reservations once the founding cohort is full. (Counts confirmed
  // deposits; a small oversell is possible if several pay at the exact same
  // moment — acceptable at this scale.)
  if ((await getFoundingReserved()) >= FOUNDING_SLOTS) {
    return NextResponse.json(
      { ok: false, error: 'All founding slots are reserved. Join the waitlist and we’ll be in touch.', soldOut: true },
      { status: 409 },
    )
  }

  // Recompute the full order value server-side (the locked founding price we
  // record), but only charge the backing amount today. A kickstarter booking has
  // no fabric yet, so its total is 0 (TBD on our call).
  const total = computeTotal(items)
  if (!kickstarter && (total <= 0 || total > 5_000_000)) {
    return NextResponse.json({ ok: false, error: 'Invalid order total.' }, { status: 400 })
  }
  if (total > 5_000_000) {
    return NextResponse.json({ ok: false, error: 'Invalid order total.' }, { status: 400 })
  }

  // The backing tier decides how much we charge and the discount it unlocks.
  // Kickstarter bookings must pick a valid tier; the classic reserve flow uses
  // the flat founding deposit. Never trust a raw client amount — validate it
  // against the allowed tier list.
  let deposit = FOUNDING_DEPOSIT_KSH
  let discountPct = 0
  if (kickstarter) {
    const tier = tierForAmount(Number(body.amount))
    if (!tier) {
      return NextResponse.json({ ok: false, error: 'Please choose a valid backing package.' }, { status: 400 })
    }
    deposit = tier.amount
    discountPct = tier.discountPct
  }

  const orderNumber = generateOrderNumber()

  let checkoutRequestId: string
  let mock: boolean
  try {
    const stk = await initiateStkPush(phone, deposit, orderNumber)
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
    deposit_ksh: deposit,
    discount_pct: discountPct,
    is_founding: true,
    checkout_request_id: checkoutRequestId,
    mpesa_receipt: null,
    created_at: now,
  }

  const payment: Payment = {
    checkout_request_id: checkoutRequestId,
    status: 'pending',
    amount: deposit,
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
    deposit_ksh: deposit,
    discount_pct: discountPct,
  })
}
