import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const userId = (session.user as any).id

  const data = await req.json()
  const address = await prisma.address.create({ data: { ...data, userId } })
  return NextResponse.json(address)
}
