import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck, Zap, Server, ChevronRight } from 'lucide-react';
import { Product } from '@/lib/types';

export default function ProductCard({ product }: { product: Product }) {
    // Determine starting price (lowest variant price)
    const startingPrice = product.variants && product.variants.length > 0
        ? product.variants.reduce((min, p) => {
            const currentPrice = parseFloat(p.price.replace(/[^0-9.]/g, ''));
            const minPrice = parseFloat(min.price.replace(/[^0-9.]/g, ''));
            return currentPrice < minPrice ? p : min;
        }, product.variants[0]).price
        : 'N/A';

    return (
        <Link href={`/product/${encodeURIComponent(product.name.replace(/\s+/g, '_'))}`} className="group flex flex-col bg-card rounded-3xl border border-border shadow-sm overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/10">
            {/* Image Header */}
            <div className="relative h-56 w-full bg-muted/30 flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent z-10" />

                {/* Badges */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                    {product.isBestSeller && (
                        <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                            <Zap className="w-3.5 h-3.5 fill-current" /> Best Seller
                        </span>
                    )}
                    {product.isStable && (
                        <span className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md">
                            <BadgeCheck className="w-3.5 h-3.5" /> 100% Stable
                        </span>
                    )}
                </div>

                <div className="relative aspect-[4/3] w-full bg-muted flex items-center justify-center p-6">
                    {product.imageUrl ? (
                        <Image
                            src={product.imageUrl}
                            alt={`Abonnement IPTV ${product.name} 4k FHD Sans Coupure au Maroc et en France`}
                            width={400}
                            height={300}
                            className="w-full h-full object-contain filter drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
                        />
                    ) : (
                        <Server className="w-20 h-20 text-muted-foreground z-0 opacity-40 group-hover:scale-110 transition-transform duration-700 ease-out" />
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-1 z-20 bg-card relative">
                <h3 className="text-2xl font-black tracking-tight mb-2 text-foreground group-hover:text-primary transition-colors">{product.name}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-6 leading-relaxed">
                    {product.description}
                </p>

                <div className="mt-auto pt-5 border-t border-border flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">À partir de</span>
                        <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{startingPrice}</span>
                    </div>

                    <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-1 group/btn">
                        Détails
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
