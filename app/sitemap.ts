import type { MetadataRoute } from 'next'

const SITE_URL = 'https://rjinteriors.co.ke'

// Public, indexable routes. Add new pages here as they ship.
const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '',            priority: 1.0, changeFrequency: 'weekly'  },
  { path: '/experience', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/catalog',    priority: 0.8, changeFrequency: 'monthly' },
  { path: '/studio',     priority: 0.7, changeFrequency: 'monthly' },
  { path: '/about',      priority: 0.6, changeFrequency: 'yearly'  },
  { path: '/contact',    priority: 0.6, changeFrequency: 'yearly'  },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }))
}
