'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { ShoppingCart, User, Menu, X, Heart, Search } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/loja', label: 'Loja' },
  { href: '/sobre', label: 'Sobre' },
  { href: '/contato', label: 'Contato' },
]

export function Navbar() {
  const { data: session } = useSession()
  const cartCount = useCartStore((s) => s.getItemCount())
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-watermelon-border">
      <nav className="page-container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-watermelon-pink font-display">
          <div className="relative w-12 h-12 bg-white rounded-full overflow-hidden shadow-sm">
            <Image src="/logoloja.jpeg" alt="Watermelon Art" fill className="object-cover" />
          </div>
          <span className="hidden sm:block">Watermelon</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-full text-sm text-watermelon-muted hover:bg-watermelon-pink-light hover:text-watermelon-pink transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link href="/loja" className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full hover:bg-watermelon-pink-light text-watermelon-muted hover:text-watermelon-pink transition-colors">
            <Search size={18} />
          </Link>
          <Link href="/cliente/favoritos" className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full hover:bg-watermelon-pink-light text-watermelon-muted hover:text-watermelon-pink transition-colors">
            <Heart size={18} />
          </Link>
          <Link href="/carrinho" className="relative flex items-center gap-2 bg-watermelon-pink text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-watermelon-pink-dark transition-colors">
            <ShoppingCart size={16} />
            <span className="hidden sm:block">Carrinho</span>
            {mounted && cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-watermelon-pink border-2 border-watermelon-pink rounded-full text-[10px] font-bold flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {session ? (
            <div className="relative group">
              <button className="flex items-center justify-center w-9 h-9 rounded-full bg-watermelon-pink-light text-watermelon-pink hover:bg-watermelon-pink hover:text-white transition-colors">
                <User size={18} />
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-watermelon-border py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link href="/cliente" className="block px-4 py-2 text-sm text-watermelon-dark hover:bg-watermelon-pink-light hover:text-watermelon-pink transition-colors">Minha conta</Link>
                <Link href="/cliente/pedidos" className="block px-4 py-2 text-sm text-watermelon-dark hover:bg-watermelon-pink-light hover:text-watermelon-pink transition-colors">Meus pedidos</Link>
                <Link href="/cliente/downloads" className="block px-4 py-2 text-sm text-watermelon-dark hover:bg-watermelon-pink-light hover:text-watermelon-pink transition-colors">Downloads</Link>
                {(session.user as any)?.role === 'ADMIN' && (
                  <Link href="/admin" className="block px-4 py-2 text-sm text-watermelon-pink font-medium hover:bg-watermelon-pink-light transition-colors">Painel Admin</Link>
                )}
                <hr className="my-1 border-watermelon-border" />
                <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full text-left px-4 py-2 text-sm text-watermelon-muted hover:text-watermelon-red hover:bg-red-50 transition-colors">
                  Sair
                </button>
              </div>
            </div>
          ) : (
            <Link href="/auth/login" className="hidden sm:block text-sm text-watermelon-muted hover:text-watermelon-pink transition-colors px-3 py-2">
              Entrar
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button className="md:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-watermelon-pink-light text-watermelon-muted" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-watermelon-border px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
              className="px-4 py-2.5 rounded-xl text-sm text-watermelon-dark hover:bg-watermelon-pink-light hover:text-watermelon-pink transition-colors">
              {link.label}
            </Link>
          ))}
          {!session && (
            <Link href="/auth/login" onClick={() => setMenuOpen(false)}
              className="mt-1 px-4 py-2.5 rounded-xl text-sm font-medium text-watermelon-pink bg-watermelon-pink-light">
              Entrar / Cadastrar
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
