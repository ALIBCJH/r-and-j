// Admin pricing management.
//   GET  /api/admin/pricing            → current config (used to confirm auth + bootstrap the editor)
//   POST /api/admin/pricing  { config } → validate + persist the edited config
//
// Same auth contract as every other admin route: the rj_admin signed cookie via
// isAdmin(). No hardcoded prices anywhere — this is the only writer of
// `config:pricing`.
import { NextResponse } from 'next/server'
import { isAdmin } from '@/app/lib/admin'
import {
  getPricingConfig,
  savePricingConfig,
  normalizePricingConfig,
  pricingIsSellable,
} from '@/app/lib/pricingStore'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }
  const config = await getPricingConfig()
  return NextResponse.json({ ok: true, config })
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  let raw: unknown
  try {
    raw = ((await request.json()) as { config?: unknown }).config
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 })
  }
  if (!raw || typeof raw !== 'object') {
    return NextResponse.json({ ok: false, error: 'Missing pricing config.' }, { status: 400 })
  }

  // Reject a config that would leave nothing purchasable — every card would
  // render blank. Validate on the normalised shape so ids/flags are trustworthy.
  const candidate = normalizePricingConfig(raw)
  if (!pricingIsSellable(candidate)) {
    return NextResponse.json(
      { ok: false, error: 'Enable at least one window size and one package before saving.' },
      { status: 400 },
    )
  }

  const config = await savePricingConfig(raw, new Date().toISOString())
  return NextResponse.json({ ok: true, config })
}
