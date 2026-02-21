'use client';

import { useState } from 'react';
import { Product, Category, ProductVariant } from '@/lib/types';
import { addProductStatusAction, deleteProductAction } from '@/app/actions/admin-actions';
import { Plus, Trash2, Save, X } from 'lucide-react';

export default function ProductForm({
    initialProducts,
    categories
}: {
    initialProducts: Product[];
    categories: Category[];
}) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '', categoryId: '', description: '', imageUrl: '', features: [], keywords: [], variants: [],
        isBestSeller: false, isStable: false, metaTitle: '', metaDescription: ''
    });

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsCreating(false);
        setFormData(product);
    };

    const handleNew = () => {
        setEditingProduct(null);
        setIsCreating(true);
        setFormData({
            id: crypto.randomUUID(), name: '', categoryId: categories[0]?.id || '',
            description: '', imageUrl: '', features: [], keywords: [], variants: [],
            isBestSeller: false, isStable: false, metaTitle: '', metaDescription: ''
        });
    };

    const addVariant = () => {
        setFormData(prev => ({
            ...prev,
            variants: [...(prev.variants || []), { id: crypto.randomUUID(), duration: '', price: '' }]
        }));
    };

    const updateVariant = (id: string, field: keyof ProductVariant, value: string) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants?.map(v => v.id === id ? { ...v, [field]: value } : v)
        }));
    };

    const removeVariant = (id: string) => {
        setFormData(prev => ({
            ...prev,
            variants: prev.variants?.filter(v => v.id !== id)
        }));
    };

    const addFeature = () => {
        setFormData(prev => ({ ...prev, features: [...(prev.features || []), ''] }));
    };

    const updateFeature = (index: number, value: string) => {
        setFormData(prev => {
            const newF = [...(prev.features || [])];
            newF[index] = value;
            return { ...prev, features: newF };
        });
    };

    const removeFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features?.filter((_, i) => i !== index)
        }));
    };

    const addKeyword = () => {
        setFormData(prev => ({ ...prev, keywords: [...(prev.keywords || []), ''] }));
    };

    const updateKeyword = (index: number, value: string) => {
        setFormData(prev => {
            const newK = [...(prev.keywords || [])];
            newK[index] = value;
            return { ...prev, keywords: newK };
        });
    };

    const removeKeyword = (index: number) => {
        setFormData(prev => ({
            ...prev,
            keywords: prev.keywords?.filter((_, i) => i !== index)
        }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.categoryId) return alert("Nom et Catégorie requis.");

        setIsSaving(true);
        const productToSave = formData as Product;

        const res = await addProductStatusAction(productToSave);
        if (res.success) {
            if (editingProduct) {
                setProducts(products.map(p => p.id === productToSave.id ? productToSave : p));
            } else {
                setProducts([...products, productToSave]);
            }
            setFormData({ name: '' });
            setEditingProduct(null);
            setIsCreating(false);
        } else {
            alert("Erreur de sauvegarde : " + res.error);
        }
        setIsSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Supprimer ce produit ?')) return;
        const res = await deleteProductAction(id);
        if (res.success) {
            setProducts(products.filter(p => p.id !== id));
        } else {
            alert("Erreur : " + res.error);
        }
    };

    return (
        <div className="space-y-8">
            {!isCreating && !editingProduct ? (
                <div className="space-y-4">
                    <div className="flex justify-end">
                        <button onClick={handleNew} className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 font-medium">
                            <Plus className="w-4 h-4" /> Ajouter Produit
                        </button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {products.map(p => (
                            <div key={p.id} className="flex items-center justify-between p-4 border border-border rounded-xl hover:border-primary/50 transition-colors">
                                <div>
                                    <h4 className="font-bold">{p.name}</h4>
                                    <p className="text-sm text-muted-foreground">{categories.find(c => c.id === p.categoryId)?.name || 'Sans Catégorie'} • {p.variants?.length || 0} Variantes</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(p)} className="px-4 py-2 text-sm font-medium bg-muted hover:bg-muted/80 rounded-lg">Modifier</button>
                                    <button onClick={() => handleDelete(p.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSave} className="space-y-6 bg-muted/10 p-6 rounded-2xl border border-border">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <h3 className="text-lg font-bold">{editingProduct ? 'Modifier Produit' : 'Nouveau Produit'}</h3>
                        <button type="button" onClick={() => { setFormData({ name: '' }); setEditingProduct(null); setIsCreating(false); }} className="p-2 hover:bg-muted rounded-full">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Nom *</label>
                            <input required value={formData.name || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="ex: Dino IPTV 4K" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Catégorie *</label>
                            <select required value={formData.categoryId || ''} onChange={e => setFormData({ ...formData, categoryId: e.target.value })} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none">
                                <option value="">Sélectionner</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium mb-1">Description courte</label>
                            <textarea value={formData.description || ''} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" rows={2} />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium mb-1">Image URL</label>
                            <input value={formData.imageUrl || ''} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none" placeholder="https://..." />
                        </div>
                        <div className="flex items-center gap-6 mt-2">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="checkbox" checked={formData.isBestSeller || false} onChange={e => setFormData({ ...formData, isBestSeller: e.target.checked })} className="rounded bg-card border-border text-primary focus:ring-primary" />
                                Best Seller
                            </label>
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input type="checkbox" checked={formData.isStable || false} onChange={e => setFormData({ ...formData, isStable: e.target.checked })} className="rounded bg-card border-border text-primary focus:ring-primary" />
                                100% Stable
                            </label>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border">
                        <h4 className="font-semibold flex justify-between items-center">
                            Tarification (Variantes)
                            <button type="button" onClick={addVariant} className="text-primary text-sm flex items-center gap-1 hover:underline"><Plus className="w-3 h-3" /> Ajouter</button>
                        </h4>
                        {formData.variants?.map((v) => (
                            <div key={v.id} className="flex gap-2 items-center">
                                <input value={v.duration} onChange={e => updateVariant(v.id, 'duration', e.target.value)} placeholder="Durée (ex: 12 Mois)" className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm" />
                                <input value={v.price} onChange={e => updateVariant(v.id, 'price', e.target.value)} placeholder="Prix (ex: 35€)" className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm" />
                                <button type="button" onClick={() => removeVariant(v.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-md"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border">
                        <h4 className="font-semibold flex justify-between items-center">
                            Caractéristiques
                            <button type="button" onClick={addFeature} className="text-primary text-sm flex items-center gap-1 hover:underline"><Plus className="w-3 h-3" /> Ajouter</button>
                        </h4>
                        {formData.features?.map((f, i) => (
                            <div key={i} className="flex gap-2 items-center">
                                <input value={f} onChange={e => updateFeature(i, e.target.value)} placeholder="VOD 4K incluse..." className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm" />
                                <button type="button" onClick={() => removeFeature(i)} className="p-2 text-destructive hover:bg-destructive/10 rounded-md"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border">
                        <h4 className="font-semibold">Balisage SEO</h4>
                        <div>
                            <label className="block text-sm font-medium mb-1">Méta Titre</label>
                            <input value={formData.metaTitle || ''} onChange={e => setFormData({ ...formData, metaTitle: e.target.value })} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Méta Description</label>
                            <textarea value={formData.metaDescription || ''} onChange={e => setFormData({ ...formData, metaDescription: e.target.value })} className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm" rows={2} />
                        </div>
                        <div className="pt-2">
                            <label className="text-sm font-medium flex justify-between items-center mb-2">
                                Mots-clés SEO
                                <button type="button" onClick={addKeyword} className="text-primary text-xs flex items-center gap-1 hover:underline"><Plus className="w-3 h-3" /> Ajouter</button>
                            </label>
                            <div className="space-y-2">
                                {formData.keywords?.map((k, i) => (
                                    <div key={i} className="flex gap-2 items-center">
                                        <input value={k} onChange={e => updateKeyword(i, e.target.value)} placeholder="ex: serveur iptv 4k" className="w-full bg-card border border-border rounded-lg px-3 py-1.5 text-sm" />
                                        <button type="button" onClick={() => removeKeyword(i)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded-md"><Trash2 className="w-4 h-4" /></button>
                                    </div>
                                ))}
                                {(!formData.keywords || formData.keywords.length === 0) && (
                                    <p className="text-xs text-muted-foreground italic">Aucun mot-clé défini.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={() => { setFormData({ name: '' }); setEditingProduct(null); setIsCreating(false); }} className="px-4 py-2 text-sm font-medium hover:bg-muted rounded-lg">Annuler</button>
                        <button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-lg flex items-center gap-2 font-bold disabled:opacity-50">
                            <Save className="w-4 h-4" /> {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
