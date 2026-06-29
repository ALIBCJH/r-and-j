import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PRODUCTS, getProductById } from '@/app/lib/products'
import ProductPageClient from './ProductPageClient'

export async function generateStaticParams() {
  return PRODUCTS.map(p => ({ id: String(p.id) }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = getProductById(Number(id))
  if (!product) return {}
  return {
    title:       `${product.name} | R&J Interiors`,
    description: product.description,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = getProductById(Number(id))
  if (!product) notFound()
  return <ProductPageClient product={product} />
}
