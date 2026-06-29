import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

  const [
    totalRevenue,
    monthRevenue,
    lastMonthRevenue,
    totalOrders,
    monthOrders,
    totalCustomers,
    pendingOrders,
    topProducts,
    recentOrders,
    reviewsCount,
    avgRating,
  ] = await Promise.all([
    prisma.order.aggregate({ where: { status: 'PAID' }, _sum: { total: true } }),
    prisma.order.aggregate({ where: { status: 'PAID', createdAt: { gte: startOfMonth } }, _sum: { total: true } }),
    prisma.order.aggregate({ where: { status: 'PAID', createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } }, _sum: { total: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.order.count({ where: { status: { in: ['PENDING', 'WAITING_PAYMENT', 'PROCESSING'] } } }),
    prisma.product.findMany({ orderBy: { soldCount: 'desc' }, take: 5, select: { name: true, soldCount: true, price: true, images: true } }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } }, items: { include: { product: { select: { name: true } } } } },
    }),
    prisma.review.count({ where: { approved: true } }),
    prisma.review.aggregate({ where: { approved: true }, _avg: { rating: true } }),
  ])

  const monthRev = Number(monthRevenue._sum.total ?? 0)
  const lastRev  = Number(lastMonthRevenue._sum.total ?? 0)
  const revenueGrowth = lastRev > 0 ? ((monthRev - lastRev) / lastRev) * 100 : 0

  return NextResponse.json({
    revenue: {
      total: Number(totalRevenue._sum.total ?? 0),
      month: monthRev,
      growth: revenueGrowth.toFixed(1),
    },
    orders: { total: totalOrders, month: monthOrders, pending: pendingOrders },
    customers: totalCustomers,
    rating: { avg: Number(avgRating._avg.rating ?? 0).toFixed(1), count: reviewsCount },
    topProducts,
    recentOrders,
  })
}
