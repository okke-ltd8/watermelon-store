import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Tag, Plus } from 'lucide-react'

export const revalidate = 0

export default async function AdminCuponsPage() {
  const cupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-display text-watermelon-dark">Cupons</h1>
        <button className="btn-primary flex items-center gap-2 px-4 py-2.5 text-sm">
          <Plus size={16} /> Criar cupom
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-watermelon-bg border-b border-watermelon-border">
              <tr>
                {['Código', 'Descrição', 'Desconto', 'Usos', 'Mín. pedido', 'Validade', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-watermelon-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cupons.map((c) => {
                const expired = c.expiresAt && new Date() > c.expiresAt
                const esgotado = c.maxUses && c.usedCount >= c.maxUses
                return (
                  <tr key={c.id} className="border-t border-watermelon-border hover:bg-watermelon-bg transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono font-bold text-watermelon-pink bg-watermelon-pink-light px-2 py-0.5 rounded-lg text-xs">
                        {c.code}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-watermelon-muted max-w-[180px] truncate">{c.description ?? '—'}</td>
                    <td className="px-4 py-3 font-medium text-watermelon-dark">
                      {c.discountType === 'PERCENT'
                        ? `${Number(c.discountValue)}%`
                        : `R$ ${Number(c.discountValue).toFixed(2)}`}
                    </td>
                    <td className="px-4 py-3 text-watermelon-muted">
                      {c.usedCount}/{c.maxUses ?? '∞'}
                    </td>
                    <td className="px-4 py-3 text-watermelon-muted">
                      {c.minOrderValue ? `R$ ${Number(c.minOrderValue).toFixed(2)}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-watermelon-muted text-xs">
                      {c.expiresAt ? formatDate(c.expiresAt) : 'Permanente'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${
                        !c.active || expired || esgotado
                          ? 'bg-gray-100 text-gray-500'
                          : 'bg-watermelon-green-light text-watermelon-green'
                      }`}>
                        {!c.active ? 'Inativo' : expired ? 'Expirado' : esgotado ? 'Esgotado' : 'Ativo'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
