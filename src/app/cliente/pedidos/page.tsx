import Image from 'next/image'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate, ORDER_STATUS_COLOR, ORDER_STATUS_LABEL } from '@/lib/utils'
import Link from 'next/link'
import { ShoppingBag, Download } from 'lucide-react'

export const revalidate = 0

export default async function ClientePedidosPage() {
  const session = await getServerSession(authOptions)
  const userId = (session!.user as any).id

  const orders = await prisma.order.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: { product: { select: { name: true, images: true, slug: true, digital: true } } },
      },
      payment: { select: { method: true, paidAt: true } },
    },
  })

  const methodLabel: Record<string, string> = {
    PIX: 'PIX', CREDIT_CARD: 'Cartão de crédito', DEBIT_CARD: 'Cartão de débito', BOLETO: 'Boleto',
  }

  if (!orders.length) {
    return (
      <div className="text-center py-16">
        <ShoppingBag size={48} className="mx-auto mb-4 text-watermelon-border" />
        <h2 className="text-xl font-bold font-display text-watermelon-dark mb-2">Nenhum pedido ainda</h2>
        <p className="text-watermelon-muted mb-6">Explore a loja e encontre sua próxima arte!</p>
        <Link href="/loja" className="btn-primary px-8 py-3">Ir para loja</Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-watermelon-dark mb-6">Meus pedidos</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="card overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-watermelon-bg border-b border-watermelon-border flex-wrap gap-3">
              <div>
                <span className="text-xs text-watermelon-muted">Pedido</span>
                <span className="font-mono font-bold text-watermelon-dark ml-1 text-sm">
                  #{order.id.slice(-8).toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-watermelon-muted">{formatDate(order.createdAt)}</span>
                {order.payment?.method && (
                  <span className="badge badge-outline">{methodLabel[order.payment.method]}</span>
                )}
                <span className={`badge ${ORDER_STATUS_COLOR[order.status]}`}>
                  {ORDER_STATUS_LABEL[order.status]}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="px-5 py-4 space-y-3">
              {order.items.map((item) => {
                const images = typeof item.product.images === 'string' ? JSON.parse(item.product.images) : item.product.images
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-watermelon-pink-light flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                      {images[0] ? (
                        <Image src={images[0]} alt={item.product.name} width={48} height={48} className="w-full h-full object-cover rounded-xl" unoptimized />
                      ) : '🍉'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={`/produto/${item.product.slug}`} className="text-sm font-medium text-watermelon-dark hover:text-watermelon-pink transition-colors line-clamp-1">
                        {item.product.name}
                      </Link>
                      <p className="text-xs text-watermelon-muted">Qtd: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-watermelon-dark flex-shrink-0">
                      {formatCurrency(Number(item.price) * item.quantity)}
                    </span>
                    {item.product.digital && ['PAID', 'COMPLETED'].includes(order.status) && (
                      <Link href={`/api/user/downloads/${item.productId}`}
                        className="flex items-center gap-1 text-xs text-watermelon-green hover:underline flex-shrink-0">
                        <Download size={13} /> Baixar
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-watermelon-bg border-t border-watermelon-border flex justify-between items-center">
              <span className="text-xs text-watermelon-muted">
                {order.couponCode && `Cupom ${order.couponCode} aplicado`}
              </span>
              <div className="text-right">
                {Number(order.discount) > 0 && (
                  <div className="text-xs text-watermelon-green">-{formatCurrency(Number(order.discount))}</div>
                )}
                <div className="font-bold text-watermelon-pink">{formatCurrency(Number(order.total))}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
