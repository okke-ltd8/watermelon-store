import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate, ORDER_STATUS_COLOR, ORDER_STATUS_LABEL } from '@/lib/utils'

export const revalidate = 0

export default async function AdminPedidosPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: { select: { name: true } } } },
      payment: { select: { method: true } },
    },
  })

  const methodLabel: Record<string, string> = {
    PIX: 'PIX', CREDIT_CARD: 'Cartão crédito', DEBIT_CARD: 'Cartão débito', BOLETO: 'Boleto',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-watermelon-dark mb-6">Pedidos</h1>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-watermelon-bg border-b border-watermelon-border">
              <tr>
                {['#', 'Cliente', 'Produtos', 'Total', 'Pagamento', 'Status', 'Data'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-watermelon-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-watermelon-border hover:bg-watermelon-bg transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-watermelon-muted">#{o.id.slice(-6).toUpperCase()}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-watermelon-dark">{o.user.name}</div>
                    <div className="text-xs text-watermelon-muted">{o.user.email}</div>
                  </td>
                  <td className="px-4 py-3 text-watermelon-muted text-xs max-w-[150px]">
                    {o.items.map((i) => i.product.name).join(', ')}
                  </td>
                  <td className="px-4 py-3 font-bold text-watermelon-pink">{formatCurrency(Number(o.total))}</td>
                  <td className="px-4 py-3 text-watermelon-muted">{o.payment ? methodLabel[o.payment.method] ?? o.payment.method : '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${ORDER_STATUS_COLOR[o.status]}`}>{ORDER_STATUS_LABEL[o.status]}</span>
                  </td>
                  <td className="px-4 py-3 text-watermelon-muted text-xs">{formatDate(o.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
