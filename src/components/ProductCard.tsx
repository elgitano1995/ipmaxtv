import Image from 'next/image';
import Link from 'next/link';
import { BadgeCheck, Zap, Server } from 'lucide-react';
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
        <div className="group flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all hover:shadow-[0_0_30px_-10px_rgba(139,92,246,0.3)]">
            {/* Image Header */}
            <div className="relative h-48 w-full bg-muted/50 p-6 flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-card/90 z-10" />

                {/* Badges */}
                <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
                    {product.isBestSeller && (
                        <span className="bg-primary/90 text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-lg">
                            <Zap className="w-3 h-3 fill-current" /> Best Seller
                        </span>
                    )}
                    {product.isStable && (
                        <span className="bg-secondary/90 text-secondary-foreground text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1 shadow-lg">
                            <BadgeCheck className="w-3 h-3" /> 100% Stable
                        </span>
                    )}
                </div>

                {/* Server Icon/Image (Fallback if no imageUrl) */}
                {product.imageUrl ? (
                    <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <Server className="w-20 h-20 text-muted-foreground z-0 opacity-50 group-hover:scale-110 transition-transform duration-500" />
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1 z-20 bg-card">
                <h3 className="text-xl font-bold tracking-tight mb-1">{product.name}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                    {product.description}
                </p>

                <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">À partir de</span>
                        <span className="text-lg font-bold text-primary">{startingPrice}</span>
                    </div>

                    <Link href={`/product/${product.id}`} className="bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-colors px-4 py-2 rounded-lg font-semibold text-sm">
                        Voir Détails
                    </Link>
                </div>
            </div>
        </div>
    );
}
