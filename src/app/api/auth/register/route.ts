import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  name: z.string().min(2, 'Nome muito curto'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Senha mínima: 8 caracteres'),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const existing = await prisma.user.findUnique({ where: { email: data.email } })
    if (existing) {
      return NextResponse.json({ error: 'E-mail já cadastrado.' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(data.password, 12)
    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, password: hashed },
      select: { id: true, name: true, email: true },
    })

    return NextResponse.json({ user }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors[0].message }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
