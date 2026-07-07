// Order + payment domain logic, backed by the KV store (app/lib/store.ts).
//
// Two record kinds live in KV:
//   order:{ORDER_NUMBER}   → the full Order (fulfillment source of truth)
//   payment:{CHECKOUT_ID}  → a Payment the browser polls and the M-Pesa
//                            callback (or mock timer) resolves
//
// Keeping payment separate from order lets the standalone KES 2,500 studio
// deposit (GateScreen) reuse the same STK-push + status machinery without an
// order attached.

import { kvGetJson, kvSetJson } from './store'

export type OrderStatus =
  | 'pending_payment'
  | 'confirmed'
  | 'in_production'
  | 'ready'
  | 'delivered'

export type OrderItem = {
  product_id: number
  product_name: string
  collection: string
  price_ksh: number
  quantity: number
  width_cm?: number
  height_cm?: number
}

export type Order = {
  order_number: string
  status: OrderStatus
  name: string
  phone: string
  email: string
  county: string
  town: string
  building: string
  instructions: string | null
  items: OrderItem[]
  total_ksh: number
  checkout_request_id: string
  mpesa_receipt: string | null
  created_at: string
}

export type PaymentStatus = 'pending' | 'complete' | 'failed'

export type Payment = {
  checkout_request_id: string
  status: PaymentStatus
  amount: number
  phone: string
  ref: string | null // M-Pesa receipt once complete
  order_number: string | null // null for the standalone studio deposit
  mock: boolean
  created_at: string
}

// Records expire after 30 days — long enough to fulfill and track an order,
// short enough to keep the store tidy.
const TTL_SECONDS = 30 * 24 * 60 * 60

// How long the mock waits before auto-confirming, so the UI's "check your
// phone" state is actually visible during a demo.
const MOCK_CONFIRM_DELAY_MS = 6000

const orderKey = (n: string) => `order:${n}`
const paymentKey = (id: string) => `payment:${id}`

// ── Phone normalization ─────────────────────────────────────────────────────
// Accepts 0712…, +254712…, 254712…, 712…, with or without spaces/dashes.
// Returns Daraja's MSISDN form 2547######## / 2541########, or null if invalid.
export function normalizePhone(raw: string): string | null {
  let d = (raw ?? '').replace(/\D/g, '')
  if (d.startsWith('0')) d = '254' + d.slice(1)
  else if (d.startsWith('7') || d.startsWith('1')) d = '254' + d
  if (!/^254(7|1)\d{8}$/.test(d)) return null
  return d
}

// ── Order number ────────────────────────────────────────────────────────────
// RJ-XXXXXX, unambiguous alphabet (no 0/O/1/I) so customers can read it back.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
export function generateOrderNumber(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  let s = ''
  for (const b of bytes) s += ALPHABET[b % ALPHABET.length]
  return `RJ-${s}`
}

// ── Persistence helpers ─────────────────────────────────────────────────────
export async function saveOrder(order: Order): Promise<void> {
  await kvSetJson(orderKey(order.order_number), order, TTL_SECONDS)
}

export async function getOrder(orderNumber: string): Promise<Order | null> {
  return kvGetJson<Order>(orderKey(orderNumber.trim().toUpperCase()))
}

export async function savePayment(payment: Payment): Promise<void> {
  await kvSetJson(paymentKey(payment.checkout_request_id), payment, TTL_SECONDS)
}

export async function getPayment(id: string): Promise<Payment | null> {
  return kvGetJson<Payment>(paymentKey(id))
}

/**
 * Resolve a payment's current status for the polling endpoint.
 *
 * Real mode: the M-Pesa callback has already written 'complete'/'failed', so we
 * just read it back.
 *
 * Mock mode: there is no external callback, so we simulate one here — once the
 * fake "PIN entry" delay has elapsed we flip the payment to complete and, if it
 * belongs to an order, advance that order to 'confirmed'. This mirrors exactly
 * what handleCallback() does in real mode.
 */
export async function resolvePayment(id: string): Promise<Payment | null> {
  const payment = await getPayment(id)
  if (!payment) return null
  if (payment.status !== 'pending' || !payment.mock) return payment

  const elapsed = Date.now() - new Date(payment.created_at).getTime()
  if (elapsed < MOCK_CONFIRM_DELAY_MS) return payment

  payment.status = 'complete'
  payment.ref = `MOCK-${payment.checkout_request_id.slice(-8).toUpperCase()}`
  await savePayment(payment)
  if (payment.order_number) {
    await markOrderPaid(payment.order_number, payment.ref)
  }
  return payment
}

/** Apply a successful payment to its order. */
async function markOrderPaid(orderNumber: string, receipt: string): Promise<void> {
  const order = await getOrder(orderNumber)
  if (!order || order.status !== 'pending_payment') return
  order.status = 'confirmed'
  order.mpesa_receipt = receipt
  await saveOrder(order)
}

/**
 * Handle the parsed M-Pesa callback (real mode). Idempotent — Safaricom may
 * retry, so re-applying a completed payment is a no-op.
 */
export async function handleCallback(
  checkoutRequestId: string,
  success: boolean,
  receipt: string | null,
): Promise<void> {
  const payment = await getPayment(checkoutRequestId)
  if (!payment || payment.status !== 'pending') return

  payment.status = success ? 'complete' : 'failed'
  payment.ref = success ? receipt : null
  await savePayment(payment)

  if (success && payment.order_number) {
    await markOrderPaid(payment.order_number, receipt ?? 'M-PESA')
  }
}

// Guard against absurd carts before we ever touch M-Pesa.
export function computeTotal(items: OrderItem[]): number {
  return items.reduce((sum, i) => sum + i.price_ksh * i.quantity, 0)
}
