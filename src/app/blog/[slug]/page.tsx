import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getArticles } from '@/lib/github-api';
import { Calendar, User, ChevronLeft } from 'lucide-react';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const articles = await getArticles();
    const article = articles.find((a) => a.slug === slug);

    if (!article) return { title: 'Article introuvable' };

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ipmaxtv.shop';

    return {
        title: `${article.title} | Blog IPMaxTV`,
        description: article.excerpt,
        keywords: article.keywords?.join(', '),
        alternates: {
            canonical: `${baseUrl}/blog/${article.slug}`,
        },
        openGraph: {
            title: article.title,
            description: article.excerpt,
            url: `${baseUrl}/blog/${article.slug}`,
            siteName: 'IPMaxTV',
            images: [
                {
                    url: article.coverImage.startsWith('http') ? article.coverImage : `${baseUrl}${article.coverImage}`,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                },
            ],
            locale: 'fr_FR',
            type: 'article',
            authors: [article.author],
            publishedTime: article.date,
        },
        twitter: {
            card: 'summary_large_image',
            title: article.title,
            description: article.excerpt,
            images: [article.coverImage.startsWith('http') ? article.coverImage : `${baseUrl}${article.coverImage}`],
        },
    };
}

export async function generateStaticParams() {
    const articles = await getArticles();
    return articles.map((article) => ({
        slug: article.slug,
    }));
}

// Very basic custom Markdown parser to avoid adding heavy dependencies
function parseMarkdown(content: string) {
    let html = content;
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold mt-8 mb-4 text-foreground">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-3xl font-extrabold mt-12 mb-6 text-primary">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-4xl font-black mt-8 mb-6">$1</h1>');
    
    // Bold
    html = html.replace(/\*\*(.*)\*\*/gim, '<strong class="font-bold text-foreground">$1</strong>');
    
    // Italics
    html = html.replace(/\*(.*)\*/gim, '<em class="italic">$1</em>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" class="text-primary hover:underline font-semibold">$1</a>');
    
    // Lists
    html = html.replace(/^- (.*$)/gim, '<li class="ml-4 mb-2 list-disc">$1</li>');
    
    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-primary pl-4 py-1 italic my-6 bg-primary/5 rounded-r-lg">$1</blockquote>');
    
    // Inline Code
    html = html.replace(/`([^`]+)`/gim, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm text-primary font-mono">$1</code>');

    // Paragraphs (Double Line Breaks)
    html = html.split('\n\n').map(p => {
        if (p.trim().startsWith('<h') || p.trim().startsWith('<ul') || p.trim().startsWith('<li') || p.trim().startsWith('<blockquote')) {
            return p;
        }
        return `<p class="mb-6 leading-relaxed text-lg">${p.replace(/\n/g, '<br/>')}</p>`;
    }).join('');

    return html;
}

export default async function ArticlePage({ params }: Props) {
    const { slug } = await params;
    const articles = await getArticles();
    const article = articles.find((a) => a.slug === slug);

    if (!article) notFound();

    const parsedContent = parseMarkdown(article.content);

    return (
        <article className="flex flex-col flex-1 bg-background text-muted-foreground">
            {/* Header / Hero */}
            <div className="relative w-full min-h-[40vh] md:min-h-[50vh] flex items-end justify-center pt-32 pb-16 px-4 overflow-hidden border-b border-border">
                {/* Background Image / Pattern */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/40 z-10" />
                    {article.coverImage && (
                        <Image
                            src={article.coverImage}
                            alt={article.title}
                            fill
                            className="object-cover opacity-20 filter blur-sm scale-105"
                            priority
                        />
                    )}
                </div>

                <div className="container mx-auto max-w-4xl relative z-20">
                    <Link href="/blog" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors bg-card/50 px-4 py-2 rounded-full border border-border backdrop-blur-md">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Retour au blog
                    </Link>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 leading-tight tracking-tight">
                        {article.title}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-6 text-sm font-medium">
                        <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20">
                            <Calendar className="w-4 h-4" />
                            <time dateTime={article.date}>
                                {new Date(article.date).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </time>
                        </div>
                        <div className="flex items-center gap-2 text-foreground/80 bg-muted px-3 py-1.5 rounded-full border border-border">
                            <User className="w-4 h-4" />
                            <span>{article.author}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="container mx-auto max-w-4xl px-4 py-16">
                <div className="bg-card border border-border/50 rounded-3xl p-8 md:p-12 shadow-sm">
                    {/* Excerpt emphasis */}
                    <div className="text-xl md:text-2xl font-medium text-foreground 
mb-12 pb-12 border-b border-border/50 leading-relaxed">
                        {article.excerpt}
                    </div>

                    {/* The Parsed Content */}
                    <div 
                        className="article-content"
                        dangerouslySetInnerHTML={{ __html: parsedContent }}
                    />
                </div>
                
                {/* Tags / Keywords */}
                {article.keywords && article.keywords.length > 0 && (
                    <div className="mt-12 flex flex-wrap gap-2">
                        <span className="text-sm font-bold mr-2 flex items-center">Tags :</span>
                        {article.keywords.map((keyword, idx) => (
                            <span key={idx} className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full border border-border">
                                #{keyword.replace(/\s+/g, '-')}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </article>
    );
}
