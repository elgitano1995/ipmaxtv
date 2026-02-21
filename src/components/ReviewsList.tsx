import { getReviews } from '@/lib/github-api';
import { Star, Quote } from 'lucide-react';

export default async function ReviewsList() {
    const reviews = await getReviews();

    if (!reviews || reviews.length === 0) {
        return null;
    }

    return (
        <section className="mt-10 py-20 border-t border-border bg-muted/10 relative overflow-hidden" id="reviews">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
            <div className="container relative z-10 mx-auto px-4">
                <div className="text-center md:text-left mb-12">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Avis de nos clients</h2>
                    <p className="text-muted-foreground text-lg">Ce que disent nos abonnés de la qualité de nos serveurs.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review) => (
                        <div key={review.id} className="group relative bg-card border border-border rounded-3xl p-8 flex flex-col justify-between shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
                            <Quote className="absolute top-8 right-8 w-12 h-12 text-muted-foreground/10 group-hover:text-primary/10 transition-colors duration-300 rotate-180" />

                            <div className="relative z-10 flex-1">
                                <div className="flex items-center gap-1.5 mb-6">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < review.rating ? 'fill-primary text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]' : 'text-muted/50'}`}
                                        />
                                    ))}
                                </div>
                                <p className="text-foreground text-lg italic mb-8 leading-relaxed font-medium">
                                    "{review.comment}"
                                </p>
                            </div>

                            <div className="relative z-10 flex items-center justify-between border-t border-border pt-6 mt-auto">
                                <span className="font-bold text-base text-foreground group-hover:text-primary transition-colors">{review.authorName}</span>
                                <span className="text-sm font-medium text-muted-foreground px-3 py-1 bg-muted/50 rounded-full">{new Date(review.date).toLocaleDateString('fr-FR')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
