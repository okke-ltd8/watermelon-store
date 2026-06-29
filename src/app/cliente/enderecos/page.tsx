import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { AddressForm } from '@/components/cliente/AddressForm'
import { MapPin } from 'lucide-react'

export const revalidate = 0

export default async function ClienteEnderecosPage() {
  const session = await getServerSession(authOptions)
  if (!session) return notFound()
  const userId = (session.user as any).id

  const addresses = await prisma.address.findMany({ where: { userId }, orderBy: { isDefault: 'desc' } })

  return (
    <div>
      <h1 className="text-2xl font-bold font-display text-watermelon-dark mb-6">Meus endereços</h1>

      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <MapPin size={48} className="mx-auto mb-4 text-watermelon-border" />
          <h2 className="text-xl font-semibold mb-2">Nenhum endereço cadastrado</h2>
          <p className="text-watermelon-muted mb-6">Adicione um endereço para usar no checkout.</p>
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {addresses.map((a) => (
            <div key={a.id} className="card px-5 py-4 flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-watermelon-dark">{a.label} {a.isDefault && <span className="text-xs text-watermelon-green ml-2">Padrão</span>}</div>
                <div className="text-sm text-watermelon-muted">{a.street}, {a.number}{a.complement ? ` • ${a.complement}` : ''}</div>
                <div className="text-sm text-watermelon-muted">{a.district} — {a.city}/{a.state} • {a.zipCode}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="card p-5">
        <h2 className="text-lg font-semibold mb-3">Adicionar endereço</h2>
        <AddressForm />
      </div>
    </div>
  )
}
