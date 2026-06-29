import Image from 'next/image'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Download, Lock } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 0

export default async function ClienteDownloadsPage() {
  const session = await getServerSession(authOptions)
  const userId = (session!.user as any).id

  const purchases = await prisma.orderItem.findMany({
    where: {
      order: { userId, status: { in: ['PAID', 'COMPLETED'] } },
      product: { digital: true },
    },
    distinct: ['productId'],
    include: {
      product: { select: { id: true, name: true, images: true, slug: true, category: { select: { name: true } } } },
      order: { select: { id: true, createdAt: true } },
    },
    orderBy: { order: { createdAt: 'desc' } },
  })

  if (!purchases.length) {
    return (
      <div className="text-center py-16">
        <Lock size={48} className="mx-auto mb-4 text-watermelon-border" />
        <h2 className="text-xl font-bold font-display text-watermelon-dark mb-2">Nenhum download disponível</h2>
        <p className="text-watermelon-muted mb-6">Compre produtos digitais para acessá-los aqui.</p>
        <Link href="/loja" className="btn-primary px-8 py-3">Ver produtos digitais</Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-watermelon-dark mb-6">Downloads</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {purchases.map((item) => {
          const images = typeof item.product.images === 'string' ? JSON.parse(item.product.images) : item.product.images
          return (
            <div key={item.productId} className="card p-4 flex gap-4 items-center">
              <div className="w-16 h-16 rounded-2xl bg-watermelon-pink-light flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden">
                {images[0] ? (
                  <Image src={images[0]} alt={item.product.name} width={64} height={64} className="w-full h-full object-cover" unoptimized />
                ) : '🍉'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-watermelon-muted mb-0.5">{item.product.category?.name}</p>
                <p className="text-sm font-medium text-watermelon-dark line-clamp-1">{item.product.name}</p>
                <p className="text-xs text-watermelon-muted mt-0.5">
                  Comprado em {formatDate(item.order.createdAt)}
                </p>
              </div>
              <a
                href={`/api/user/downloads/${item.product.id}`}
                className="flex-shrink-0 flex items-center gap-1.5 bg-watermelon-green text-white rounded-full px-3 py-1.5 text-xs font-medium hover:bg-watermelon-green-dark transition-colors"
              >
                <Download size={13} /> Baixar
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}
