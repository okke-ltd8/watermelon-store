'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LayoutDashboard, Package, ShoppingBag, Users, Tag, Star, Image as ImageIcon, BarChart2, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={17} /> },
  { href: '/admin/produtos', label: 'Produtos', icon: <Package size={17} /> },
  { href: '/admin/pedidos', label: 'Pedidos', icon: <ShoppingBag size={17} /> },
  { href: '/admin/clientes', label: 'Clientes', icon: <Users size={17} /> },
  { href: '/admin/cupons', label: 'Cupons', icon: <Tag size={17} /> },
  { href: '/admin/avaliacoes', label: 'Avaliações', icon: <Star size={17} /> },
  { href: '/admin/banners', label: 'Banners', icon: <ImageIcon size={17} /> },
  { href: '/admin/relatorios', label: 'Relatórios', icon: <BarChart2 size={17} /> },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 bg-watermelon-dark flex flex-col min-h-screen flex-shrink-0">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 bg-watermelon-pink rounded-full flex items-center justify-center text-white font-bold text-sm">W</span>
          <div>
            <div className="text-white text-sm font-semibold">Watermelon</div>
            <div className="text-white/40 text-[10px]">Painel admin</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors',
              pathname === link.href
                ? 'bg-watermelon-pink text-white'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
            )}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-white/50 text-sm hover:text-white hover:bg-white/10 transition-colors mb-1">
          ← Ver site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/50 text-sm hover:text-watermelon-red hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={17} /> Sair
        </button>
      </div>
    </aside>
  )
}
