import { Product, Review } from '@/lib/types';

export default function SchemaMarkup({
    product,
    reviews
}: {
    product: Product;
    reviews?: Review[];
}) {
    const validVariants = product.variants?.filter(v => v.price && v.duration) || [];
    const prices = validVariants.map(v => parseFloat(v.price.replace(/[^0-9.]/g, '')));
    const lowestPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const highestPrice = prices.length > 0 ? Math.max(...prices) : 0;

    let aggregateRating = undefined;

    if (reviews && reviews.length > 0) {
        const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
        aggregateRating = {
            "@type": "AggregateRating",
            "ratingValue": avgRating.toFixed(1),
            "reviewCount": reviews.length.toString()
        };
    }

    const schemaData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": product.imageUrl,
        "description": product.description,
        "sku": product.id,
        "brand": {
            "@type": "Brand",
            "name": "TV4Watch"
        },
        "offers": {
            "@type": "AggregateOffer",
            "lowPrice": lowestPrice || 0,
            "highPrice": highestPrice || 0,
            "offerCount": validVariants.length || 1,
            "priceCurrency": "MAD"
        },
        ...(aggregateRating && { aggregateRating })
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
    );
}
