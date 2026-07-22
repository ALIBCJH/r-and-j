// GET /api/pricing  →  the live customer-facing pricing config (public).
// Prices are public information; this lets client components (the pricing modal,
// admin editor bootstrap) read the current config without server props.
import { NextResponse } from 'next/server'
import { getPricingConfig } from '@/app/lib/pricingStore'

export const dynamic = 'force-dynamic'

export async function GET() {
  const config = await getPricingConfig()
  return NextResponse.json({ ok: true, config })
}
