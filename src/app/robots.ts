import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://watermelon.art'
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/', '/cliente/', '/auth/', '/checkout/'] },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
