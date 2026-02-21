import { Product, Review } from '@/lib/types';

export default function SchemaMarkup({
    product,
    reviews
}: {
    product: Product;
    reviews?: Review[];
}) {
    const lowestPrice = product.variants?.length > 0
        ? Math.min(...product.variants.map(v => parseFloat(v.price.replace(/[^0-9.]/g, ''))))
        : 0;

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
        "offers": {
            "@type": "AggregateOffer",
            "lowPrice": lowestPrice,
            "priceCurrency": "EUR"
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
