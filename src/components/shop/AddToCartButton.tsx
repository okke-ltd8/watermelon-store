'use client'

import { ShoppingCart, Heart } from 'lucide-react'
import { useCartStore, useWishlistStore } from '@/lib/store'
import { Product } from '@/types'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

export function AddToCartButton({ product }: { product: Pick<Product, 'id' | 'name' | 'price' | 'images' | 'category'> }) {
  const addItem = useCartStore((s) => s.addItem)
  const { toggle, has } = useWishlistStore()
  const wished = has(product.id)

  const handleAdd = () => {
    // Log para depuração: verificar se o handler é chamado
    console.debug('[AddToCartButton] handleAdd', product.id)
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      categoryName: product.category?.name ?? '',
    })
    toast.success('Adicionado ao carrinho!')
  }

  return (
    <div className="flex gap-3">
      <button type="button" onClick={(e) => { e.stopPropagation(); handleAdd() }} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3.5 text-base">
        <ShoppingCart size={18} />
        Adicionar ao carrinho
      </button>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); console.debug('[AddToCartButton] toggleWishlist', product.id); toggle(product.id); toast(wished ? 'Removido dos favoritos' : '❤️ Adicionado!') }}
        className={cn(
          'w-13 h-13 border-2 rounded-full flex items-center justify-center transition-all px-4',
          wished ? 'border-watermelon-pink bg-watermelon-pink text-white' : 'border-watermelon-border text-watermelon-muted hover:border-watermelon-pink hover:text-watermelon-pink'
        )}
      >
        <Heart size={20} fill={wished ? 'currentColor' : 'none'} />
      </button>
    </div>
  )
}
