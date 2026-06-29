'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { useCartStore } from '@/lib/store'
import { formatCurrency } from '@/lib/utils'
import { ShoppingCart, Trash2, Plus, Minus, Tag, ArrowRight, Lock } from 'lucide-react'
import Image from 'next/image'
import toast from 'react-hot-toast'

export default function CarrinhoPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getTotal, couponCode, couponDiscount, applyCoupon, removeCoupon } = useCartStore()
  const [couponInput, setCouponInput] = useState('')
  const [loadingCoupon, setLoadingCoupon] = useState(false)

  const subtotal = getSubtotal()
  const total    = getTotal()

  const handleCoupon = async () => {
    if (!couponInput.trim()) return
    setLoadingCoupon(true)
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput, subtotal }),
      })
      const data = await res.json()
      if (!res.ok) { toast.error(data.error); return }
      applyCoupon(data.code, data.discount)
      toast.success(`Cupom ${data.code} aplicado! ${data.description}`)
    } finally {
      setLoadingCoupon(false)
    }
  }

  if (!items.length) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-8xl mb-6 animate-float">🛒</div>
            <h1 className="text-2xl font-bold font-display text-watermelon-dark mb-3">Seu carrinho está vazio</h1>
            <p className="text-watermelon-muted mb-8">Descubra artes kawaii incríveis na loja!</p>
            <Link href="/loja" className="btn-primary px-8 py-3 inline-flex items-center gap-2">
              Explorar loja <ArrowRight size={16} />
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-10">
        <div className="page-container">
          <h1 className="text-3xl font-bold font-display text-watermelon-dark mb-8">Carrinho</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="card p-4 flex gap-4 items-center">
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden bg-watermelon-pink-light">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-3xl">🍉</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-watermelon-muted mb-0.5">{item.categoryName}</p>
                    <p className="font-medium text-watermelon-dark text-sm leading-snug line-clamp-2">{item.name}</p>
                    <p className="text-watermelon-pink font-bold mt-1">{formatCurrency(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full border border-watermelon-border flex items-center justify-center hover:border-watermelon-pink hover:text-watermelon-pink transition-colors">
                      <Minus size={12} />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full border border-watermelon-border flex items-center justify-center hover:border-watermelon-pink hover:text-watermelon-pink transition-colors">
                      <Plus size={12} />
                    </button>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-watermelon-dark">{formatCurrency(item.price * item.quantity)}</p>
                    <button onClick={() => { removeItem(item.id); toast('Item removido') }} className="text-watermelon-muted hover:text-watermelon-red transition-colors mt-1">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="space-y-4">
              {/* Coupon */}
              <div className="card p-4">
                <p className="text-sm font-semibold text-watermelon-dark mb-3 flex items-center gap-2">
                  <Tag size={15} className="text-watermelon-pink" /> Cupom de desconto
                </p>
                {couponCode ? (
                  <div className="flex items-center justify-between bg-watermelon-green-light rounded-xl px-4 py-3">
                    <span className="text-sm font-medium text-watermelon-green">{couponCode} aplicado!</span>
                    <button onClick={removeCoupon} className="text-xs text-watermelon-muted hover:text-watermelon-red transition-colors">Remover</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="MELANCIA10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === 'Enter' && handleCoupon()}
                      className="input flex-1 text-sm py-2"
                    />
                    <button onClick={handleCoupon} disabled={loadingCoupon} className="btn-primary px-4 py-2 text-sm">
                      {loadingCoupon ? '...' : 'Aplicar'}
                    </button>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="card p-5">
                <h2 className="font-semibold text-watermelon-dark mb-4">Resumo do pedido</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-watermelon-muted">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-watermelon-green">
                      <span>Desconto ({couponCode})</span>
                      <span>-{formatCurrency(couponDiscount)}</span>
                    </div>
                  )}
                  <hr className="border-watermelon-border" />
                  <div className="flex justify-between text-lg font-bold text-watermelon-dark">
                    <span>Total</span>
                    <span className="text-watermelon-pink">{formatCurrency(total)}</span>
                  </div>
                </div>

                <Link href="/checkout" className="btn-secondary w-full mt-5 py-3.5 flex items-center justify-center gap-2 text-base">
                  <Lock size={16} />
                  Finalizar compra
                </Link>

                <div className="flex items-center justify-center gap-3 mt-4 text-xs text-watermelon-muted">
                  <span>🔒 PIX</span>
                  <span>💳 Cartão</span>
                  <span>📄 Boleto</span>
                </div>
              </div>

              <Link href="/loja" className="block text-center text-sm text-watermelon-pink hover:underline">
                ← Continuar comprando
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
