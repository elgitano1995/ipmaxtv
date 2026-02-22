import { getProducts, getCategories } from '@/lib/github-api';
import ProductCard from '@/components/ProductCard';
import ReviewsList from '@/components/ReviewsList';
import { Play, Star, ShieldCheck, Zap, Monitor, Headset, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const FEATURES = [
  {
    title: "Qualité 4K & FHD",
    description: "Profitez d'une qualité d'image exceptionnelle avec nos serveurs optimisés pour la 4K, FHD et HD.",
    icon: Monitor,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Technologie Anti-Coupure",
    description: "Des serveurs ultra-puissants garantissant une fluidité parfaite pendant les grands événements sportifs.",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Support 24/7",
    description: "Notre équipe technique est à votre disposition sur WhatsApp pour vous assister à tout moment.",
    icon: Headset,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Activation Instantanée",
    description: "Recevez vos accès et commencez à regarder vos programmes favoris en moins de 5 minutes.",
    icon: CheckCircle2,
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

const FAQS = [
  {
    question: "Sur quels appareils puis-je utiliser l'abonnement ?",
    answer: "Notre IPTV est compatible avec presque tous les appareils : Smart TV (Samsung, LG, Android), Smartphones, Tablettes, PC/Mac, Apple TV, Amazon Fire Stick, et les boîtiers Android/Mag."
  },
  {
    question: "Quelle connexion internet est requise ?",
    answer: "Pour une expérience fluide et sans coupure, nous recommandons une connexion internet stable avec un débit minimum de 12 Mbps (ADSL, Fibre optique ou 4G/5G)."
  },
  {
    question: "Comment se déroule l'activation ?",
    answer: "Après avoir choisi votre abonnement et cliqué sur 'Commander', vous serez redirigé vers notre WhatsApp. Une fois le paiement confirmé, nous vous envoyons vos accès et un tutoriel d'installation."
  },
  {
    question: "Proposez-vous les chaînes sportives ?",
    answer: "Oui, tous nos abonnements incluent le bouquet complet des chaînes sportives (BeIN, RMC, Canal+, etc.) pour ne rater aucun match, avec une stabilité garantie lors des grands événements."
  }
];

export default async function Home() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories()
  ]);

  // If no data, provide empty states
  const visibleCategories = categories?.filter(c => c.isVisible).sort((a, b) => a.order - b.order) || [];
  const safeProducts = [...(products || [])].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-24 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="container relative mx-auto px-4 text-center z-10">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
            </div>
            <span className="text-sm font-medium text-muted-foreground ml-2">Approuvé par +10,000 clients</span>
          </div>
          <span className="text-primary font-bold tracking-widest uppercase text-xs mb-4 block flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Store Officiel IPTV
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 max-w-4xl mx-auto leading-tight">
            Le Meilleur de l'IPTV, <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Sans Coupure.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Découvrez nos serveurs premium. +20,000 chaînes, VOD 4K, et une stabilité garantie pour vos films, séries et matchs en direct.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link href="#servers" className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-all hover:shadow-[0_0_40px_-10px_rgba(139,92,246,0.6)] flex items-center justify-center gap-2">
              <Play className="w-5 h-5 fill-current" /> Voir les Abonnements
            </Link>
          </div>
        </div>
      </section>

      {/* Grid Section */}
      <section id="servers" className="py-24 bg-card/50 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-3xl font-bold mb-4">Nos Abonnements</h2>
            <p className="text-muted-foreground">Choisissez le serveur qui correspond à vos besoins.</p>
          </div>

          {visibleCategories.length > 0 ? (
            <div className="space-y-16">
              {visibleCategories.map(category => {
                const categoryProducts = safeProducts.filter(p => p.categoryId === category.id);
                if (categoryProducts.length === 0) return null;

                return (
                  <div key={category.id}>
                    <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                      <span className="w-2 h-8 bg-primary rounded-full" />
                      {category.name}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {categoryProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {safeProducts.length > 0 ? (
                safeProducts.map(product => <ProductCard key={product.id} product={product} />)
              ) : (
                <div className="col-span-full py-20 text-center text-muted-foreground border border-dashed border-border rounded-2xl">
                  Aucun serveur disponible pour le moment.
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight mb-4">Pourquoi choisir IPMaxTV ?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Nous nous engageons à fournir le meilleur service de streaming francophone avec une technologie de pointe.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="bg-card border border-border rounded-3xl p-8 hover:-translate-y-2 transition-transform duration-300 shadow-sm hover:shadow-xl">
                  <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6`}>
                    <Icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsList />

      {/* FAQ Section */}
      <section className="py-24 bg-background border-t border-border">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold tracking-tight mb-4">Questions Fréquentes</h2>
            <p className="text-muted-foreground text-lg">Tout ce que vous devez savoir avant de vous abonner.</p>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <details key={idx} className="group bg-card border border-border rounded-2xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-lg hover:text-primary transition-colors">
                  {faq.question}
                  <span className="transition duration-300 group-open:-rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="p-6 pt-0 text-muted-foreground leading-relaxed">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div >
  );
}
