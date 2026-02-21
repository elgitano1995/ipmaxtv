import { getProducts, getCategories } from '@/lib/github-api';
import ProductCard from '@/components/ProductCard';
import ReviewsList from '@/components/ReviewsList';
import { Play } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  // If no data, provide empty states
  const visibleCategories = categories?.filter(c => c.isVisible).sort((a, b) => a.order - b.order) || [];
  const safeProducts = products || [];

  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-24 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="container relative mx-auto px-4 text-center z-10">
          <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-4 block">Store Officiel</span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 max-w-4xl mx-auto leading-tight">
            Le Meilleur de l'IPTV, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Sans Coupure.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Découvrez nos serveurs premium. +20,000 chaînes, VOD 4K, et une stabilité garantie pour vos films, séries et matchs en direct.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="#servers" className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-all hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)] flex items-center gap-2">
              <Play className="w-5 h-5 fill-current" /> Voir les Serveurs
            </Link>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section id="servers" className="py-24 bg-card/50 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4">Nos Abonnements</h2>
            <p className="text-muted-foreground">Choisissez le serveur qui correspond à vos besoins.</p>
          </div>

          {visibleCategories.length > 0 ? (
            <div className="space-y-16">
              {visibleCategories.map(category => {
                const categoryProducts = safeProducts.filter(p => p.categoryId === category.id);
                if (categoryProducts.length === 0) return null;

                return (
                  <div key={category.id}>
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <span className="w-2 h-8 bg-primary rounded-full" />
                      {category.name}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {categoryProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {safeProducts.length > 0 ? (
                safeProducts.map(product => <ProductCard key={product.id} product={product} />)
              ) : (
                <div className="col-span-full py-20 text-center text-muted-foreground border border-dashed border-border rounded-2xl">
                  Aucun serveur disponible pour le moment.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsList />
    </div>
  );
}
