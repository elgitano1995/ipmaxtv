export interface ProductVariant {
    id: string;
    duration: string; // e.g., "1 Mois", "3 Mois", "6 Mois", "12 Mois"
    price: string;    // e.g., "10€", "25€"
}

export interface Product {
    id: string;
    name: string;
    categoryId: string;
    imageUrl: string;
    description: string;
    isBestSeller?: boolean;
    isStable?: boolean;
    features: string[];
    variants: ProductVariant[];
    keywords?: string[];
    metaTitle?: string;
    metaDescription?: string;
    order?: number;
}

export interface Category {
    id: string;
    name: string;
    isVisible: boolean;
    showInHeader?: boolean;
    order: number;
}

export interface Review {
    id: string;
    authorName: string;
    rating: number; // 1-5
    comment: string;
    date: string;
}

export interface Article {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    coverImage: string;
    date: string;
    author: string;
    keywords?: string[];
}
