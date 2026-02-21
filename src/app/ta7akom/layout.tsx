export default async function Ta7akomLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="flex flex-col min-h-screen">
            {/* Minimalist Admin Header */}
            <header className="sticky top-0 z-40 bg-card border-b border-border">
                <div className="px-6 h-14 flex items-center justify-between">
                    <span className="font-bold tracking-tight flex items-center gap-2">
                        <span className="text-primary">IPMax</span> Ta7akom
                    </span>
                    <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-md">
                        Connecté
                    </span>
                </div>
            </header>

            <main className="flex-1 bg-muted/5 p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
