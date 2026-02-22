import { searchGlobal } from '@/app/actions/search';
import ProductCard from '@/components/ProductCard';
import ApplicationCard from '@/components/ApplicationCard';
import { SearchX } from 'lucide-react';
import Link from 'next/link';

interface SearchPageProps {
    searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    // Next.js 15 searchParams resolution
    const params = await searchParams;
    const query = params.q || '';

    // Execute server-side search
    const results = await searchGlobal(query);
    const hasProducts = results.products.length > 0;
    const hasApps = results.applications.length > 0;
    const hasResults = hasProducts || hasApps;

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 flex-1">
            <div className="mb-12">
                <h1 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
                    Résultats pour <span className="text-primary">"{query}"</span>
                </h1>
                <p className="text-muted-foreground">
                    {!query ? "Veuillez entrer un terme de recherche." :
                        hasResults ? `Nous avons trouvé ${results.products.length + results.applications.length} résultat(s).` :
                            "Aucun résultat trouvé pour votre recherche."}
                </p>
            </div>

            {!hasResults && query && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="bg-muted w-24 h-24 rounded-full flex items-center justify-center mb-6">
                        <SearchX className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Aucun résultat</h3>
                    <p className="text-muted-foreground max-w-md mb-8">
                        Nous n'avons trouvé aucun serveur ou application correspondant à "{query}". Essayez avec d'autres mots-clés.
                    </p>
                    <Link href="/" className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl font-medium transition-colors">
                        Retour à l'accueil
                    </Link>
                </div>
            )}

            {hasProducts && (
                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-2xl font-bold">Abonnements IPTV</h2>
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold">{results.products.length}</span>
                        <div className="h-px bg-border flex-1" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {results.products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            )}

            {hasApps && (
                <div>
                    <div className="flex items-center gap-4 mb-8">
                        <h2 className="text-2xl font-bold">Applications Downloader</h2>
                        <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-bold">{results.applications.length}</span>
                        <div className="h-px bg-border flex-1" />
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-x-2 gap-y-8">
                        {results.applications.map((app) => (
                            <ApplicationCard key={app.id} app={app} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
