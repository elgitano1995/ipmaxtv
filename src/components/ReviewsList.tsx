import { getReviews } from '@/lib/github-api';
import { Star } from 'lucide-react';

export default async function ReviewsList() {
    const reviews = await getReviews();

    if (!reviews || reviews.length === 0) {
        return null;
    }

    return (
        <section className="mt-20 pt-16 border-t border-border" id="reviews">
            <h2 className="text-3xl font-bold tracking-tight mb-8 text-center md:text-left">Avis de nos clients</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-card/50 border border-border rounded-2xl p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-1 mb-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-4 h-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted'}`}
                                    />
                                ))}
                            </div>
                            <p className="text-muted-foreground text-sm italic mb-6 leading-relaxed">
                                "{review.comment}"
                            </p>
                        </div>
                        <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
                            <span className="font-semibold text-sm">{review.authorName}</span>
                            <span className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString('fr-FR')}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
