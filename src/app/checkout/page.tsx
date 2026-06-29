 'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useCartStore } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'
import { Lock, CreditCard, QrCode, FileText, Loader2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { items, getTotal, couponCode, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)

  // Evitar navegação durante a renderização inicial — usar efeito no cliente
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/checkout')
    }
  }, [status, router])

  useEffect(() => {
    if (!items.length && status !== 'loading') {
      router.push('/carrinho')
    }
  }, [items.length, status, router])

  const total = getTotal()

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
          couponCode,
        }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error); return }

      clearCart()

      const initPoint = process.env.NODE_ENV === 'development'
        ? data.sandboxInitPoint
        : data.initPoint

      if (initPoint) {
        window.location.href = initPoint
      } else {
        router.push(`/checkout/sucesso?orderId=${data.orderId}`)
      }
    } catch {
      toast.error('Erro ao processar pedido. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-10">
        <div className="page-container max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold font-display text-watermelon-dark mb-8 flex items-center gap-2">
            <Lock size={24} className="text-watermelon-green" />
            Checkout seguro
          </h1>

          {/* Order summary */}
          <div className="card p-6 mb-6">
            <h2 className="font-semibold text-watermelon-dark mb-4">Seu pedido</h2>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="text-watermelon-dark">{item.name} × {item.quantity}</span>
                  <span className="font-medium text-watermelon-dark">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
              <hr className="border-watermelon-border" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-watermelon-pink">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>

          {/* Payment methods info */}
          <div className="card p-6 mb-6">
            <h2 className="font-semibold text-watermelon-dark mb-4">Métodos de pagamento</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <QrCode size={20} />, label: 'PIX', desc: 'Instantâneo' },
                { icon: <CreditCard size={20} />, label: 'Cartão', desc: 'Crédito/débito' },
                { icon: <FileText size={20} />, label: 'Boleto', desc: 'Vence em 3 dias' },
              ].map((m) => (
                <div key={m.label} className="border border-watermelon-border rounded-2xl p-3 text-center">
                  <div className="text-watermelon-green flex justify-center mb-1">{m.icon}</div>
                  <div className="text-sm font-medium text-watermelon-dark">{m.label}</div>
                  <div className="text-xs text-watermelon-muted">{m.desc}</div>
                </div>
              ))}
            </div>
            <p className="text-xs text-watermelon-muted mt-3 text-center">
              🔒 Pagamento processado com segurança pelo Mercado Pago
            </p>
          </div>

          {/* User info */}
          {session?.user && (
            <div className="card p-4 mb-6 text-sm text-watermelon-muted">
              Comprando como <span className="font-medium text-watermelon-dark">{session.user.name}</span> ({session.user.email})
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="btn-secondary w-full py-4 text-base font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <><Loader2 size={18} className="animate-spin" /> Processando...</>
            ) : (
              <><Lock size={18} /> Pagar {formatCurrency(total)}</>
            )}
          </button>

          <p className="text-center text-xs text-watermelon-muted mt-4">
            Ao finalizar, você concorda com nossos{' '}
            <Link href="#" className="text-watermelon-pink hover:underline">Termos de uso</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
