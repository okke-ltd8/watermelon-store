'use client'

import { signIn } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const [callbackUrl, setCallbackUrl] = useState('/')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setCallbackUrl(params.get('callbackUrl') ?? '/')
  }, [])

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = await signIn('credentials', { ...form, redirect: false })
    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    } else {
      router.push(callbackUrl)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4 bg-watermelon-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="w-12 h-12 bg-watermelon-pink rounded-full flex items-center justify-center text-white text-2xl">W</span>
          </Link>
          <h1 className="text-3xl font-bold font-display text-watermelon-dark">Entrar na conta</h1>
          <p className="text-watermelon-muted mt-1 text-sm">Bem-vinda de volta! 🍉</p>
        </div>

        <div className="card p-8">
          <button
            onClick={() => signIn('google', { callbackUrl })}
            className="w-full flex items-center justify-center gap-3 border border-watermelon-border rounded-xl py-3 text-sm font-medium text-watermelon-dark hover:bg-watermelon-bg transition-colors mb-5"
          >
            <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>
            Entrar com Google
          </button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-watermelon-border" /></div>
            <div className="relative flex justify-center text-xs text-watermelon-muted bg-white px-3">ou com e-mail</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-watermelon-dark mb-1.5">E-mail</label>
              <input type="email" className="input" placeholder="seu@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-watermelon-dark mb-1.5">Senha</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} className="input pr-10" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-watermelon-muted">
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <Link href="/auth/recuperar" className="text-xs text-watermelon-pink hover:underline mt-1 block text-right">Esqueceu a senha?</Link>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Entrando...</> : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-watermelon-muted mt-6">
          Não tem conta?{' '}
          <Link href="/auth/registro" className="text-watermelon-pink font-medium hover:underline">Cadastre-se</Link>
        </p>
      </div>
    </main>
  )
}
