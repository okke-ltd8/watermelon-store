import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createPreference } from '@/lib/mercadopago'
import { z } from 'zod'

const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
  })),
  couponCode: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Faça login para continuar.' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { items, couponCode } = orderSchema.parse(body)

    const productIds = items.map((i) => i.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, active: true },
    })

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: 'Um ou mais produtos não encontrados.' }, { status: 400 })
    }

    let discount = 0
    let coupon = null
    if (couponCode) {
      coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase(), active: true },
      })
      if (!coupon) {
        return NextResponse.json({ error: 'Cupom inválido ou expirado.' }, { status: 400 })
      }
      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        return NextResponse.json({ error: 'Cupom esgotado.' }, { status: 400 })
      }
    }

    const subtotal = items.reduce((sum, item) => {
      const product = products.find((p) => p.id === item.productId)!
      return sum + Number(product.price) * item.quantity
    }, 0)

    if (coupon) {
      if (coupon.discountType === 'PERCENT') {
        discount = subtotal * (Number(coupon.discountValue) / 100)
      } else {
        discount = Number(coupon.discountValue)
      }
    }

    const total = Math.max(0, subtotal - discount)

    const order = await prisma.order.create({
      data: {
        userId: (session.user as any).id,
        subtotal,
        discount,
        total,
        couponId: coupon?.id,
        couponCode: coupon?.code,
        status: 'PENDING',
        items: {
          create: items.map((item) => {
            const product = products.find((p) => p.id === item.productId)!
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: product.price,
            }
          }),
        },
      },
      include: { items: { include: { product: true } } },
    })

    if (coupon) {
      await prisma.coupon.update({
        where: { id: coupon.id },
        data: { usedCount: { increment: 1 } },
      })
    }

    const preference = await createPreference({
      orderId: order.id,
      externalReference: order.id,
      payer: { name: session.user.name!, email: session.user.email! },
      items: order.items.map((item) => {
        const imgs = typeof item.product.images === 'string' ? JSON.parse(item.product.images) : item.product.images
        return {
          id: item.productId,
          title: item.product.name,
          unit_price: Number(item.price),
          quantity: item.quantity,
          picture_url: imgs[0] ?? undefined,
        }
      }),
    })

    await prisma.order.update({
      where: { id: order.id },
      data: { mpPreferenceId: preference.id, status: 'WAITING_PAYMENT' },
    })

    return NextResponse.json({
      orderId: order.id,
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
    }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/orders]', err)
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro ao criar pedido.' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }
  const userId = (session.user as any).id
  const isAdmin = (session.user as any).role === 'ADMIN'

  const orders = await prisma.order.findMany({
    where: isAdmin ? {} : { userId },
    include: {
      items: { include: { product: { select: { name: true, images: true, slug: true } } } },
      payment: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return NextResponse.json(orders)
}
