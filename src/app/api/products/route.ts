import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { slugify } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const search   = searchParams.get('search')
  const sort     = searchParams.get('sort') ?? 'popular'
  const featured = searchParams.get('featured')
  const page     = parseInt(searchParams.get('page') ?? '1')
  const limit    = parseInt(searchParams.get('limit') ?? '12')

  const where: any = { active: true }
  if (category) where.category = { slug: category }
  if (featured === 'true') where.featured = true
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ]
  }

  const orderBy: any =
    sort === 'price-asc'  ? { price: 'asc' }  :
    sort === 'price-desc' ? { price: 'desc' } :
    sort === 'new'        ? { createdAt: 'desc' } :
                            { soldCount: 'desc' }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: { select: { name: true, slug: true, icon: true } },
        reviews: { select: { rating: true } },
      },
    }),
    prisma.product.count({ where }),
  ])

  const enriched = products.map((p) => ({
    ...p,
    images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
    avgRating: p.reviews.length
      ? p.reviews.reduce((s, r) => s + r.rating, 0) / p.reviews.length
      : 0,
    reviewCount: p.reviews.length,
  }))

  return NextResponse.json({ products: enriched, total, page, pages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  const schema = z.object({
    name: z.string().min(2),
    description: z.string().min(10),
    price: z.number().positive(),
    comparePrice: z.number().optional(),
    categoryId: z.string(),
    images: z.array(z.string()).min(1),
    digital: z.boolean().default(true),
    fileUrl: z.string().optional(),
    badge: z.string().optional(),
    featured: z.boolean().default(false),
    stock: z.number().default(-1),
  })

  try {
    const body = await req.json()
    const data = schema.parse(body)
    const slug = slugify(data.name)

    const product = await prisma.product.create({
      data: { ...data, images: JSON.stringify(data.images), slug, active: true },
    })
    return NextResponse.json(product, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
