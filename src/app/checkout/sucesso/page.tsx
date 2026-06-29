import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CheckCircle } from 'lucide-react'

export default function CheckoutSucessoPage(props: any) {
  const searchParams = props.searchParams as Record<string, string | string[] | undefined> | undefined
  const orderId = searchParams?.orderId ? (Array.isArray(searchParams.orderId) ? searchParams.orderId[0] : searchParams.orderId) : undefined

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center py-20 px-4">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-watermelon-green-light rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-watermelon-green" />
          </div>
          <h1 className="text-3xl font-bold font-display text-watermelon-dark mb-3">Pagamento confirmado! 🎉</h1>
          <p className="text-watermelon-muted mb-2">
            Seu pedido foi recebido e seus arquivos já estão disponíveis para download.
          </p>
          {orderId && (
            <p className="text-sm text-watermelon-muted mb-8">Pedido: <span className="font-mono text-watermelon-dark">#{orderId.slice(-8).toUpperCase()}</span></p>
          )}
          <div className="flex gap-3 justify-center flex-wrap">
            <Link href="/cliente/downloads" className="btn-primary px-6 py-2.5">Ver downloads</Link>
            <Link href="/cliente/pedidos" className="btn-outline px-6 py-2.5">Meus pedidos</Link>
            <Link href="/loja" className="text-sm text-watermelon-pink hover:underline flex items-center mt-2">Continuar comprando</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
