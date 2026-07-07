// GET /api/founding/slots
// Live founding-cohort counter — powers the "X of 20 reserved" display and the
// traction chart. Reserved = confirmed founding deposits.

import { NextResponse } from 'next/server'
import { FOUNDING_SLOTS, getFoundingReserved } from '@/app/lib/orders'

export const dynamic = 'force-dynamic'

export async function GET() {
  const reserved = await getFoundingReserved()
  return NextResponse.json({
    reserved,
    total: FOUNDING_SLOTS,
    remaining: Math.max(0, FOUNDING_SLOTS - reserved),
  })
}
