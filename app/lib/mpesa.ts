// Safaricom Daraja (M-Pesa) client — server-only.
//
// Every credential is read from the environment; nothing is hardcoded. Until
// real keys are present the module runs in MOCK MODE: STK pushes return a fake
// checkout id and the payment auto-confirms after a short delay (see
// orders.ts → resolvePaymentStatus). The moment real keys land in .env.local
// the exact same code paths call the real Daraja API instead — the only thing
// that changes is which token/URL we talk to.
//
// To go live this afternoon, fill these in .env.local:
//   MPESA_ENV=sandbox            # sandbox | production
//   MPESA_CONSUMER_KEY=...
//   MPESA_CONSUMER_SECRET=...
//   MPESA_PASSKEY=...
//   MPESA_SHORTCODE=...          # your Paybill/Till (sandbox default 174379)
//   MPESA_CALLBACK_URL=https://<public-host>/api/mpesa/callback
//   MPESA_TILL=false             # true for Buy-Goods (Till), false for Paybill
//
// This module is server-only: it reads secrets from process.env and is imported
// exclusively by route handlers under app/api, so it never reaches the client
// bundle. (No `server-only` guard package is used to keep dependencies at zero.)

const PLACEHOLDER = 'REPLACE_ME'

function env(name: string): string {
  const v = process.env[name] ?? ''
  return v === PLACEHOLDER ? '' : v
}

function config() {
  const shortcode = env('MPESA_SHORTCODE')
  // Buy Goods (Till) STK pushes use two numbers: the Store/Head-Office number
  // signs the request (BusinessShortCode + password), while the Till number is
  // the payee (PartyB). They are often different. For Paybill they're the same,
  // so MPESA_STORE_NUMBER falls back to the shortcode when unset.
  return {
    env: env('MPESA_ENV'),
    consumerKey: env('MPESA_CONSUMER_KEY'),
    consumerSecret: env('MPESA_CONSUMER_SECRET'),
    passkey: env('MPESA_PASSKEY'),
    shortcode, // Till number (Buy Goods) or Paybill number
    storeNumber: env('MPESA_STORE_NUMBER') || shortcode,
    callbackUrl: env('MPESA_CALLBACK_URL'),
    isTill: (process.env.MPESA_TILL ?? '').toLowerCase() === 'true',
  }
}

/** In mock mode we simulate M-Pesa instead of calling Safaricom. */
export function isMockMode(): boolean {
  const c = config()
  const ready =
    (c.env === 'sandbox' || c.env === 'production') &&
    c.consumerKey &&
    c.consumerSecret &&
    c.passkey &&
    c.shortcode &&
    c.callbackUrl
  return !ready
}

function baseUrl(): string {
  return config().env === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke'
}

// YYYYMMDDHHmmss in the server's local time, as Daraja expects.
function timestamp(): string {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return (
    `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}` +
    `${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
  )
}

// ── OAuth token ─────────────────────────────────────────────────────────────
async function getAccessToken(): Promise<string> {
  const c = config()
  const auth = Buffer.from(`${c.consumerKey}:${c.consumerSecret}`).toString('base64')
  const res = await fetch(
    `${baseUrl()}/oauth/v1/generate?grant_type=client_credentials`,
    { headers: { Authorization: `Basic ${auth}` }, cache: 'no-store' },
  )
  if (!res.ok) throw new Error(`Daraja auth failed: ${res.status}`)
  const data = (await res.json()) as { access_token?: string }
  if (!data.access_token) throw new Error('Daraja auth: no access_token')
  return data.access_token
}

export type StkResult = { checkoutRequestId: string; mock: boolean }

/**
 * Trigger an STK push (the "enter your M-Pesa PIN" prompt).
 * @param phone   normalized MSISDN, e.g. 254712345678
 * @param amount  KES, whole number
 * @param account short reference shown on the statement (e.g. the order number)
 */
export async function initiateStkPush(
  phone: string,
  amount: number,
  account: string,
): Promise<StkResult> {
  if (isMockMode()) {
    return { checkoutRequestId: `mock_${crypto.randomUUID()}`, mock: true }
  }

  const c = config()
  const token = await getAccessToken()
  const ts = timestamp()
  // The request is signed with the Store/Head-Office number (== the shortcode
  // for Paybill), while the customer pays the Till number (PartyB) for Buy Goods.
  const password = Buffer.from(`${c.storeNumber}${c.passkey}${ts}`).toString('base64')

  const res = await fetch(`${baseUrl()}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    body: JSON.stringify({
      BusinessShortCode: c.storeNumber,
      Password: password,
      Timestamp: ts,
      TransactionType: c.isTill ? 'CustomerBuyGoodsOnline' : 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: phone,
      PartyB: c.shortcode,
      PhoneNumber: phone,
      CallBackURL: c.callbackUrl,
      // Daraja converts the payload to XML internally, so strip anything that
      // isn't alphanumeric/space (a raw '&' — as in "R&J" — breaks its parser).
      AccountReference: account.replace(/[^A-Za-z0-9 ]/g, '').slice(0, 12),
      TransactionDesc: 'RJ Interiors',
    }),
  })

  const data = (await res.json()) as {
    CheckoutRequestID?: string
    ResponseCode?: string
    errorMessage?: string
  }
  if (data.ResponseCode !== '0' || !data.CheckoutRequestID) {
    throw new Error(`STK push rejected: ${data.errorMessage ?? JSON.stringify(data)}`)
  }
  return { checkoutRequestId: data.CheckoutRequestID, mock: false }
}

// ── Callback parsing ────────────────────────────────────────────────────────
export type CallbackResult = {
  checkoutRequestId: string
  success: boolean
  receipt: string | null
}

/** Parse the JSON body Safaricom POSTs to our callback URL. */
export function parseStkCallback(body: unknown): CallbackResult | null {
  const stk = (body as { Body?: { stkCallback?: Record<string, unknown> } })?.Body?.stkCallback
  if (!stk) return null

  const checkoutRequestId = String(stk.CheckoutRequestID ?? '')
  if (!checkoutRequestId) return null

  const success = Number(stk.ResultCode) === 0
  let receipt: string | null = null

  const items = (stk.CallbackMetadata as { Item?: { Name: string; Value: unknown }[] })?.Item
  if (Array.isArray(items)) {
    const found = items.find((i) => i.Name === 'MpesaReceiptNumber')
    if (found && found.Value != null) receipt = String(found.Value)
  }

  return { checkoutRequestId, success, receipt }
}
