import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Login necessário.' }, { status: 401 })

  try {
    const body = await req.json()
    const data = schema.parse(body)
    const userId = (session.user as any).id

    const purchased = await prisma.orderItem.findFirst({
      where: {
        productId: data.productId,
        order: { userId, status: 'COMPLETED' },
      },
    })
    if (!purchased) {
      return NextResponse.json({ error: 'Você precisa comprar o produto para avaliá-lo.' }, { status: 403 })
    }

    const review = await prisma.review.upsert({
      where: { userId_productId: { userId, productId: data.productId } },
      update: { rating: data.rating, comment: data.comment, approved: false },
      create: { userId, productId: data.productId, rating: data.rating, comment: data.comment },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: err.errors }, { status: 400 })
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
