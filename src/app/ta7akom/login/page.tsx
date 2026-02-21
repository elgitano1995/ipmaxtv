'use client';

import { useState } from 'react';
import { loginAction } from '@/app/actions/auth-actions';
import { LockKeyhole, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const result = await loginAction(formData);

        if (result?.error) {
            setError(result.error);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 absolute inset-0 z-50">
            <div className="w-full max-w-sm">

                <div className="text-center mb-8">
                    <div className="inline-flex bg-primary/20 p-3 rounded-2xl mb-4 text-primary">
                        <LockKeyhole className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Accès Sécurisé</h1>
                    <p className="text-muted-foreground mt-2 text-sm">Veuillez vous identifier pour accéder au panneau de contrôle.</p>
                </div>

                <div className="bg-card border border-border shadow-2xl rounded-3xl p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {error && (
                            <div className="bg-destructive/10 text-destructive text-sm font-medium px-4 py-3 rounded-xl border border-destructive/20 text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground ml-1" htmlFor="password">Code d&apos;accès</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                disabled={isLoading}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-base focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Vérification...
                                </>
                            ) : (
                                "Déverrouiller"
                            )}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}
