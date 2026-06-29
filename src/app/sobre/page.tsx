import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProductGrid } from '@/components/shop/ProductGrid'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { Instagram, MessageCircle, Pencil, Palette, Heart, Sparkles } from 'lucide-react'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Sobre a Artista',
  description: 'Conheça a Watermelon, artista digital independente especializada em arte kawaii.',
}

export const revalidate = 3600

export default async function SobrePage() {
  const portfolio = await prisma.product.findMany({
    where: { active: true },
    take: 4,
    orderBy: { soldCount: 'desc' },
    include: {
      category: { select: { name: true, slug: true, icon: true } },
      reviews: { select: { rating: true }, where: { approved: true } },
    },
  })

  const normalized = portfolio.map((p) => ({
    ...p,
    images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
    price: Number(p.price),
    comparePrice: p.comparePrice ? Number(p.comparePrice) : undefined,
    avgRating: p.reviews.length ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length : 0,
    reviewCount: p.reviews.length,
  }))

  const steps: { icon: ReactNode; title: string; desc: string }[] = [
    { icon: <Pencil size={24} className="text-watermelon-pink" />, title: 'Sketch inicial', desc: 'Esboço com lápis digital no Procreate, definindo pose, composição e expressão.' },
    { icon: <Palette size={24} className="text-watermelon-pink" />, title: 'Lineart', desc: 'Linhas limpas e expressivas, com variação de espessura para dar vida ao traço.' },
    { icon: <Heart size={24} className="text-watermelon-pink" />, title: 'Colorização', desc: 'Paleta kawaii vibrante com shading suave e iluminação que transmite emoção.' },
    { icon: <Sparkles size={24} className="text-watermelon-pink" />, title: 'Finalização', desc: 'Detalhes especiais, brilhos e exportação em alta qualidade pronta para uso.' },
  ]

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-watermelon-pink-light py-16 px-4">
          <div className="page-container flex flex-col md:flex-row items-center gap-10">
            <div className="w-36 h-36 md:w-48 md:h-48 flex-shrink-0 rounded-full overflow-hidden shadow-xl">
              <Image src="/logoloja.jpeg" alt="Logotipo Watermelon" width={192} height={192} className="object-cover" />
            </div>
            <div>
              <p className="text-sm font-medium text-watermelon-pink mb-2 uppercase tracking-wider">Artista digital independente</p>
              <h1 className="text-4xl md:text-5xl font-bold font-display text-watermelon-dark mb-4">watermelon.ens</h1>
              <p className="text-watermelon-muted leading-relaxed max-w-xl mb-6">
                Olá! Sou apaixonada por criar arte kawaii e tudo que é cute, colorido e cheio de personalidade.
                Trabalho com botons, photocards, marca páginas, chaveiros, ilustrações e adesivos para streamers, criadores de
                conteúdo e quem ama arte digital fofa.
              </p>
              <div className="flex gap-3 flex-wrap">
                {[
                  { icon: <Instagram size={16} />, label: '@lojinha.watermelon.ens', href: 'https://www.instagram.com/lojinha.watermelon.ens/' },
                  { icon: <MessageCircle size={16} />, label: 'WhatsApp', href: 'https://wa.me/5582987454073?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20seus%20trabalhos' },
                ].map((s) => (
                  <a key={s.label} href={s.href} className="flex items-center gap-2 bg-white border border-watermelon-border rounded-full px-4 py-2 text-sm text-watermelon-muted hover:border-watermelon-pink hover:text-watermelon-pink transition-all">
                    {s.icon} {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-10 border-b border-watermelon-border bg-white">
          <div className="page-container grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '+500', label: 'Clientes felizes' },
              { value: '+1000', label: 'Artes criadas' },
              { value: '4.9 ⭐', label: 'Avaliação média' },
              { value: '3 anos', label: 'De experiência' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold text-watermelon-pink font-display">{s.value}</div>
                <div className="text-sm text-watermelon-muted mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="py-16 px-4">
          <div className="page-container">
            <h2 className="section-title text-center mb-12">Meu processo criativo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <div key={step.title} className="card p-6 text-center">
                  <div className="w-14 h-14 bg-watermelon-pink-light rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4">
                    {step.icon}
                  </div>
                  <div className="text-xs font-medium text-watermelon-pink mb-2">ETAPA {i + 1}</div>
                  <h3 className="font-bold text-watermelon-dark mb-2">{step.title}</h3>
                  <p className="text-sm text-watermelon-muted leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio */}
        <section className="py-4 pb-16 bg-watermelon-bg">
          <div className="page-container">
            <h2 className="section-title mb-8">Portfólio em destaque</h2>
            <ProductGrid products={normalized as any} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
