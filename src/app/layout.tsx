import type { Metadata, Viewport } from 'next'
import { Inter, Nunito } from 'next/font/google'
import { Providers } from '@/components/layout/Providers'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito' })

export const metadata: Metadata = {
  title: { default: 'Watermelon Art 🍉', template: '%s | Watermelon Art' },
  description: 'Arte kawaii digital feita com amor. Botons, photocards, marca páginas, chaveiros, ilustrações e adesivos.',
  keywords: ['botons', 'photocards', 'marca páginas', 'chaveiros', 'arte digital', 'ilustração', 'adesivos', 'watermelon art'],
  authors: [{ name: 'Watermelon Art' }],
  creator: 'Watermelon Art',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Watermelon Art',
    title: 'Watermelon Art 🍉 — Arte kawaii digital',
    description: 'Botons, photocards, marca páginas, chaveiros, ilustrações e adesivos feitos com amor.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', title: 'Watermelon Art', description: 'Arte kawaii digital feita com amor.' },
  manifest: '/manifest.json',
  icons: { icon: '/favicon.ico', apple: '/apple-icon.png' },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#FF4F87',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${nunito.variable}`}>
      <body className="bg-watermelon-bg text-watermelon-dark antialiased">
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: { borderRadius: '12px', fontFamily: 'var(--font-inter)', fontSize: '14px' },
              success: { iconTheme: { primary: '#48C774', secondary: '#fff' } },
              error: { iconTheme: { primary: '#FF4F87', secondary: '#fff' } },
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
