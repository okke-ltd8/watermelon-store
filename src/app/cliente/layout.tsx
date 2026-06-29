import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ClienteSidebar } from '@/components/layout/ClienteSidebar'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default async function ClienteLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/auth/login?callbackUrl=/cliente')

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-64px)] page-container py-8">
        <div className="flex gap-6 flex-col md:flex-row">
          <ClienteSidebar user={session.user as any} />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
      <Footer />
    </>
  )
}
