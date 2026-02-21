'use client';

import { useState } from 'react';
import { Product, ProductVariant } from '@/lib/types';
import { MessageCircle } from 'lucide-react';

export default function ProductPricing({ product }: { product: Product }) {
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
        product.variants?.length > 0 ? product.variants[0] : null
    );

    // Hardcode fallback WhatsApp logic or use env
    const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '33600000000'; // fallback placeholder

    const handleOrder = () => {
        if (!selectedVariant) return;

        // Get the current page URL for the product link
        const productUrl = typeof window !== 'undefined' ? window.location.href : '';

        const message = `Bonjour, je voudrais commander le serveur ${product.name}\n\nDurée sélectionnée : ${selectedVariant.duration}\nPrix : ${selectedVariant.price}\n\nLien du produit: ${productUrl}`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

        window.open(whatsappUrl, '_blank');
    };

    if (!product.variants || product.variants.length === 0) {
        return (
            <div className="p-6 bg-card rounded-2xl border border-destructive text-destructive font-medium border-dashed">
                Ce produit n'a pas de tarification définie pour le moment.
            </div>
        );
    }

    return (
        <div className="bg-muted/10 p-6 md:p-8 rounded-3xl border border-border shadow-inner mt-auto flex flex-col h-full justify-between">
            <div>
                <h3 className="text-xl font-bold mb-6 text-foreground/90">Choisissez votre abonnement</h3>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {product.variants.map((variant) => (
                        <button
                            key={variant.id}
                            onClick={() => setSelectedVariant(variant)}
                            className={`
                flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all group
                ${selectedVariant?.id === variant.id
                                    ? 'border-primary bg-primary/10 shadow-[0_0_20px_-5px_rgba(139,92,246,0.3)]'
                                    : 'border-border bg-card hover:border-primary/50 hover:bg-card/80'
                                }
              `}
                        >
                            <span className={`text-sm font-semibold mb-2 ${selectedVariant?.id === variant.id ? 'text-primary' : 'text-muted-foreground'}`}>
                                {variant.duration}
                            </span>
                            <span className={`text-lg font-bold ${selectedVariant?.id === variant.id ? 'text-foreground' : 'text-foreground/80'}`}>
                                {variant.price}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex flex-col flex-1">
                    <span className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Total à payer</span>
                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                        {selectedVariant?.price}
                    </span>
                </div>

                <button
                    onClick={handleOrder}
                    disabled={!selectedVariant}
                    className="w-full sm:w-auto flex-1 bg-[#00a884] hover:bg-[#008f6f] text-white font-bold py-4 px-8 rounded-full transition-colors flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-lg"
                >
                    <MessageCircle className="w-6 h-6 fill-current" />
                    <span>Commander via WhatsApp</span>
                </button>
            </div>
        </div>
    );
}
