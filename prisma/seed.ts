import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@watermelon.art' },
    update: {},
    create: {
      name: 'Watermelon Admin',
      email: 'admin@watermelon.art',
      password: adminPassword,
      role: 'ADMIN',
    },
  })
  console.log('Admin criado:', admin.email)

  const categories = [
    { name: 'Botons', slug: 'botons', icon: '/fotospng/botons.svg', description: 'Botons divertidos e personalizados' },
    { name: 'Photocards', slug: 'photocards', icon: '/fotospng/photocards.svg', description: 'Photocards colecionáveis' },
    { name: 'Marca Paginas', slug: 'marca-paginas', icon: '/fotospng/marca-paginas.svg', description: 'Marca páginas criativos' },
    { name: 'Chaveiros', slug: 'chaveiros', icon: '/fotospng/chaveiros.svg', description: 'Chaveiros fofos e estilosos' },
    { name: 'Ilustrações', slug: 'ilustracoes', icon: '/fotospng/ilustracoes.svg', description: 'Ilustrações digitais' },
    { name: 'Adesivos', slug: 'adesivos', icon: '/fotospng/adesivos.svg', description: 'Adesivos digitais' },
  ]

  const desiredCategorySlugs = categories.map((c) => c.slug)
  const legacyCategorySlugs = ['avatares', 'png-tubers', 'logos', 'banners', 'chibis', 'packs', 'comissoes', 'emotes']

  for (const [i, cat] of categories.entries()) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { active: true, sortOrder: i, name: cat.name, icon: cat.icon, description: cat.description },
      create: { ...cat, sortOrder: i, active: true },
    })
  }

  await prisma.category.updateMany({
    where: { slug: { notIn: desiredCategorySlugs } },
    data: { active: false },
  })

  const deletedLegacy = await prisma.category.deleteMany({
    where: { slug: { in: legacyCategorySlugs } },
  })

  console.log('Categorias criadas ou atualizadas:', categories.length)
  console.log('Categorias antigas removidas:', deletedLegacy.count)

  const adeCategory    = await prisma.category.findUnique({ where: { slug: 'adesivos' } })
  const ilustCategory  = await prisma.category.findUnique({ where: { slug: 'ilustracoes' } })

  const products = [
    {
      name: 'Pack de adesivos fofos x12',
      slug: 'pack-adesivos-fofos-x12',
      description: 'Pack com 12 adesivos fofos para Telegram, Discord e redes sociais. PNG transparente em alta resolução.',
      price: 35.00,
      categoryId: adeCategory!.id,
      images: ['/products/stickers.png'],
    },
    {
      name: 'Ilustração digital completa',
      slug: 'ilustracao-digital-completa',
      description: 'Ilustração digital completa com fundo detalhado. Personagens originais ou fanart. Arte de alta qualidade em até 7 dias úteis. 3 revisões inclusas.',
      price: 150.00,
      badge: 'Destaque',
      categoryId: ilustCategory!.id,
      images: ['/products/ilustracao.png'],
    },
  ]

  for (const product of products) {
    const productCreateData = {
      ...product,
      digital: true,
      active: true,
      stock: -1,
      images: Array.isArray(product.images) ? JSON.stringify(product.images) : product.images,
    }

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: productCreateData,
    })
  }
  console.log('Produtos criados:', products.length)

  const coupons = [
    { code: 'MELANCIA10', description: '10% de desconto em qualquer produto', discountType: 'PERCENT', discountValue: 10, maxUses: 100, active: true },
    { code: 'ESTREIA20', description: '20% de desconto para novos clientes', discountType: 'PERCENT', discountValue: 20, maxUses: 50, active: true },
    { code: 'FRETE0', description: 'Frete grátis (produtos físicos)', discountType: 'FIXED', discountValue: 0, active: true },
  ]

  for (const coupon of coupons) {
    await prisma.coupon.upsert({
      where: { code: coupon.code },
      update: {},
      create: { ...coupon },
    })
  }
  console.log('Cupons criados:', coupons.length)

  await prisma.banner.upsert({
    where: { id: 'main-banner' },
    update: {},
    create: {
      id: 'main-banner',
      title: 'Arte kawaii feita com amor',
      subtitle: 'Ilustrações e adesivos digitais. Personalize seu espaço com arte encantadora.',
      linkUrl: '/loja',
      linkText: 'Ver loja',
      active: true,
      sortOrder: 0,
    },
  })

  console.log('Seed concluído!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
