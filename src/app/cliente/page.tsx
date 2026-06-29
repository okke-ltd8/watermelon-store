import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'

export const revalidate = 0

export default async function ClientePerfilPage() {
  const session = await getServerSession(authOptions)
  const userId = (session!.user as any).id

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: { select: { orders: true, reviews: true, wishlist: true } },
    },
  })

  if (!user) return null

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-watermelon-dark mb-6">Meu perfil</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Pedidos', value: user._count.orders },
          { label: 'Favoritos', value: user._count.wishlist },
          { label: 'Pontos', value: `${user.points} ⭐` },
        ].map((s) => (
          <div key={s.label} className="card p-5 text-center">
            <div className="text-3xl font-bold text-watermelon-pink font-display">{s.value}</div>
            <div className="text-sm text-watermelon-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-watermelon-dark mb-5">Dados da conta</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-watermelon-muted mb-1.5 uppercase tracking-wider">Nome</label>
              <input defaultValue={user.name} className="input" readOnly />
            </div>
            <div>
              <label className="block text-xs font-medium text-watermelon-muted mb-1.5 uppercase tracking-wider">E-mail</label>
              <input defaultValue={user.email} className="input" readOnly />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-watermelon-muted mb-1.5 uppercase tracking-wider">Membro desde</label>
            <input defaultValue={formatDate(user.createdAt)} className="input" readOnly />
          </div>
          <div>
            <label className="block text-xs font-medium text-watermelon-muted mb-1.5 uppercase tracking-wider">Nova senha</label>
            <input type="password" placeholder="••••••••" className="input" />
          </div>
          <button className="btn-primary px-6 py-2.5 text-sm">Salvar alterações</button>
        </div>
      </div>
    </div>
  )
}
