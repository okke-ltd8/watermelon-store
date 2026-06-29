import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token    = req.nextauth.token
    const pathname = req.nextUrl.pathname

    if (pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname
        if (pathname.startsWith('/cliente') || pathname.startsWith('/admin') || pathname.startsWith('/checkout')) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/cliente/:path*', '/admin/:path*', '/checkout/:path*'],
}
