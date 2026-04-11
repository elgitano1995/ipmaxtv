import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Download, Monitor, Shield, Zap, ChevronRight, Server, CheckCircle2 } from 'lucide-react';
import applicationsData from '../../../../data/applications.json';

type Application = {
    id: string;
    name: string;
    code: string;
    imageUrl?: string;
    keywords?: string[];
};

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    // Find app by ID or normalized name (slug-like)
    const normalizedParamId = decodeURIComponent(id).toLowerCase().replace(/-/g, ' ');
    const app = (applicationsData as Application[]).find(a =>
        a.id === id || a.name.toLowerCase() === normalizedParamId
    );

    if (!app) return { title: 'Application introuvable' };

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tv4watch.com';

    const title = `Codes Downloader Officiels pour ${app.name} - Installation Rapide`;
    const description = `Obtenez le code Downloader officiel (${app.code}) pour installer l'application IPTV ${app.name} sur votre Smart TV, Box Android, Firestick de manière sécurisée et rapide.`;
    const keywords = app.keywords || [
        app.name,
        `${app.name} code`,
        `downloader code ${app.name}`,
        `installer ${app.name}`
    ];

    return {
        title,
        description,
        keywords: keywords.join(', '),
        alternates: {
            canonical: `${baseUrl}/applications/${encodeURIComponent(app.name.toLowerCase().replace(/\s+/g, '-'))}`,
        },
        openGraph: {
            title,
            description,
            url: `${baseUrl}/applications/${encodeURIComponent(app.name.toLowerCase().replace(/\s+/g, '-'))}`,
            siteName: 'TV4Watch',
            images: [
                {
                    url: app.imageUrl || `${baseUrl}/icon.svg`,
                    width: 800,
                    height: 600,
                    alt: `Application ${app.name} IPTV`,
                },
            ],
            locale: 'fr_FR',
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [app.imageUrl || `${baseUrl}/icon.svg`],
        },
    };
}

export async function generateStaticParams() {
    return applicationsData.map((app) => ({
        id: app.name.toLowerCase().replace(/\s+/g, '-'),
    }));
}

export default async function ApplicationDetailPage({ params }: Props) {
    const { id } = await params;

    const normalizedParamId = decodeURIComponent(id).toLowerCase().replace(/-/g, ' ');
    const app = (applicationsData as Application[]).find(a =>
        a.id === id || a.name.toLowerCase() === normalizedParamId
    );

    if (!app) notFound();

    return (
        <div className="flex flex-col flex-1">
            {/* Breadcrumb / Navigation */}
            <div className="bg-muted/30 border-b border-border py-4">
                <div className="container mx-auto px-4 flex items-center text-sm text-muted-foreground gap-2">
                    <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
                    <ChevronRight className="w-4 h-4" />
                    <Link href="/applications" className="hover:text-primary transition-colors">Toutes les Applications</Link>
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-foreground font-medium">{app.name}</span>
                </div>
            </div>

            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-background relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                        {/* Content */}
                        <div className="flex-1 text-center md:text-left">
                            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase mb-6 border border-primary/20">
                                Application Officielle
                            </span>
                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                                Downloader Code pour <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                    {app.name}
                                </span>
                            </h1>
                            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto md:mx-0 leading-relaxed">
                                Utilisez le code exclusif ci-dessous pour télécharger et installer instantanément l'application {app.name} sur n'importe quel appareil Android, Firestick ou Smart TV via l'application Downloader.
                            </p>

                            <div className="bg-card border border-border rounded-3xl p-8 max-w-md mx-auto md:mx-0 shadow-lg relative overflow-hidden group hover:border-primary/50 transition-colors">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary" />
                                <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center justify-center md:justify-start gap-2">
                                    <Download className="w-4 h-4" /> Code Downloader :
                                </p>
                                <div className="text-5xl md:text-6xl font-black text-foreground tracking-widest font-mono text-center md:text-left">
                                    {app.code}
                                </div>
                            </div>
                        </div>

                        {/* Image/Icon */}
                        <div className="w-full max-w-sm shrink-0">
                            <div className="aspect-square relative rounded-full bg-card border border-border/50 flex items-center justify-center p-12 shadow-2xl overflow-hidden group">
                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                {app.imageUrl ? (
                                    <Image
                                        src={app.imageUrl}
                                        alt={`Logo de l'application IPTV ${app.name}`}
                                        width={300}
                                        height={300}
                                        className="w-full h-full object-contain filter drop-shadow-lg transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <Monitor className="w-32 h-32 text-muted-foreground opacity-20" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Guide Section */}
            <section className="py-24 bg-muted/20 border-t border-border">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">Comment installer {app.name} ?</h2>
                        <p className="text-muted-foreground text-lg">Suivez ces trois étapes simples pour profiter de votre abonnement sur {app.name}.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-card p-8 rounded-3xl border border-border relative">
                            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-6 absolute -top-6 left-8 ring-8 ring-background">1</div>
                            <h3 className="text-xl font-bold mb-4 mt-2">Installer Downloader</h3>
                            <p className="text-muted-foreground">Allez dans le store de votre appareil (Amazon Appstore ou Google Play) et recherchez l'application gratuite <strong>"Downloader"</strong>. Installez-la.</p>
                        </div>
                        <div className="bg-card p-8 rounded-3xl border border-border relative">
                            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-6 absolute -top-6 left-8 ring-8 ring-background">2</div>
                            <h3 className="text-xl font-bold mb-4 mt-2">Entrer le code</h3>
                            <p className="text-muted-foreground">Ouvrez Downloader. Sur l'écran d'accueil, tapez le code officiel <strong>{app.code}</strong> dans la barre de recherche URL, puis cliquez sur "Go".</p>
                        </div>
                        <div className="bg-card p-8 rounded-3xl border border-border relative">
                            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-6 absolute -top-6 left-8 ring-8 ring-background">3</div>
                            <h3 className="text-xl font-bold mb-4 mt-2">Installer {app.name}</h3>
                            <p className="text-muted-foreground">Le téléchargement commencera automatiquement. Une fois terminé, cliquez sur <strong>"Installer"</strong> pour ajouter {app.name} à votre appareil.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO Content Enrichment */}
            <section className="py-24 bg-background border-t border-border">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-2xl font-bold mb-6">Abonnement optimisé pour {app.name}</h2>
                    <p className="text-muted-foreground leading-relaxed mb-8">
                        Vous cherchez le meilleur serveur IPTV à utiliser avec <strong>{app.name}</strong> ?
                        Chez TV4Watch, nos serveurs sont parfaitement stables et garantis sans coupure sur
                        tous les lecteurs IPTV, y compris {app.name}. Profitez de la VOD 4K, des chaînes sportives
                        sans interruption et d'un support technique en ligne 24/7.
                    </p>
                    <Link href="/#servers" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold hover:bg-primary/90 transition-all">
                        <Server className="w-5 h-5" /> Voir nos abonnements 4K
                    </Link>
                </div>
            </section>
        </div>
    );
}
