import { MetadataRoute } from 'next';
import { getProducts } from '@/lib/github-api';
import applicationsData from '../../data/applications.json';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ipmaxtv.shop';

    const products = await getProducts();

    const productEntries: MetadataRoute.Sitemap = products.map((product) => ({
        url: `${baseUrl}/product/${encodeURIComponent(product.name.replace(/\s+/g, '_'))}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
    }));

    const applicationEntries: MetadataRoute.Sitemap = applicationsData.map((app) => ({
        url: `${baseUrl}/applications/${encodeURIComponent(app.name.toLowerCase().replace(/\s+/g, '-'))}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/#servers`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        ...productEntries,
        ...applicationEntries,
    ];
}
