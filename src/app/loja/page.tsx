import { Suspense } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import LojaPageClient from './LojaPageClient'
import { prisma } from '@/lib/prisma'
import type { Category } from '@/types'

async function getCategories(): Promise<Category[]> {
  return prisma.category.findMany({
    where: {
      active: true,
      slug: { in: ['botons', 'photocards', 'marca-paginas', 'chaveiros', 'ilustracoes', 'adesivos'] },
    },
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: { where: { active: true } } } } },
  })
}

export default async function LojaPage() {
  const categories = await getCategories()

  return (
    <>
      <Navbar />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando loja...</div>}>
        <LojaPageClient initialCategories={categories} />
      </Suspense>
    </>
  )
}
