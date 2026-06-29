import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'

export const revalidate = 0

export default async function AdminRelatoriosPage() {
  const now = new Date()

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    return { year: d.getFullYear(), month: d.getMonth(), label: d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }) }
  }).reverse()

  const revenueByMonth = await Promise.all(
    months.map(async (m) => {
      const start = new Date(m.year, m.month, 1)
      const end   = new Date(m.year, m.month + 1, 0, 23, 59, 59)
      const agg = await prisma.order.aggregate({
        where: { status: { in: ['PAID', 'COMPLETED'] }, createdAt: { gte: start, lte: end } },
        _sum: { total: true },
        _count: true,
      })
      return { label: m.label, revenue: Number(agg._sum.total ?? 0), orders: agg._count }
    })
  )

  const [categoryRevenue, paymentMethods, topCustomers] = await Promise.all([
    prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: { price: true },
      _count: true,
      orderBy: { _sum: { price: 'desc' } },
      take: 10,
    }),
    prisma.payment.groupBy({
      by: ['method'],
      _count: true,
      _sum: { amount: true },
      where: { status: 'APPROVED' },
    }),
    prisma.order.groupBy({
      by: ['userId'],
      _sum: { total: true },
      _count: true,
      where: { status: { in: ['PAID', 'COMPLETED'] } },
      orderBy: { _sum: { total: 'desc' } },
      take: 5,
    }),
  ])

  const maxRevenue = Math.max(...revenueByMonth.map((m) => m.revenue), 1)

  const methodLabel: Record<string, string> = {
    PIX: 'PIX', CREDIT_CARD: 'Cartão de crédito', DEBIT_CARD: 'Cartão de débito', BOLETO: 'Boleto',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-watermelon-dark mb-6">Relatórios</h1>

      {/* Revenue chart */}
      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-watermelon-dark mb-5">Receita dos últimos 6 meses</h2>
        <div className="flex items-end gap-3 h-40">
          {revenueByMonth.map((m) => (
            <div key={m.label} className="flex-1 flex flex-col items-center gap-1.5">
              <span className="text-xs text-watermelon-pink font-medium">{formatCurrency(m.revenue)}</span>
              <div
                className="w-full bg-watermelon-pink rounded-t-lg transition-all hover:bg-watermelon-pink-dark"
                style={{ height: `${Math.max(4, (m.revenue / maxRevenue) * 120)}px` }}
              />
              <span className="text-[10px] text-watermelon-muted">{m.label}</span>
              <span className="text-[10px] text-watermelon-muted">{m.orders} pedidos</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment methods */}
        <div className="card p-5">
          <h2 className="font-semibold text-watermelon-dark mb-4">Métodos de pagamento</h2>
          <div className="space-y-3">
            {paymentMethods.map((pm) => {
              const totalAll = paymentMethods.reduce((s, x) => s + x._count, 0)
              const pct = Math.round((pm._count / totalAll) * 100)
              return (
                <div key={pm.method}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-watermelon-dark">{methodLabel[pm.method] ?? pm.method}</span>
                    <span className="text-watermelon-muted">{pm._count} pagamentos ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-watermelon-border rounded-full overflow-hidden">
                    <div className="h-full bg-watermelon-pink rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
            {paymentMethods.length === 0 && <p className="text-sm text-watermelon-muted">Nenhum pagamento ainda.</p>}
          </div>
        </div>

        {/* Newsletter */}
        <div className="card p-5">
          <h2 className="font-semibold text-watermelon-dark mb-4">Resumo geral</h2>
          <div className="space-y-3">
            {[
              { label: 'Total de receita', value: formatCurrency(revenueByMonth.reduce((s, m) => s + m.revenue, 0)) },
              { label: 'Total de pedidos', value: revenueByMonth.reduce((s, m) => s + m.orders, 0) },
              { label: 'Ticket médio', value: (() => { const t = revenueByMonth.reduce((s, m) => s + m.revenue, 0); const c = revenueByMonth.reduce((s, m) => s + m.orders, 0); return c > 0 ? formatCurrency(t / c) : '—' })() },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center py-2 border-b border-watermelon-border last:border-0">
                <span className="text-sm text-watermelon-muted">{item.label}</span>
                <span className="font-bold text-watermelon-pink">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
