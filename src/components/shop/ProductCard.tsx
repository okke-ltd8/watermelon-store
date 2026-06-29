'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useCartStore, useWishlistStore } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'
import { Product } from '@/types'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const { toggle, has } = useWishlistStore()
  const wished = has(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.debug('[ProductCard] handleAddToCart', product.id)
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      categoryName: product.category?.name ?? '',
    })
    toast.success(`${product.name} adicionado!`)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.debug('[ProductCard] handleWishlist', product.id)
    toggle(product.id)
    toast(wished ? 'Removido dos favoritos' : '❤️ Adicionado aos favoritos')
  }

  const discount = product.comparePrice
    ? Math.round((1 - product.price / product.comparePrice) * 100)
    : 0

  return (
    <Link href={`/produto/${product.slug}`} className={cn('group card block overflow-hidden', className)}>
      {/* Image */}
      <div className="relative aspect-square bg-watermelon-pink-light overflow-hidden">
        {Array.isArray(product.images) && product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-6xl select-none">
            🍉
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
          {product.badge && <span className="badge-pink">{product.badge}</span>}
          {discount > 0 && <span className="badge bg-watermelon-red text-white">-{discount}%</span>}
          {product.digital && <span className="badge bg-watermelon-green/90 text-white">Digital</span>}
        </div>

        {/* Wishlist */}
          <button
            type="button"
            onClick={handleWishlist}
          className={cn(
            'absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all',
            wished
              ? 'bg-watermelon-pink text-white'
              : 'bg-white/80 text-watermelon-muted hover:bg-watermelon-pink hover:text-white'
          )}
          aria-label="Favoritar"
        >
          <Heart size={15} fill={wished ? 'currentColor' : 'none'} />
        </button>

        {/* Quick add */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full bg-watermelon-pink text-white py-2.5 text-sm font-medium flex items-center justify-center gap-2 hover:bg-watermelon-pink-dark transition-colors"
          >
            <ShoppingCart size={15} />
            Adicionar ao carrinho
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-[11px] text-watermelon-muted mb-1">{product.category?.name}</p>
        <h3 className="text-sm font-medium text-watermelon-dark line-clamp-2 leading-snug mb-2">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-bold text-watermelon-pink">{formatCurrency(product.price)}</span>
            {product.comparePrice && (
              <span className="text-xs text-watermelon-muted line-through ml-1.5">
                {formatCurrency(product.comparePrice)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-8 h-8 bg-watermelon-pink rounded-full flex items-center justify-center text-white hover:bg-watermelon-pink-dark transition-colors"
            aria-label="Adicionar"
          >
            <ShoppingCart size={14} />
          </button>
        </div>
      </div>
    </Link>
  )
}
