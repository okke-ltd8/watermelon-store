import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const categories = await prisma.category.findMany({
    where: {
      active: true,
      slug: { in: ['botons', 'photocards', 'marca-paginas', 'chaveiros', 'ilustracoes', 'adesivos'] },
    },
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: { where: { active: true } } } } },
  })
  return NextResponse.json(categories)
}
