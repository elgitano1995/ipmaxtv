'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, MonitorPlay, X } from 'lucide-react';
import { searchGlobal, SearchResult } from '@/app/actions/search';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useClickOutside } from '@/lib/hooks/useClickOutside'; // Assuming a generic hook or we can inline it
import clsx from 'clsx';

export default function GlobalSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Debounce search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setIsSearching(true);
                const res = await searchGlobal(query);
                setResults(res);
                setIsSearching(false);
                setIsOpen(true);
            } else {
                setResults(null);
                setIsOpen(query.trim().length > 0);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && query.trim()) {
            setIsOpen(false);
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
        if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const handleClear = () => {
        setQuery('');
        setResults(null);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg" ref={containerRef}>
            <div className={`relative flex items-center w-full h-10 rounded-full bg-muted/50 border overflow-hidden transition-all ${isOpen ? 'border-primary ring-1 ring-primary/50' : 'border-border'}`}>
                <div className="pl-3 text-muted-foreground">
                    {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onKeyDown={handleKeyDown}
                    onFocus={() => { if (query) setIsOpen(true) }}
                    placeholder="Chercher un produit, serveur, app..."
                    className="w-full bg-transparent border-none text-sm px-3 focus:outline-none placeholder:text-muted-foreground/70"
                />
                {query && (
                    <button onClick={handleClear} className="pr-3 text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Dropdown Results */}
            {isOpen && (query.trim().length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-background/80 backdrop-blur-xl border border-border shadow-2xl rounded-2xl overflow-hidden z-[100] animate-in slide-in-from-top-2 fade-in duration-200">
                    <div className="max-h-[70vh] overflow-y-auto overscroll-contain">

                        {/* Empty State */}
                        {results && results.products.length === 0 && results.applications.length === 0 && !isSearching && (
                            <div className="p-6 text-center text-sm text-muted-foreground">
                                Aucun résultat trouvé pour "{query}"
                            </div>
                        )}

                        {/* Products */}
                        {results && results.products.length > 0 && (
                            <div className="p-2">
                                <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground flex justify-between items-center bg-muted/30 rounded-t-lg mb-1">
                                    <span>Abonnements IPTV</span>
                                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px]">{results.products.length}</span>
                                </div>
                                {results.products.map(prod => (
                                    <Link
                                        key={prod.id}
                                        href={`/product/${encodeURIComponent(prod.name.replace(/\\s+/g, '_'))}`}
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-xl transition-colors group"
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-card border overflow-hidden relative flex-shrink-0">
                                            <Image src={prod.imageUrl} alt={prod.name} fill className="object-cover" />
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{prod.name}</span>
                                            <span className="text-xs text-muted-foreground truncate">{prod.variants?.[0]?.price || 0}€ - {prod.description}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Applications */}
                        {results && results.applications.length > 0 && (
                            <div className="p-2 border-t border-border">
                                <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground flex justify-between items-center bg-muted/30 rounded-t-lg mb-1">
                                    <span>Applications Downloader</span>
                                    <span className="bg-secondary/10 text-secondary px-2 py-0.5 rounded-full text-[10px]">{results.applications.length}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-1 px-1">
                                    {results.applications.map(app => (
                                        <Link
                                            key={app.id}
                                            href="/applications"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded-xl transition-colors group"
                                        >
                                            <div className="w-8 h-8 rounded-full border border-secondary/30 relative overflow-hidden bg-card flex items-center justify-center flex-shrink-0">
                                                {app.imageUrl ? (
                                                    <Image src={app.imageUrl} alt={app.name} fill className="object-cover" />
                                                ) : (
                                                    <MonitorPlay className="w-4 h-4 text-secondary/70" />
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-xs font-bold truncate group-hover:text-secondary">{app.name}</span>
                                                <span className="text-[10px] text-muted-foreground font-mono bg-background px-1 rounded inline-block w-fit mt-0.5">{app.code}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>

                    {/* Advanced Search Footer */}
                    {query.trim().length > 0 && (
                        <div className="p-2 border-t border-border bg-muted/10">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                                }}
                                className="w-full py-2.5 text-sm font-medium text-center text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors flex items-center justify-center gap-2"
                            >
                                <Search className="w-4 h-4" />
                                Voir tous les résultats pour "{query}"
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
