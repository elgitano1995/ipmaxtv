'use server';

import fs from 'fs';
import path from 'path';

export interface SearchResult {
    products: any[];
    applications: any[];
}

export async function searchGlobal(query: string): Promise<SearchResult> {
    const q = query.toLowerCase().trim();
    if (!q) {
        return { products: [], applications: [] };
    }

    // 1. Load Products Data
    let products = [];
    try {
        const prodPath = path.join(process.cwd(), 'data', 'products.json');
        products = JSON.parse(fs.readFileSync(prodPath, 'utf-8'));
    } catch (e) {
        console.error("Error reading products for search:", e);
    }

    // 2. Load Applications Data
    let applications = [];
    try {
        const appPath = path.join(process.cwd(), 'data', 'applications.json');
        applications = JSON.parse(fs.readFileSync(appPath, 'utf-8'));
    } catch (e) {
        console.error("Error reading applications for search:", e);
    }

    // 3. Filter Products
    // Searches by name, description, categoryId, or tags/keywords
    const filteredProducts = products.filter((p: any) => {
        const keywordsMatch = p.keywords && Array.isArray(p.keywords) && p.keywords.some((kw: string) => kw.toLowerCase().includes(q));
        const featuresMatch = p.features && Array.isArray(p.features) && p.features.some((f: string) => f.toLowerCase().includes(q));

        return p.name.toLowerCase().includes(q) ||
            (p.description && p.description.toLowerCase().includes(q)) ||
            (p.categoryId && p.categoryId.toLowerCase().includes(q)) ||
            keywordsMatch ||
            featuresMatch;
    });

    // 4. Filter Applications
    // Searches by app name or exact numeric code
    const filteredApps = applications.filter((app: any) => {
        return app.name.toLowerCase().includes(q) || app.code.includes(q);
    });

    const sortedProducts = filteredProducts.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

    return {
        products: sortedProducts.slice(0, 10), // Limit results for dropdown performance
        applications: filteredApps.slice(0, 10)
    };
}
