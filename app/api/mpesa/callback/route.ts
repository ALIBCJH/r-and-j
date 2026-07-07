// POST /api/mpesa/callback
// The public URL Safaricom calls (server-to-server) once the customer accepts
// or declines the STK prompt. This must be reachable over HTTPS — set
// MPESA_CALLBACK_URL to this path on your deployed/tunnelled host. Not used in
// mock mode (confirmation is simulated in the status poll instead).
//
// Always responds 200 with Daraja's acknowledgement shape so Safaricom doesn't
// retry indefinitely; the actual outcome is recorded in KV.

import { NextResponse } from 'next/server'
import { parseStkCallback } from '@/app/lib/mpesa'
import { handleCallback } from '@/app/lib/orders'

export const dynamic = 'force-dynamic'

const ack = NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = parseStkCallback(body)
    if (result) {
      await handleCallback(result.checkoutRequestId, result.success, result.receipt)
    }
  } catch (err) {
    // Never fail Safaricom's request — just log and acknowledge.
    console.error('M-Pesa callback error:', err)
  }
  return ack
}
