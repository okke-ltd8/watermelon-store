import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { code, subtotal } = await req.json()
  if (!code) return NextResponse.json({ error: 'Informe o código.' }, { status: 400 })

  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase(), active: true },
  })

  if (!coupon) return NextResponse.json({ error: 'Cupom inválido ou expirado.' }, { status: 404 })
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ error: 'Cupom esgotado.' }, { status: 400 })
  }
  if (coupon.expiresAt && new Date() > coupon.expiresAt) {
    return NextResponse.json({ error: 'Cupom expirado.' }, { status: 400 })
  }
  if (coupon.minOrderValue && subtotal < Number(coupon.minOrderValue)) {
    return NextResponse.json({
      error: `Pedido mínimo: R$ ${Number(coupon.minOrderValue).toFixed(2)}`,
    }, { status: 400 })
  }

  const discount =
    coupon.discountType === 'PERCENT'
      ? subtotal * (Number(coupon.discountValue) / 100)
      : Number(coupon.discountValue)

  return NextResponse.json({
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: Number(coupon.discountValue),
    discount,
    description: coupon.description,
  })
}
