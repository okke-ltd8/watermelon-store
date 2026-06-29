'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Footer } from '@/components/layout/Footer'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { Product, Category } from '@/types'
import { Search, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const SORTS = [
  { value: 'popular', label: 'Mais populares' },
  { value: 'new', label: 'Mais novos' },
  { value: 'price-asc', label: 'Menor preço' },
  { value: 'price-desc', label: 'Maior preço' },
]

const CATEGORY_DISPLAY: Record<string, string> = {
  botons: 'Botons',
  photocards: 'Photocards',
  'marca-paginas': 'Marca Paginas',
  chaveiros: 'Chaveiros',
  ilustracoes: 'Ilustrações',
  adesivos: 'Adesivos',
}

export default function LojaPageClient({ initialCategories }: { initialCategories: Category[] }) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)

  const category = searchParams.get('category') ?? ''
  const search = searchParams.get('search') ?? ''
  const sort = searchParams.get('sort') ?? 'popular'

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ sort, page: String(page) })
    if (category) params.set('category', category)
    if (search) params.set('search', search)

    const res = await fetch(`/api/products?${params}`)
    const data = await res.json()
    setProducts(data.products ?? [])
    setTotal(data.total ?? 0)
    setLoading(false)
  }, [category, search, sort, page])

  useEffect(() => {
    setCategories(initialCategories)
  }, [initialCategories])

  useEffect(() => {
    setPage(1)
  }, [category, search, sort])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const setParam = (key: string, value: string) => {
    const p = new URLSearchParams(searchParams.toString())
    if (value) p.set(key, value)
    else p.delete(key)
    router.push(`/loja?${p}`)
  }

  return (
    <>
      <main className="min-h-screen">
        <div className="bg-watermelon-pink-light py-10 px-4">
          <div className="page-container text-center">
            <h1 className="text-3xl font-bold font-display text-watermelon-pink mb-2">Loja Watermelon 🍉</h1>
            <p className="text-watermelon-muted">{total} artes disponíveis</p>
          </div>
        </div>

        <div className="page-container py-8">
          <div className="flex gap-3 mb-5 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-watermelon-muted" />
              <input
                type="text"
                placeholder="Buscar botons, photocards, marca páginas..."
                defaultValue={search}
                onChange={(e) => setParam('search', e.target.value)}
                className="input pl-10"
              />
            </div>
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setParam('sort', e.target.value)}
                className="input appearance-none pr-8 w-auto"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-watermelon-muted pointer-events-none" />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
            <button
              onClick={() => setParam('category', '')}
              className={cn('flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all border',
                !category ? 'bg-watermelon-pink text-white border-watermelon-pink' : 'bg-white border-watermelon-border text-watermelon-muted hover:border-watermelon-pink hover:text-watermelon-pink'
              )}
            >
              Tudo ({total})
            </button>
            {categories.map((cat) => {
              const iconSrc = cat.icon || `/fotospng/${cat.slug}.svg`
              return (
                <button
                  key={cat.id}
                  onClick={() => setParam('category', cat.slug)}
                  className={cn('flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all border whitespace-nowrap',
                    category === cat.slug
                      ? 'bg-watermelon-pink text-white border-watermelon-pink'
                      : 'bg-white border-watermelon-border text-watermelon-muted hover:border-watermelon-pink hover:text-watermelon-pink'
                  )}
                >
                  {(iconSrc.endsWith('.svg') || iconSrc.endsWith('.png') || iconSrc.startsWith('/')) ? (
                    <Image src={iconSrc} alt={`${cat.name} icon`} width={20} height={20} className="rounded-full object-contain" unoptimized />
                  ) : (
                    <span>{iconSrc ?? '🎨'}</span>
                  )}
                  {CATEGORY_DISPLAY[cat.slug] ?? cat.name}
                  <span className="text-[10px] opacity-70">({cat._count?.products})</span>
                </button>
              )
            })}
          </div>

          <ProductGrid products={products} loading={loading} />

          {!loading && total > 12 && (
            <div className="flex justify-center gap-2 mt-10">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="btn-outline disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2 text-sm"
              >
                Anterior
              </button>
              <button
                disabled={products.length < 12}
                onClick={() => setPage((p) => p + 1)}
                className="btn-primary px-5 py-2 text-sm"
              >
                Próxima
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
