import Link from 'next/link';
import { ShoppingCart, LogIn, MonitorPlay } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { CurrencySwitcher } from './CurrencySwitcher';
import GlobalSearch from './GlobalSearch';
import { getCategories } from '@/lib/github-api';

export default async function Header() {
    const categories = await getCategories();
    const headerCategories = categories?.filter(c => c.showInHeader && c.isVisible).sort((a,b) => a.order - b.order) || [];

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4 md:gap-8">
                <Link href="/" className="flex items-center gap-2 group shrink-0">
                    <div className="bg-primary/20 p-2 rounded-lg group-hover:bg-primary/30 transition-colors shrink-0">
                        <MonitorPlay className="w-6 h-6 text-primary" />
                    </div>
                    <span className="font-bold text-xl tracking-tight hidden sm:block shrink-0">TV4<span className="text-primary">Watch</span></span>
                </Link>

                <nav className="hidden md:flex gap-4 lg:gap-6 items-center flex-1 justify-center overflow-x-auto no-scrollbar">
                    <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors whitespace-nowrap shrink-0">Accueil</Link>
                    {headerCategories.length > 0 ? (
                        headerCategories.map(cat => (
                            <Link key={cat.id} href={`/#category-${cat.id}`} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap shrink-0">{cat.name}</Link>
                        ))
                    ) : (
                        <Link href="/#servers" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap shrink-0">Nos Serveurs</Link>
                    )}
                    <Link href="/applications" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap shrink-0">Applications</Link>
                    <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap shrink-0">Blog</Link>
                </nav>

                <div className="hidden lg:flex items-center lg:min-w-[250px] max-w-sm">
                    <GlobalSearch />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <CurrencySwitcher />
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
