import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { prisma } from '@/lib/prisma'
export const dynamic = 'force-dynamic'
import { notFound } from 'next/navigation'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Star, ShoppingCart, Heart, Download, Shield, Zap } from 'lucide-react'
import Image from 'next/image'
import { AddToCartButton } from '@/components/shop/AddToCartButton'
import type { Metadata } from 'next'

interface Props { params: { slug: string } }

export async function generateMetadata(props: any): Promise<Metadata> {
  const { params } = props
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    select: { name: true, description: true, images: true },
  })
  if (!product) return { title: 'Produto não encontrado' }
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: { images: product.images[0] ? [product.images[0]] : [] },
  }
}

export default async function ProductPage(props: any) {
  const { params } = props
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, active: true },
    include: {
      category: true,
      reviews: {
        where: { approved: true },
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!product) notFound()

  const productImages = typeof product.images === 'string' ? JSON.parse(product.images) as string[] : product.images as string[]

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, active: true, id: { not: product.id } },
    take: 4,
    include: {
      category: { select: { name: true, slug: true, icon: true } },
      reviews: { select: { rating: true }, where: { approved: true } },
    },
  })

  const avgRating = product.reviews.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0

  const price = Number(product.price)
  const comparePrice = product.comparePrice ? Number(product.comparePrice) : undefined
  const discount = comparePrice ? Math.round((1 - price / comparePrice) * 100) : 0

  const relatedNorm = related.map((p) => ({
    ...p,
    images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
    price: Number(p.price),
    comparePrice: p.comparePrice ? Number(p.comparePrice) : undefined,
    avgRating: p.reviews.length ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0,
    reviewCount: p.reviews.length,
  }))

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-8">
        <div className="page-container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
            {/* Images */}
            <div>
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-watermelon-pink-light mb-3">
                {productImages[0] ? (
                  <Image src={productImages[0]} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-9xl">🍉</div>
                )}
                {product.badge && (
                  <span className="absolute top-4 left-4 badge-pink text-sm px-3 py-1">{product.badge}</span>
                )}
                {discount > 0 && (
                  <span className="absolute top-4 right-4 badge bg-watermelon-red text-white text-sm px-3 py-1">
                    -{discount}%
                  </span>
                )}
              </div>
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {productImages.slice(1).map((img, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden bg-watermelon-pink-light relative">
                      <Image src={img} alt={`${product.name} ${i + 2}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <p className="text-sm text-watermelon-pink font-medium mb-2">{product.category.name}</p>
              <h1 className="text-3xl font-bold font-display text-watermelon-dark mb-3">{product.name}</h1>

              {product.reviews.length > 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} className={i < Math.round(avgRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'} />
                    ))}
                  </div>
                  <span className="text-sm text-watermelon-muted">
                    {avgRating.toFixed(1)} ({product.reviews.length} avaliações)
                  </span>
                </div>
              )}

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-4xl font-bold text-watermelon-pink">{formatCurrency(price)}</span>
                {comparePrice && (
                  <span className="text-lg text-watermelon-muted line-through">{formatCurrency(comparePrice)}</span>
                )}
              </div>

              <p className="text-watermelon-muted leading-relaxed mb-6">{product.description}</p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { icon: <Zap size={15} />, text: 'Entrega imediata' },
                  { icon: <Download size={15} />, text: 'Download na conta' },
                  { icon: <Shield size={15} />, text: 'Pagamento seguro' },
                  { icon: <Star size={15} />, text: 'Uso pessoal e comercial' },
                ].map((f) => (
                  <div key={f.text} className="flex items-center gap-2 text-sm text-watermelon-muted">
                    <span className="text-watermelon-green">{f.icon}</span>
                    {f.text}
                  </div>
                ))}
              </div>

              <AddToCartButton product={{ id: product.id, name: product.name, price, images: productImages, category: { name: product.category.name } as any }} />
            </div>
          </div>

          {/* Related */}
          {relatedNorm.length > 0 && (
            <div>
              <h2 className="section-title mb-6">Você também pode gostar</h2>
              <ProductGrid products={relatedNorm as any} cols={4} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
