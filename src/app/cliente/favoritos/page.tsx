'use client'

import { useWishlistStore } from '@/lib/store'
import { useEffect, useState } from 'react'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import { Product } from '@/types'

export default function ClienteFavoritosPage() {
  const wishlistIds = useWishlistStore((s) => s.items)
  const wishlistParam = wishlistIds.join(',')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!wishlistIds.length) { setLoading(false); return }
    fetch(`/api/products?ids=${wishlistParam}`)
      .then((r) => r.json())
      .then((d) => setProducts(d.products ?? []))
      .finally(() => setLoading(false))
  }, [wishlistParam, wishlistIds.length])

  if (!wishlistIds.length) {
    return (
      <div className="text-center py-16">
        <Heart size={48} className="mx-auto mb-4 text-watermelon-border" />
        <h2 className="text-xl font-bold font-display text-watermelon-dark mb-2">Nenhum favorito ainda</h2>
        <p className="text-watermelon-muted mb-6">Clique no coração nos produtos para adicioná-los aqui.</p>
        <Link href="/loja" className="btn-primary px-8 py-3">Explorar loja</Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-watermelon-dark mb-6">
        Favoritos <span className="text-watermelon-muted font-normal text-lg">({wishlistIds.length})</span>
      </h1>
      <ProductGrid products={products} loading={loading} />
    </div>
  )
}
