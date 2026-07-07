import type { Metadata } from 'next'
import AdminClient from './AdminClient'

// Keep the ops dashboard out of search engines.
export const metadata: Metadata = {
  title: 'Admin | R&J Interiors',
  robots: { index: false, follow: false },
}

export default function AdminPage() {
  return <AdminClient />
}
