import { getProducts, getCategories } from '@/lib/github-api';
import ProductForm from '@/components/admin/ProductForm';
import ClientCategoryWrapper from '@/components/admin/ClientCategoryWrapper';
import { Package, FolderTree } from 'lucide-react';
import { cookies } from 'next/headers';
import { checkAdminAuth } from '@/lib/auth';

export default async function AdminPage() {
    const cookieStore = await cookies();
    checkAdminAuth(cookieStore);

    const [products, categories] = await Promise.all([
        getProducts(),
        getCategories()
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

            {/* Products Management (Right Column) */}
            <div className="xl:col-span-2 border border-border bg-card rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border bg-muted/10 flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold">Produits</h2>
                </div>
                <div className="p-6">
                    <ProductForm initialProducts={products || []} categories={categories || []} />
                </div>
            </div>
        </div>
    );
}
