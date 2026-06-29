'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Send, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContatoPage() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: 'Comissão personalizada', message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1000))
    toast.success('Mensagem enviada! Responderei em breve. 💌')
    setForm({ name: '', email: '', subject: 'Comissão personalizada', message: '' })
    setLoading(false)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen py-10">
        <div className="page-container max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold font-display text-watermelon-pink mb-2">Fale comigo 💬</h1>
            <p className="text-watermelon-muted">Fico feliz em responder dúvidas, comissões e parcerias!</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contacts */}
            <div className="lg:col-span-2 space-y-4">
              {[
                { icon: <Image src="/fotospng/instagram.svg" alt="Instagram" width={24} height={24} />, label: 'Instagram', value: '@lojinha.watermelon.ens', href: 'https://www.instagram.com/lojinha.watermelon.ens/', color: 'bg-pink-50 text-pink-500' },
                { icon: <Image src="/fotospng/whatsapp.svg" alt="WhatsApp" width={24} height={24} />, label: 'WhatsApp', value: 'watermelon.ens', href: 'https://wa.me/5582987454073?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20seus%20trabalhos', color: 'bg-emerald-50 text-emerald-500' },
                { icon: <Image src="/fotospng/contato.svg" alt="Contato" width={24} height={24} />, label: 'Contato', value: 'Entre em contato', href: 'https://wa.me/5582987454073?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20seus%20trabalhos', color: 'bg-indigo-50 text-indigo-500' },
              ].map((c) => (
                <a key={c.label} href={c.href} className="card p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${c.color}`}>{c.icon}</div>
                  <div>
                    <div className="text-xs text-watermelon-muted">{c.label}</div>
                    <div className="text-sm font-medium text-watermelon-dark">{c.value}</div>
                  </div>
                </a>
              ))}

              <div className="card p-5 bg-watermelon-pink-light border-watermelon-pink/20">
                <p className="text-sm font-medium text-watermelon-pink mb-1">⏱ Tempo de resposta</p>
                <p className="text-sm text-watermelon-muted">Respondo em até 24h nos dias úteis.</p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="card p-6">
                <h2 className="font-semibold text-watermelon-dark mb-5 text-lg">Enviar mensagem</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-watermelon-dark mb-1.5">Seu nome</label>
                      <input className="input" placeholder="Como posso te chamar?" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-watermelon-dark mb-1.5">E-mail</label>
                      <input type="email" className="input" placeholder="seu@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-watermelon-dark mb-1.5">Assunto</label>
                    <select className="input" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>
                      <option>Comissão personalizada</option>
                      <option>Dúvida sobre pedido</option>
                      <option>Parceria ou colaboração</option>
                      <option>Suporte técnico</option>
                      <option>Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-watermelon-dark mb-1.5">Mensagem</label>
                    <textarea className="input resize-none" rows={5} placeholder="Conte o que você precisa, com o máximo de detalhes..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2">
                    {loading ? <><Loader2 size={16} className="animate-spin" /> Enviando...</> : <><Send size={16} /> Enviar mensagem</>}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
