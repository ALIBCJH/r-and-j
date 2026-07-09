// Founding-Customer reservations ("Reserve Your Place" list).
//
// The /api/waitlist route writes one record per signup:
//   waitlist:{N}     → the entry (name, contact, package)  [180-day TTL]
//   waitlist:count   → a running integer counter (never decrements)
//
// This module is the read side the admin dashboard uses to list them.

import { kvGetJson } from './store'

export type WaitlistEntry = {
  name: string
  phone: string
  email: string
  product_name: string
  created_at: string
}

const COUNT_KEY = 'waitlist:count'
const entryKey = (n: number) => `waitlist:${n}`

/** How many reservations have ever been recorded (counter; ignores TTL expiry). */
export async function getWaitlistCount(): Promise<number> {
  return (await kvGetJson<number>(COUNT_KEY)) ?? 0
}

/** All current reservations, newest first. Entries past their TTL are skipped. */
export async function listWaitlist(): Promise<WaitlistEntry[]> {
  const count = await getWaitlistCount()
  if (count <= 0) return []
  const ns = Array.from({ length: count }, (_, i) => i + 1)
  const entries = await Promise.all(ns.map(n => kvGetJson<WaitlistEntry>(entryKey(n))))
  return entries.filter((e): e is WaitlistEntry => e !== null).reverse()
}
