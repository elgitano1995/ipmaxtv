'use client';

import { useState } from 'react';
import { Review } from '@/lib/types';
import { addReviewAction, deleteReviewAction } from '@/app/actions/admin-actions';
import { Trash2, Edit, Plus, Star, Calendar } from 'lucide-react';

export default function ReviewManager({ initialReviews }: { initialReviews: Review[] }) {
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [currentReview, setCurrentReview] = useState<Partial<Review>>({
        authorName: '',
        rating: 5,
        comment: '',
        date: new Date().toISOString().split('T')[0]
    });

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const reviewToSave: Review = {
            id: currentReview.id || crypto.randomUUID(),
            authorName: currentReview.authorName || 'Anonyme',
            rating: currentReview.rating || 5,
            comment: currentReview.comment || '',
            date: currentReview.date || new Date().toISOString().split('T')[0]
        };

        const res = await addReviewAction(reviewToSave);

        if (res.success) {
            if (currentReview.id) {
                setReviews(reviews.map(r => r.id === currentReview.id ? reviewToSave : r));
            } else {
                setReviews([reviewToSave, ...reviews]);
            }
            setIsEditing(false);
            setCurrentReview({ authorName: '', rating: 5, comment: '', date: new Date().toISOString().split('T')[0] });
        } else {
            alert("Erreur: " + res.error);
        }

        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Voulez-vous vraiment supprimer cet avis ?')) return;

        setLoading(true);
        const res = await deleteReviewAction(id);
        if (res.success) {
            setReviews(reviews.filter(r => r.id !== id));
        } else {
            alert("Erreur: " + res.error);
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            {!isEditing ? (
                <button
                    onClick={() => setIsEditing(true)}
                    className="w-full py-4 border-2 border-dashed border-border rounded-xl flex items-center justify-center gap-2 text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors bg-card hover:bg-muted/30"
                >
                    <Plus className="w-5 h-5" />
                    <span>Ajouter un avis</span>
                </button>
            ) : (
                <form onSubmit={handleSave} className="bg-muted/10 border border-border rounded-xl p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground">Nom du client</label>
                            <input
                                required
                                value={currentReview.authorName}
                                onChange={e => setCurrentReview({ ...currentReview, authorName: e.target.value })}
                                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                                placeholder="ex: Jean Dupont"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground">Date</label>
                            <input
                                type="date"
                                required
                                value={currentReview.date}
                                onChange={e => setCurrentReview({ ...currentReview, date: e.target.value })}
                                className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground">Note (Étoiles)</label>
                        <select
                            value={currentReview.rating}
                            onChange={e => setCurrentReview({ ...currentReview, rating: parseInt(e.target.value) })}
                            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                        >
                            {[5, 4, 3, 2, 1].map(num => (
                                <option key={num} value={num}>{num} Étoiles</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-muted-foreground">Commentaire</label>
                        <textarea
                            required
                            value={currentReview.comment}
                            onChange={e => setCurrentReview({ ...currentReview, comment: e.target.value })}
                            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                            rows={3}
                            placeholder="Avis du client..."
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => {
                                setIsEditing(false);
                                setCurrentReview({ authorName: '', rating: 5, comment: '', date: new Date().toISOString().split('T')[0] });
                            }}
                            className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-3">
                {reviews.length === 0 ? (
                    <p className="text-sm text-muted-foreground italic text-center py-4">Aucun avis enregistré.</p>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className="bg-card border border-border rounded-xl p-4 flex gap-4 group">
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-bold text-sm tracking-tight">{review.authorName}</h4>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(review.date).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted'}`} />
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground italic leading-relaxed line-clamp-2">
                                    "{review.comment}"
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 justify-start border-l border-border pl-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => {
                                        setCurrentReview(review);
                                        setIsEditing(true);
                                    }}
                                    className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(review.id)}
                                    className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
