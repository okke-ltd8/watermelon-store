import { ProductCard } from './ProductCard'
import { Product } from '@/types'
import { cn } from '@/lib/utils'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  className?: string
  cols?: 2 | 3 | 4
}

export function ProductGrid({ products, loading, className, cols = 4 }: ProductGridProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
  }[cols]

  if (loading) {
    return (
      <div className={cn('grid gap-4', gridCols, className)}>
        {Array.from({ length: cols === 4 ? 8 : 6 }).map((_, i) => (
          <div key={i} className="card overflow-hidden animate-pulse">
            <div className="aspect-square bg-gray-100" />
            <div className="p-3 space-y-2">
              <div className="h-3 bg-gray-100 rounded w-1/3" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-5 bg-gray-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="text-center py-16 text-watermelon-muted">
        <div className="text-5xl mb-4">🍉</div>
        <p className="font-medium">Nenhum produto encontrado.</p>
        <p className="text-sm mt-1">Tente outros filtros ou busca.</p>
      </div>
    )
  }

  return (
    <div className={cn('grid gap-4', gridCols, className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
