import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Plus, Pencil, Eye } from 'lucide-react'

export const revalidate = 0

export default async function AdminProdutosPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: { select: { name: true } }, _count: { select: { reviews: true, orderItems: true } } },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-display text-watermelon-dark">Produtos</h1>
        <Link href="/admin/produtos/novo" className="btn-primary flex items-center gap-2 px-4 py-2.5 text-sm">
          <Plus size={16} /> Novo produto
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-watermelon-bg border-b border-watermelon-border">
              <tr>
                {['Produto', 'Categoria', 'Preço', 'Vendas', 'Status', 'Criado', 'Ações'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-watermelon-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-watermelon-border hover:bg-watermelon-bg transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-watermelon-dark line-clamp-1 max-w-[200px]">{p.name}</div>
                    {p.badge && <span className="badge-pink text-[10px] mt-0.5">{p.badge}</span>}
                  </td>
                  <td className="px-4 py-3 text-watermelon-muted">{p.category.name}</td>
                  <td className="px-4 py-3 font-medium text-watermelon-pink">{formatCurrency(Number(p.price))}</td>
                  <td className="px-4 py-3 text-watermelon-muted">{p._count.orderItems}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${p.active ? 'bg-watermelon-green-light text-watermelon-green' : 'bg-gray-100 text-gray-500'}`}>
                      {p.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-watermelon-muted text-xs">{formatDate(p.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link href={`/produto/${p.slug}`} className="text-watermelon-muted hover:text-watermelon-pink transition-colors"><Eye size={15} /></Link>
                      <Link href={`/admin/produtos/${p.id}/editar`} className="text-watermelon-muted hover:text-watermelon-pink transition-colors"><Pencil size={15} /></Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
