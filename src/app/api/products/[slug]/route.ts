import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, ctx: any) {
  const params = ctx.params as { slug: string }
  const product = await prisma.product.findUnique({
    where: { slug: params.slug, active: true },
    include: {
      category: true,
      reviews: {
        include: { user: { select: { name: true, image: true } } },
        where: { approved: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  if (!product) return NextResponse.json({ error: 'Produto não encontrado.' }, { status: 404 })

  const related = await prisma.product.findMany({
    where: { categoryId: product.categoryId, active: true, id: { not: product.id } },
    take: 4,
    include: { category: { select: { name: true, icon: true } } },
  })

  const avgRating = product.reviews.length
    ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length
    : 0

  return NextResponse.json({ ...product, avgRating, related })
}

export async function PUT(req: NextRequest, ctx: any) {
  const params = ctx.params as { slug: string }
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }
  const data = await req.json()
  const product = await prisma.product.update({ where: { slug: params.slug }, data })
  return NextResponse.json(product)
}

export async function DELETE(_: NextRequest, ctx: any) {
  const params = ctx.params as { slug: string }
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }
  await prisma.product.update({ where: { slug: params.slug }, data: { active: false } })
  return NextResponse.json({ ok: true })
}
