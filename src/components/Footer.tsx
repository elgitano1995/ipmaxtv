export default function Footer() {
    return (
        <footer className="border-t border-border bg-card mt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <span className="font-bold text-xl tracking-tight">IPMax<span className="text-primary">TV</span></span>
                        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                            Le meilleur service IPTV premium. Qualité 4K, stabilité garantie et un support client ultra-réactif pour répondre à tous vos besoins en streaming.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Liens Rapides</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="/" className="hover:text-primary transition-colors">Accueil</a></li>
                            <li><a href="/#servers" className="hover:text-primary transition-colors">Serveurs</a></li>
                            <li><a href="/applications" className="hover:text-primary transition-colors">Applications</a></li>
                            <li><a href="/#reviews" className="hover:text-primary transition-colors">Avis Clients</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Contact</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Une question ? N'hésitez pas à nous contacter via WhatsApp.
                        </p>
                    </div>
                </div>
                <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
                    <p>© {new Date().getFullYear()} IPMaxTV. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
}
