// POST /api/mpesa/stk-push
// Standalone STK push for the KES 2,500 VR-studio booking deposit — no order
// attached. Called by GateScreen. Returns the checkout id it then polls on.

import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { rateLimit } from '@/app/lib/security'
import { initiateStkPush } from '@/app/lib/mpesa'
import { type Payment, normalizePhone, savePayment } from '@/app/lib/orders'

export const dynamic = 'force-dynamic'

const DEPOSIT_KSH = 2500

export async function POST(request: Request) {
  const ip = (await headers()).get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!rateLimit(`deposit:${ip}`, 5, 10 * 60_000)) {
    return NextResponse.json({ error: 'Too many attempts. Please wait a few minutes.' }, { status: 429 })
  }

  let phone: string | null
  try {
    const body = (await request.json()) as { phone?: string }
    phone = normalizePhone(body.phone ?? '')
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  if (!phone) {
    return NextResponse.json({ error: 'A valid M-Pesa phone number is required.' }, { status: 400 })
  }

  let checkoutRequestId: string
  let mock: boolean
  try {
    const stk = await initiateStkPush(phone, DEPOSIT_KSH, 'RJ-STUDIO')
    checkoutRequestId = stk.checkoutRequestId
    mock = stk.mock
  } catch (err) {
    console.error('Deposit STK push failed:', err)
    return NextResponse.json({ error: 'Could not start M-Pesa payment.' }, { status: 502 })
  }

  const payment: Payment = {
    checkout_request_id: checkoutRequestId,
    status: 'pending',
    amount: DEPOSIT_KSH,
    phone,
    ref: null,
    order_number: null,
    mock,
    created_at: new Date().toISOString(),
  }
  await savePayment(payment)

  return NextResponse.json({ checkout_request_id: checkoutRequestId })
}
