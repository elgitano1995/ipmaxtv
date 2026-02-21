import { getProducts } from '@/lib/github-api';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import ProductPricing from '@/components/ProductPricing';
import ReviewsList from '@/components/ReviewsList';
import SchemaMarkup from '@/components/SchemaMarkup';
import Image from 'next/image';
import { CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { getReviews } from '@/lib/github-api';
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    const products = await getProducts();
    const product = products.find(p => p.id === id || p.name.replace(/\s+/g, '_') === decodedId);

    if (!product) {
        return {
            title: 'Produit Introuvable | IPMaxTV',
        };
    }

    return {
        title: `${product.metaTitle || product.name} | IPMaxTV`,
        description: product.metaDescription || product.description,
        ...(product.keywords && product.keywords.length > 0 && { keywords: product.keywords }),
    };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const decodedId = decodeURIComponent(id);
    const products = await getProducts();
    const product = products.find(p => p.id === id || p.name.replace(/\s+/g, '_') === decodedId);

    if (!product) {
        notFound();
    }

    const reviews = await getReviews();
    const productReviews = reviews?.filter(r => r.rating > 0) || [];

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 flex-1">
            <SchemaMarkup product={product} reviews={productReviews} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

                {/* Left Column: Visuals & Features */}
                <div className="space-y-8">
                    <div className="w-full h-80 md:h-[500px] relative bg-card rounded-3xl border border-border shadow-2xl overflow-hidden flex items-center justify-center">
                        {product.imageUrl ? (
                            <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
                        ) : (
                            <div className="text-muted-foreground/50 text-xl font-medium tracking-widest uppercase">
                                {product.name}
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />

                        {/* Badges Overlay */}
                        <div className="absolute bottom-6 left-6 flex gap-3">
                            {product.isBestSeller && (
                                <span className="bg-primary/90 backdrop-blur-sm text-primary-foreground text-sm font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
                                    <Zap className="w-4 h-4 fill-current" /> Best Seller
                                </span>
                            )}
                            {product.isStable && (
                                <span className="bg-secondary/90 backdrop-blur-sm text-secondary-foreground text-sm font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg">
                                    <ShieldCheck className="w-4 h-4" /> Stable 100%
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="bg-card/50 rounded-2xl p-6 md:p-8 border border-border">
                        <h3 className="text-xl font-bold mb-6 border-b border-border pb-4">Caractéristiques Techniques</h3>
                        <ul className="space-y-4">
                            {product.features && product.features.length > 0 ? (
                                product.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                        <span className="text-muted-foreground leading-relaxed">{feature}</span>
                                    </li>
                                ))
                            ) : (
                                <li className="text-muted-foreground italic">Aucune caractéristique spécifique renseignée.</li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Right Column: Information & Pricing Configuration */}
                <div className="flex flex-col">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{product.name}</h1>
                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                        {product.description}
                    </p>

                    <div className="flex-1">
                        <ProductPricing product={product} />
                    </div>

                    <div className="mt-8 pt-8 border-t border-border flex items-center gap-4 text-sm text-muted-foreground">
                        <ShieldCheck className="w-5 h-5 text-secondary" />
                        <p>Paiement sécurisé. Activation immédiate après confirmation. Support client 7j/7.</p>
                    </div>
                </div>

            </div>

            <ReviewsList />
        </div>
    );
}
