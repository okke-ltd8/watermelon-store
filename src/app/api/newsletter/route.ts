import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  const parsed = z.string().email().safeParse(email)
  if (!parsed.success) return NextResponse.json({ error: 'E-mail inválido.' }, { status: 400 })

  await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data },
    update: { active: true },
    create: { email: parsed.data },
  })

  return NextResponse.json({ ok: true })
}
