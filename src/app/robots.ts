import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/', '/chat/'],
    },
    sitemap: 'https://swappio.com/sitemap.xml',
  }
}
