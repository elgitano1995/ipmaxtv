'use client';

import dynamic from 'next/dynamic';
import { Category } from '@/lib/types';

const CategoryManager = dynamic(() => import('@/components/admin/CategoryManager'), { ssr: false });

export default function ClientCategoryWrapper({ initialCategories }: { initialCategories: Category[] }) {
    return <CategoryManager initialCategories={initialCategories} />;
}
