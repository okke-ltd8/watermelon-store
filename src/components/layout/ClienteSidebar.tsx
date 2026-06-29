'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User, ShoppingBag, Heart, Download, MapPin, Star } from 'lucide-react'
import { cn, getInitials } from '@/lib/utils'

const links = [
  { href: '/cliente', label: 'Meu perfil', icon: <User size={16} /> },
  { href: '/cliente/pedidos', label: 'Meus pedidos', icon: <ShoppingBag size={16} /> },
  { href: '/cliente/favoritos', label: 'Favoritos', icon: <Heart size={16} /> },
  { href: '/cliente/downloads', label: 'Downloads', icon: <Download size={16} /> },
  { href: '/cliente/enderecos', label: 'Endereços', icon: <MapPin size={16} /> },
  { href: '/cliente/avaliacoes', label: 'Avaliações', icon: <Star size={16} /> },
]

export function ClienteSidebar({ user }: { user: { name?: string | null; email?: string | null; points?: number } }) {
  const pathname = usePathname()

  return (
    <aside className="w-full md:w-56 flex-shrink-0">
      {/* Profile card */}
      <div className="card p-5 mb-3 text-center">
        <div className="w-16 h-16 bg-watermelon-pink rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
          {getInitials(user.name ?? 'U')}
        </div>
        <div className="font-semibold text-watermelon-dark text-sm">{user.name}</div>
        <div className="text-xs text-watermelon-muted mt-0.5 truncate">{user.email}</div>
        <div className="mt-3 inline-flex items-center gap-1.5 bg-yellow-50 text-yellow-700 rounded-full px-3 py-1 text-xs font-medium">
          ⭐ {user.points ?? 0} pontos
        </div>
      </div>

      {/* Nav */}
      <nav className="card overflow-hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-3 px-4 py-3 text-sm border-b border-watermelon-border last:border-0 transition-colors',
              pathname === link.href
                ? 'bg-watermelon-pink-light text-watermelon-pink font-medium'
                : 'text-watermelon-muted hover:bg-watermelon-bg hover:text-watermelon-dark'
            )}
          >
            {link.icon} {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
