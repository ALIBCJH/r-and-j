// Base for API calls. Defaults to same-origin '/api' so the built-in Next.js
// route handlers (app/api/*) serve checkout, M-Pesa and tracking. Override with
// NEXT_PUBLIC_API_URL only if you point the frontend at a separate backend.
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api'
