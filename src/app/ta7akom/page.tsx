import { getProducts, getCategories, getReviews, getArticles } from '@/lib/github-api';
import ClientProductWrapper from '@/components/admin/ClientProductWrapper';
import ClientCategoryWrapper from '@/components/admin/ClientCategoryWrapper';
import ReviewManager from '@/components/admin/ReviewManager';
import ArticleManager from '@/components/admin/ArticleManager';
import { Package, FolderTree, Star, BookOpen } from 'lucide-react';
import { cookies } from 'next/headers';
import { checkAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const cookieStore = await cookies();
    checkAdminAuth(cookieStore);

    const [products, categories, reviews, articles] = await Promise.all([
        getProducts(),
        getCategories(),
        getReviews(),
        getArticles()
    ]);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Categories Management (Left Column) */}
            <div className="xl:col-span-1 border border-border bg-card rounded-2xl shadow-sm overflow-hidden h-fit">
                <div className="p-6 border-b border-border bg-muted/10 flex items-center gap-2">
                    <FolderTree className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold">Catégories</h2>
                </div>
                <div className="p-6">
                    <ClientCategoryWrapper initialCategories={categories || []} />
                </div>
            </div>

            {/* Reviews Management (Left Column Bottom) */}
            <div className="xl:col-span-1 border border-border bg-card rounded-2xl shadow-sm overflow-hidden h-fit mt-8 xl:mt-0 xl:row-start-2">
                <div className="p-6 border-b border-border bg-muted/10 flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold">Avis Clients</h2>
                </div>
                <div className="p-6">
                    <ReviewManager initialReviews={reviews || []} />
                </div>
            </div>

            {/* Products Management (Right Column) */}
            <div className="xl:col-span-2 xl:row-span-2 border border-border bg-card rounded-2xl shadow-sm overflow-hidden h-fit">
                <div className="p-6 border-b border-border bg-muted/10 flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold">Produits</h2>
                </div>
                <div className="p-6">
                    <ClientProductWrapper initialProducts={products || []} categories={categories || []} />
                </div>
            </div>

            {/* Articles Management (Full Width Bottom) */}
            <div className="xl:col-span-3 border border-border bg-card rounded-2xl shadow-sm overflow-hidden h-fit mt-8">
                <div className="p-6 border-b border-border bg-primary/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold">Articles du Blog (SEO)</h2>
                    </div>
                </div>
                <div className="p-6 bg-muted/5">
                    <ArticleManager initialArticles={articles || []} />
                </div>
            </div>
        </div>
    );
}
