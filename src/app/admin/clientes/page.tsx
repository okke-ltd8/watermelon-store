import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Users } from 'lucide-react'

export const revalidate = 0

export default async function AdminClientesPage() {
  const clientes = await prisma.user.findMany({
    where: { role: 'USER' },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { orders: true, reviews: true } },
      orders: { where: { status: { in: ['PAID', 'COMPLETED'] } }, select: { total: true } },
    },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-display text-watermelon-dark">Clientes</h1>
        <div className="flex items-center gap-2 text-sm text-watermelon-muted">
          <Users size={15} /> {clientes.length} cadastrados
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-watermelon-bg border-b border-watermelon-border">
              <tr>
                {['Cliente', 'E-mail', 'Pedidos', 'Total gasto', 'Pontos', 'Desde', 'Status'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-watermelon-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clientes.map((c) => {
                const totalGasto = c.orders.reduce((s, o) => s + Number(o.total), 0)
                return (
                  <tr key={c.id} className="border-t border-watermelon-border hover:bg-watermelon-bg transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-watermelon-pink-light text-watermelon-pink flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-watermelon-dark">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-watermelon-muted">{c.email}</td>
                    <td className="px-4 py-3 text-center text-watermelon-dark font-medium">{c._count.orders}</td>
                    <td className="px-4 py-3 font-medium text-watermelon-pink">
                      {totalGasto.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge bg-yellow-50 text-yellow-700">{c.points} pts</span>
                    </td>
                    <td className="px-4 py-3 text-watermelon-muted text-xs">{formatDate(c.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${c.emailVerified ? 'bg-watermelon-green-light text-watermelon-green' : 'bg-gray-100 text-gray-500'}`}>
                        {c.emailVerified ? 'Verificado' : 'Pendente'}
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
