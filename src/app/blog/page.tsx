import { getArticles } from '@/lib/github-api';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, ChevronRight, BookOpen } from 'lucide-react';

export const metadata = {
    title: 'Le Blog IPMaxTV | Actualités, Tutos et Astuces IPTV',
    description: 'Découvrez nos guides complets pour installer, configurer et optimiser votre abonnement IPTV sur Smart TV, Android, Apple et Firestick.',
};

export default async function BlogIndexPage() {
    const articles = await getArticles();

    // Sort mostly recent first
    const sortedArticles = [...(articles || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="flex flex-col flex-1">
            {/* Header */}
            <section className="bg-background border-b border-border py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase mb-6 border border-primary/20">
                        Ressources & Actualités
                    </span>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                        Le Blog <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">IPMaxTV</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Tutoriels complets, comparatifs d'applications et actualités IPTV pour tirer le meilleur de votre abonnement.
                    </p>
                </div>
            </section>

            {/* Articles Grid */}
            <section className="py-20 bg-muted/20 flex-1">
                <div className="container mx-auto px-4 max-w-6xl">
                    {sortedArticles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {sortedArticles.map((article) => (
                                <Link 
                                    href={`/blog/${article.slug}`} 
                                    key={article.id}
                                    className="group flex flex-col bg-card rounded-3xl border border-border overflow-hidden hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
                                >
                                    {/* Thumbnail Placeholder / Image */}
                                    <div className="relative aspect-[16/9] w-full bg-muted overflow-hidden flex items-center justify-center p-8 border-b border-border">
                                        <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                        {article.coverImage ? (
                                             <Image
                                                src={article.coverImage}
                                                alt={article.title}
                                                fill
                                                className="object-contain p-8 group-hover:scale-110 transition-transform duration-700 ease-out opacity-90"
                                            />
                                        ) : (
                                            <BookOpen className="w-16 h-16 text-muted-foreground opacity-30 group-hover:scale-110 transition-transform duration-700" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-8 flex flex-col flex-1">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                            <Calendar className="w-4 h-4" />
                                            <span>
                                                {new Date(article.date).toLocaleDateString('fr-FR', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors leading-snug line-clamp-2">
                                            {article.title}
                                        </h2>
                                        <p className="text-muted-foreground flex-1 line-clamp-3 mb-6">
                                            {article.excerpt}
                                        </p>
                                        <div className="flex items-center text-primary font-semibold mt-auto text-sm">
                                            Lire l'article <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 text-muted-foreground border border-dashed border-border rounded-3xl">
                            Aucun article disponible pour le moment.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
