import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest, ctx: any) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Login necessário.' }, { status: 401 })

  const userId = (session.user as any).id
  const { productId } = ctx.params as { productId: string }

  const purchase = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: { userId, status: { in: ['PAID', 'COMPLETED'] } },
    },
    include: { product: true },
  })

  if (!purchase) {
    return NextResponse.json({ error: 'Acesso negado. Produto não comprado.' }, { status: 403 })
  }

  await prisma.download.create({ data: { userId, productId, orderId: purchase.orderId } })

  const fileUrl = purchase.product.fileUrl
  if (!fileUrl) return NextResponse.json({ error: 'Arquivo não disponível.' }, { status: 404 })

  return NextResponse.json({ downloadUrl: fileUrl, expiresAt: new Date(Date.now() + 10 * 60 * 1000) })
}
