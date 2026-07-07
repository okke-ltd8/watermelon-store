import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://watermelon.art'

  // Tentar buscar produtos/categorias do banco; se falhar, gerar sitemap mínimo
  let products: { slug: string; updatedAt: Date }[] = []
  let categories: { slug: string }[] = []

  try {
    products = await prisma.product.findMany({
      where: { active: true },
      select: { slug: true, updatedAt: true },
    })

    const visibleCategorySlugs = ['botons', 'photocards', 'marca-paginas', 'chaveiros', 'ilustracoes', 'adesivos']

    categories = await prisma.category.findMany({
      where: { active: true, slug: { in: visibleCategorySlugs } },
      select: { slug: true },
    })
  } catch (err) {
    // Falha ao acessar o banco (build environment ou credenciais). Logamos e geramos sitemap estático.
    // Não interrompemos o build para evitar falha de deploy por erro de DB.
    // eslint-disable-next-line no-console
    console.error('Sitemap: falha ao buscar dados do banco, retornando sitemap estático.', err)
    products = []
    categories = []
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${baseUrl}/loja`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/sobre`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/contato`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${baseUrl}/loja?category=${c.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/produto/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.85,
  }))

  return [...staticPages, ...categoryPages, ...productPages]
}
