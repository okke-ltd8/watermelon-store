import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getPaymentInfo, mapMPStatusToOrderStatus } from '@/lib/mercadopago'

export async function POST(req: NextRequest) {
  try {
    const xSignature  = req.headers.get('x-signature') ?? ''
    const xRequestId  = req.headers.get('x-request-id') ?? ''
    const body        = await req.json()

    const dataId = body?.data?.id ?? body?.resource?.split('/').pop() ?? ''
    const topic  = body?.type ?? body?.topic

    if (topic !== 'payment') {
      return NextResponse.json({ ok: true })
    }

    if (!dataId) {
      return NextResponse.json({ error: 'Missing payment id.' }, { status: 400 })
    }

    const payment = await getPaymentInfo(dataId)

    if (!payment?.external_reference) {
      return NextResponse.json({ ok: true })
    }

    const orderId     = payment.external_reference
    const mpStatus    = payment.status ?? ''
    const orderStatus = mapMPStatusToOrderStatus(mpStatus)

    const order = await prisma.order.findUnique({ where: { id: orderId } })
    if (!order) {
      console.error('[Webhook] Pedido não encontrado:', orderId)
      return NextResponse.json({ ok: true })
    }

    await prisma.$transaction([
      prisma.order.update({
        where: { id: orderId },
        data: {
          status: orderStatus as any,
          mpPaymentId: String(dataId),
        },
      }),
      prisma.payment.upsert({
        where: { orderId },
        update: {
          mpPaymentId: String(dataId),
          mpStatus,
          mpStatusDetail: payment.status_detail ?? '',
          status: orderStatus === 'PAID' ? 'APPROVED' : orderStatus === 'CANCELLED' ? 'REJECTED' : 'PENDING',
          paidAt: orderStatus === 'PAID' ? new Date() : undefined,
        },
        create: {
          orderId,
          method: detectPaymentMethod(payment.payment_type_id ?? '') as any,
          status: orderStatus === 'PAID' ? 'APPROVED' : 'PENDING',
          amount: order.total,
          mpPaymentId: String(dataId),
          mpStatus,
          mpStatusDetail: payment.status_detail ?? '',
          paidAt: orderStatus === 'PAID' ? new Date() : undefined,
          pixQrCode: payment.point_of_interaction?.transaction_data?.qr_code,
          pixQrCodeBase64: payment.point_of_interaction?.transaction_data?.qr_code_base64,
        },
      }),
    ])

    if (orderStatus === 'PAID') {
      const orderWithItems = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: { include: { product: true } }, user: true },
      })

      if (orderWithItems) {
        await prisma.user.update({
          where: { id: orderWithItems.userId },
          data: { points: { increment: Math.floor(Number(order.total)) } },
        })

        for (const item of orderWithItems.items) {
          if (item.product.digital) {
            await prisma.download.create({
              data: {
                userId: orderWithItems.userId,
                productId: item.productId,
                orderId,
              },
            })
          }
          await prisma.product.update({
            where: { id: item.productId },
            data: { soldCount: { increment: item.quantity } },
          })
        }
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Webhook MP]', err)
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}

function detectPaymentMethod(typeId: string) {
  if (typeId === 'pix') return 'PIX'
  if (typeId === 'ticket') return 'BOLETO'
  if (typeId === 'debit_card') return 'DEBIT_CARD'
  return 'CREDIT_CARD'
}
