import Link from 'next/link'
import { Instagram, MessageCircle, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-watermelon-dark text-white mt-auto">
      <div className="page-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-10 h-10 bg-watermelon-pink rounded-full flex items-center justify-center font-bold text-xl">W</span>
              <span className="text-xl font-bold font-display">Watermelon Art</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              Arte kawaii digital feita com amor. Botons, photocards, marca páginas e chaveiros criativos para seu espaço digital.
            </p>
            <div className="flex gap-3 mt-5">
              <a href="https://www.instagram.com/lojinha.watermelon.ens/" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-watermelon-pink transition-colors">
                <Instagram size={16} />
              </a>
              <a href="https://wa.me/5582987454073?text=Ol%C3%A1%2C%20gostaria%20de%20saber%20mais%20sobre%20seus%20trabalhos" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-watermelon-pink transition-colors">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4 text-white/80 uppercase tracking-wider">Loja</h3>
            <ul className="space-y-2.5 text-sm text-white/50">
              {['Botons', 'Photocards', 'Marca Paginas', 'Chaveiros', 'Ilustrações', 'Adesivos'].map((item) => (
                <li key={item}>
                  <Link href={`/loja?category=${item.toLowerCase().replace(/ /g, '-')}`} className="hover:text-watermelon-pink transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4 text-white/80 uppercase tracking-wider">Suporte</h3>
            <ul className="space-y-2.5 text-sm text-white/50">
              <li><Link href="/sobre" className="hover:text-watermelon-pink transition-colors">Sobre a artista</Link></li>
              <li><Link href="/contato" className="hover:text-watermelon-pink transition-colors">Contato</Link></li>
              <li><Link href="/cliente/pedidos" className="hover:text-watermelon-pink transition-colors">Meus pedidos</Link></li>
              <li><Link href="/cliente/downloads" className="hover:text-watermelon-pink transition-colors">Downloads</Link></li>
              <li><a href="#" className="hover:text-watermelon-pink transition-colors">Política de privacidade</a></li>
              <li><a href="#" className="hover:text-watermelon-pink transition-colors">Termos de uso</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <div className="flex items-center gap-2">
            <span className="seed" />
            <span className="seed" />
            <span className="seed" />
            <span>Watermelon Art © 2025 — Feito com muito amor</span>
          </div>
          <div className="flex items-center gap-4">
            <span>🔒 Pagamento seguro</span>
            <span>📦 Entrega digital</span>
            <span>⭐ 4.9/5.0</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
