import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import ApplicationCard from '@/components/ApplicationCard';
import { Info } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Applications & Codes Downloader | IPMaxTV',
    description: 'Une liste complète des codes Downloader pour toutes vos applications IPTV préférées. Entrez simplement le code sur votre appareil.',
};

export default async function ApplicationsPage() {
    // Read local json
    const filePath = path.join(process.cwd(), 'data', 'applications.json');
    const appsList = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    return (
        <div className="container mx-auto px-4 py-12 md:py-20 flex-1">
            <div className="text-center max-w-3xl mx-auto mb-12 md:mb-20">
                <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                    Codes <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Downloader</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    Installez facilement vos applications IPTV préférées sur Amazon FireStick, Android TV ou Box TV.
                </p>
                <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4 text-sm">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-3 rounded-xl font-bold border border-primary/20 shadow-sm">
                        <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex justify-center items-center text-xs">1</span>
                        Téléchargez l'application "Downloader"
                    </div>
                    <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-5 py-3 rounded-xl font-bold border border-secondary/20 shadow-sm">
                        <span className="bg-secondary text-secondary-foreground w-6 h-6 rounded-full flex justify-center items-center text-xs">2</span>
                        Saisissez le code de votre application
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-x-2 gap-y-8">
                {appsList.map((app: any) => (
                    <ApplicationCard key={app.id} app={app} />
                ))}
            </div>
        </div>
    );
}
