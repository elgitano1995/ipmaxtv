'use client';

import dynamic from 'next/dynamic';
import { Product, Category } from '@/lib/types';

const ProductForm = dynamic(() => import('@/components/admin/ProductForm'), { ssr: false });

export default function ClientProductWrapper({ initialProducts, categories }: { initialProducts: Product[], categories: Category[] }) {
    return <ProductForm initialProducts={initialProducts} categories={categories} />;
}
