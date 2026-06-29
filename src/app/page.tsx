import Image from 'next/image'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProductGrid } from '@/components/shop/ProductGrid'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowRight, Star, Zap, Shield, Download } from 'lucide-react'

export const revalidate = 60

async function getData() {
  const [featured, categories] = await Promise.all([
    prisma.product.findMany({
      where: { active: true, featured: true },
      take: 8,
      include: {
        category: { select: { name: true, slug: true, icon: true } },
        reviews: { select: { rating: true }, where: { approved: true } },
      },
      orderBy: { soldCount: 'desc' },
    }),
    prisma.category.findMany({
      where: {
        active: true,
        slug: { in: ['botons', 'photocards', 'marca-paginas', 'chaveiros', 'ilustracoes', 'adesivos'] },
      },
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { products: { where: { active: true } } } } },
    }),
  ])

  return {
    featured: featured.map((p) => ({
      ...p,
      images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
      price: Number(p.price),
      comparePrice: p.comparePrice ? Number(p.comparePrice) : undefined,
      avgRating: p.reviews.length ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0,
      reviewCount: p.reviews.length,
    })),
    categories,
  }
}

export default async function HomePage() {
  const { featured, categories } = await getData()

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-hero text-white py-20 px-4 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
            <span className="absolute text-9xl top-0 right-8">🍉</span>
            <span className="absolute text-6xl bottom-4 left-4">✨</span>
            <span className="absolute text-5xl top-1/2 left-1/4">🌸</span>
          </div>
          <div className="page-container text-center relative">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
              <Star size={14} className="fill-white" />
              Avaliação 4.9/5.0 · +500 clientes felizes
            </div>
            <h1 className="text-4xl md:text-6xl font-bold font-display mb-4 leading-tight">
              Artes e Produtos cheio de personalidade!
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-xl mx-auto leading-relaxed">
              Botons, photocards, marca páginas e chaveiros criativos.<br />
              Personalize seu espaço digital com produtos únicos.
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Link href="/loja" className="btn-white bg-white text-watermelon-pink px-8 py-3 rounded-full font-semibold hover:bg-white/90 transition-colors inline-flex items-center gap-2">
                Ver loja <ArrowRight size={16} />
              </Link>
              <Link href="/sobre" className="border-2 border-white/50 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors">
                Conhecer artista
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-10 border-b border-watermelon-border bg-white">
          <div className="page-container grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Zap size={20} />, title: 'Entrega rápida', desc: 'Produtos digitais imediatos' },
              { icon: <Shield size={20} />, title: 'Pagamento seguro', desc: 'Mercado Pago certificado' },
              { icon: <Download size={20} />, title: 'Download protegido', desc: 'Acesso vitalício na conta' },
              { icon: <Star size={20} />, title: 'Alta qualidade', desc: 'Arte profissional kawaii' },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <div className="w-10 h-10 bg-watermelon-pink-light text-watermelon-pink rounded-xl flex items-center justify-center flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-watermelon-dark">{f.title}</div>
                  <div className="text-xs text-watermelon-muted mt-0.5">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="py-12">
          <div className="page-container">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title">Categorias</h2>
              <Link href="/loja" className="text-sm text-watermelon-pink hover:underline flex items-center gap-1">
                Ver todas <ArrowRight size={14} />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {categories.map((cat) => {
                const iconSrc = cat.icon || `/fotospng/${cat.slug}.svg`
                return (
                  <Link
                    key={cat.id}
                    href={`/loja?category=${cat.slug}`}
                    className="flex-shrink-0 flex flex-col items-center gap-2 bg-white border border-watermelon-border rounded-2xl px-5 py-4 hover:border-watermelon-pink hover:bg-watermelon-pink-light transition-all group"
                  >
                    <Image
                      src={iconSrc}
                      alt={`${cat.name} icon`}
                      width={40}
                      height={40}
                      className="rounded-full object-contain"
                      unoptimized
                    />
                    <span className="text-xs font-medium text-watermelon-dark group-hover:text-watermelon-pink transition-colors whitespace-nowrap">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-watermelon-muted">{cat._count?.products} artes</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Featured products */}
        <section className="py-4 pb-16">
          <div className="page-container">
            <div className="flex items-center justify-between mb-6">
              <h2 className="section-title">Mais vendidos</h2>
              <Link href="/loja" className="text-sm text-watermelon-pink hover:underline flex items-center gap-1">
                Ver todos <ArrowRight size={14} />
              </Link>
            </div>
            <ProductGrid products={featured as any} />
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-12">
          <div className="page-container">
            <div className="bg-watermelon-green rounded-3xl p-8 md:p-12 text-white text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
                <span className="absolute text-8xl -top-4 -right-4">🍉</span>
                <span className="absolute text-6xl -bottom-4 -left-4">🌸</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold font-display mb-2 relative">
                Fique por dentro das novidades
              </h2>
              <p className="text-white/80 mb-6 relative">
                Receba lançamentos, promoções e artes exclusivas no seu e-mail.
              </p>
              <form action="/api/newsletter" method="POST" className="flex gap-3 max-w-md mx-auto flex-wrap sm:flex-nowrap relative">
                <input
                  type="email"
                  name="email"
                  placeholder="seu@email.com"
                  className="flex-1 bg-white/20 border border-white/30 rounded-full px-5 py-3 text-white placeholder:text-white/60 outline-none focus:bg-white/30 text-sm min-w-0"
                />
                <button
                  type="submit"
                  className="bg-white text-watermelon-green font-semibold px-6 py-3 rounded-full hover:bg-white/90 transition-colors text-sm whitespace-nowrap"
                >
                  Inscrever
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
