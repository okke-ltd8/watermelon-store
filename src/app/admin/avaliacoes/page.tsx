import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Star } from 'lucide-react'

export const revalidate = 0

export default async function AdminAvaliacoesPage() {
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { name: true, slug: true } },
    },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-watermelon-dark mb-6">Avaliações</h1>

      <div className="space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="card p-5 flex gap-4 items-start">
            <div className="w-10 h-10 rounded-full bg-watermelon-pink-light text-watermelon-pink flex items-center justify-center font-bold flex-shrink-0">
              {r.user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <span className="font-medium text-watermelon-dark text-sm">{r.user.name}</span>
                  <span className="text-watermelon-muted text-xs ml-2">em</span>
                  <span className="text-watermelon-pink text-xs ml-1">{r.product.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} className={i < r.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 fill-gray-200'} />
                  ))}
                  <span className="text-xs text-watermelon-muted ml-1">{formatDate(r.createdAt)}</span>
                </div>
              </div>
              {r.comment && <p className="text-sm text-watermelon-muted mt-1.5 leading-relaxed">{r.comment}</p>}
            </div>
            <div className="flex-shrink-0">
              <span className={`badge ${r.approved ? 'bg-watermelon-green-light text-watermelon-green' : 'bg-yellow-50 text-yellow-700'}`}>
                {r.approved ? 'Aprovado' : 'Pendente'}
              </span>
            </div>
          </div>
        ))}
        {reviews.length === 0 && (
          <div className="text-center py-16 text-watermelon-muted">
            <Star size={40} className="mx-auto mb-3 opacity-30" />
            <p>Nenhuma avaliação ainda.</p>
          </div>
        )}
      </div>
    </div>
  )
}
