import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate, ORDER_STATUS_COLOR, ORDER_STATUS_LABEL } from '@/lib/utils'
import { TrendingUp, ShoppingBag, Users, Star } from 'lucide-react'

export const revalidate = 0

export default async function AdminDashboardPage() {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [totalRevenue, monthRevenue, totalOrders, totalCustomers, recentOrders, topProducts, reviewStats] = await Promise.all([
    prisma.order.aggregate({ where: { status: { in: ['PAID', 'COMPLETED'] } }, _sum: { total: true } }),
    prisma.order.aggregate({ where: { status: { in: ['PAID', 'COMPLETED'] }, createdAt: { gte: startOfMonth } }, _sum: { total: true } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.order.findMany({
      take: 8, orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } }, items: { take: 1, include: { product: { select: { name: true } } } } },
    }),
    prisma.product.findMany({ orderBy: { soldCount: 'desc' }, take: 5, select: { name: true, soldCount: true, price: true } }),
    prisma.review.aggregate({ where: { approved: true }, _avg: { rating: true }, _count: true }),
  ])

  const stats = [
    { label: 'Receita total', value: formatCurrency(Number(totalRevenue._sum.total ?? 0)), sub: `${formatCurrency(Number(monthRevenue._sum.total ?? 0))} este mês`, icon: <TrendingUp size={20} />, color: 'bg-watermelon-pink-light text-watermelon-pink' },
    { label: 'Pedidos', value: totalOrders, sub: 'total de pedidos', icon: <ShoppingBag size={20} />, color: 'bg-watermelon-green-light text-watermelon-green' },
    { label: 'Clientes', value: totalCustomers, sub: 'cadastrados', icon: <Users size={20} />, color: 'bg-blue-50 text-blue-500' },
    { label: 'Avaliação média', value: `${Number(reviewStats._avg.rating ?? 0).toFixed(1)} ⭐`, sub: `${reviewStats._count} avaliações`, icon: <Star size={20} />, color: 'bg-yellow-50 text-yellow-500' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-watermelon-dark mb-6">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>{s.icon}</div>
            <div className="text-2xl font-bold text-watermelon-dark">{s.value}</div>
            <div className="text-xs text-watermelon-muted mt-1">{s.label}</div>
            <div className="text-xs text-watermelon-green mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent orders */}
        <div className="lg:col-span-2 card overflow-hidden">
          <div className="px-5 py-4 border-b border-watermelon-border font-semibold text-watermelon-dark">Pedidos recentes</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-watermelon-bg">
                <tr>
                  {['Pedido', 'Cliente', 'Produto', 'Valor', 'Status'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-watermelon-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-t border-watermelon-border hover:bg-watermelon-bg transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-watermelon-muted">#{order.id.slice(-6).toUpperCase()}</td>
                    <td className="px-4 py-3 font-medium text-watermelon-dark">{order.user.name}</td>
                    <td className="px-4 py-3 text-watermelon-muted max-w-[140px] truncate">{order.items[0]?.product.name ?? '—'}</td>
                    <td className="px-4 py-3 font-medium text-watermelon-dark">{formatCurrency(Number(order.total))}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${ORDER_STATUS_COLOR[order.status]}`}>{ORDER_STATUS_LABEL[order.status]}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top products */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-watermelon-border font-semibold text-watermelon-dark">Mais vendidos</div>
          <div className="p-4 space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-watermelon-pink-light text-watermelon-pink text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-watermelon-dark truncate">{p.name}</p>
                  <p className="text-xs text-watermelon-muted">{p.soldCount} vendas</p>
                </div>
                <span className="text-sm font-medium text-watermelon-pink">{formatCurrency(Number(p.price))}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
