// Minimal admin auth: a single shared password unlocks a signed-cookie session.
// Dependency-free (Node crypto). Right weight for a two-person team.
//
// Set in .env.local (and Vercel):
//   ADMIN_PASSWORD=<a long, private passphrase>
//   ADMIN_SESSION_SECRET=<any long random string>   # optional; falls back to password

import { cookies } from 'next/headers'
import crypto from 'crypto'

const COOKIE = 'rj_admin'
const MAX_AGE_S = 12 * 60 * 60 // 12 hours

function signingSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || ''
}

/** Constant-time password check. */
export function passwordOk(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || ''
  if (!expected || !input) return false
  const a = Buffer.from(input)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return crypto.timingSafeEqual(a, b)
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', signingSecret()).update(payload).digest('hex')
}

function timingEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  try {
    return crypto.timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'))
  } catch {
    return false
  }
}

/** Issue the session cookie after a correct password. */
export async function startSession(): Promise<void> {
  const exp = String(Date.now() + MAX_AGE_S * 1000)
  const token = `${exp}.${sign(exp)}`
  ;(await cookies()).set(COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE_S,
  })
}

export async function endSession(): Promise<void> {
  ;(await cookies()).delete(COOKIE)
}

/** True if the request carries a valid, unexpired admin session. */
export async function isAdmin(): Promise<boolean> {
  const token = (await cookies()).get(COOKIE)?.value
  if (!token) return false
  const [exp, mac] = token.split('.')
  if (!exp || !mac) return false
  if (!timingEqualHex(sign(exp), mac)) return false
  return Number(exp) > Date.now()
}

/** True when an admin password has actually been configured. */
export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD)
}
