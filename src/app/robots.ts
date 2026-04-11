import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tv4watch.com';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/ta7akom/',
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
