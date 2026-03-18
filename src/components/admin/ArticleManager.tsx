'use client';

import { useState, useTransition } from 'react';
import { Article } from '@/lib/types';
import { Plus, PenLine, Trash2, X, Download, Save, Link2, KeySquare } from 'lucide-react';
import { addArticleAction, deleteArticleAction } from '@/app/actions/admin-actions';

export default function ArticleManager({ initialArticles }: { initialArticles: Article[] }) {
    const [articles, setArticles] = useState<Article[]>(initialArticles || []);
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);

    // Form states
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [author, setAuthor] = useState('IPMaxTV Expert');
    const [keywordsInput, setKeywordsInput] = useState('');

    const resetForm = () => {
        setEditingArticle(null);
        setTitle('');
        setSlug('');
        setExcerpt('');
        setContent('');
        setCoverImage('');
        setAuthor('IPMaxTV Expert');
        setKeywordsInput('');
        setIsModalOpen(false);
    };

    const handleOpenEdit = (article: Article) => {
        setEditingArticle(article);
        setTitle(article.title);
        setSlug(article.slug);
        setExcerpt(article.excerpt);
        setContent(article.content);
        setCoverImage(article.coverImage);
        setAuthor(article.author);
        setKeywordsInput(article.keywords ? article.keywords.join(', ') : '');
        setIsModalOpen(true);
    };

    const generateSlug = (text: string) => {
        return text.toLowerCase().trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
        if (!editingArticle) {
            setSlug(generateSlug(e.target.value));
        }
    };

    const handleSave = async () => {
        if (!title.trim() || !content.trim()) {
            alert('Le titre et le contenu sont obligatoires.');
            return;
        }

        const keywordsArray = keywordsInput.split(',').map(k => k.trim()).filter(k => k.length > 0);

        const newArticle: Article = {
            id: editingArticle ? editingArticle.id : crypto.randomUUID(),
            slug: slug || generateSlug(title),
            title,
            excerpt,
            content,
            coverImage: coverImage.trim() || '/icon.svg',
            author,
            date: editingArticle ? editingArticle.date : new Date().toISOString().split('T')[0],
            keywords: keywordsArray
        };

        // Optimistic UI updates
        if (editingArticle) {
            setArticles(articles.map(a => a.id === newArticle.id ? newArticle : a));
        } else {
            setArticles([...articles, newArticle]);
        }

        setIsModalOpen(false);

        // Server action
        startTransition(async () => {
            const result = await addArticleAction(newArticle);
            if (!result.success) {
                alert(`Erreur: ${result.error}`);
                // Simple rollback
                setArticles(initialArticles);
            }
        });
    };

    const handleDelete = async (articleId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cet article définitivement ?')) return;

        // Optimistic update
        setArticles(articles.filter(a => a.id !== articleId));

        startTransition(async () => {
            const result = await deleteArticleAction(articleId);
            if (!result.success) {
                alert(`Erreur: ${result.error}`);
                // Simple rollback
                setArticles(initialArticles);
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
                <p className="text-muted-foreground text-sm flex items-center gap-2">
                    <PenLine className="w-4 h-4" /> Gérez vos articles de blog SEO
                </p>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
                >
                    <Plus className="w-4 h-4" /> Nouvel Article
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {articles.map((article) => (
                    <div key={article.id} className="bg-card border border-border rounded-2xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden group">
                        <div className="flex gap-4 mb-4 z-10">
                            {article.coverImage && (
                                <div className="w-20 h-20 shrink-0 bg-muted rounded-xl overflow-hidden relative">
                                    <img src={article.coverImage} alt="" className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div>
                                <h3 className="font-bold text-base leading-tight mb-1">{article.title}</h3>
                                <div className="text-xs text-muted-foreground font-mono bg-muted inline-flex px-2 py-0.5 rounded border border-border">/{article.slug}</div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50 z-10">
                            <span className="text-xs text-muted-foreground">{article.date}</span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleOpenEdit(article)}
                                    className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors border border-transparent hover:border-primary/20"
                                    title="Modifier"
                                >
                                    <PenLine className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(article.id)}
                                    className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors border border-transparent hover:border-destructive/20"
                                    title="Supprimer"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit/Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-card border border-border rounded-3xl w-full max-w-4xl shadow-2xl relative my-8">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20 rounded-t-3xl sticky top-0 z-10">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <PenLine className="w-6 h-6 text-primary" />
                                {editingArticle ? 'Modifier l\'Article' : 'Créer un Article'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 bg-muted hover:bg-muted/80 rounded-full transition-colors text-muted-foreground hover:text-foreground">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 md:p-8 space-y-8 h-[70vh] overflow-y-auto">
                            
                            {/* Basics Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-muted-foreground ml-1">Titre de l'Article (SEO)</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={handleTitleChange}
                                        placeholder="Ex: Top 5 de l'IPTV..."
                                        className="w-full bg-background border border-input rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-foreground font-medium"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-muted-foreground ml-1 flex items-center gap-1"><Link2 className="w-3 h-3"/> Slug (URL)</label>
                                    <input
                                        type="text"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="mon-article-seo"
                                        className="w-full bg-muted/50 border border-input rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono text-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground ml-1">L'Extrait (Meta Description Google)</label>
                                <textarea
                                    value={excerpt}
                                    onChange={(e) => setExcerpt(e.target.value)}
                                    placeholder="Un résumé impactant de 2 lignes..."
                                    className="w-full bg-background border border-input rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none min-h-[80px] resize-y"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground ml-1">Le Contenu de l'Article (Supporte Markdown)</label>
                                <div className="p-2 bg-muted/30 rounded-t-xl border border-b-0 border-border text-xs text-muted-foreground flex gap-4 font-mono">
                                    <span>## Titre H2</span>
                                    <span>### Titre H3</span>
                                    <span>**Gras**</span>
                                    <span>[Lien](url)</span>
                                </div>
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder="Écrivez votre contenu ici..."
                                    className="w-full bg-background border border-input rounded-b-xl px-4 py-4 focus:border-primary focus:ring-1 focus:ring-primary outline-none min-h-[350px] resize-y shadow-inner font-mono text-sm"
                                />
                            </div>

                            {/* SEO Meta Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-muted-foreground ml-1 flex items-center gap-1"><KeySquare className="w-3 h-3"/> Mots Clés</label>
                                    <input
                                        type="text"
                                        value={keywordsInput}
                                        onChange={(e) => setKeywordsInput(e.target.value)}
                                        placeholder="iptv, smart tv, tuto..."
                                        className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-muted-foreground ml-1">Auteur</label>
                                    <input
                                        type="text"
                                        value={author}
                                        onChange={(e) => setAuthor(e.target.value)}
                                        placeholder="Auteur"
                                        className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-muted-foreground ml-1">Image (URL)</label>
                                    <input
                                        type="text"
                                        value={coverImage}
                                        onChange={(e) => setCoverImage(e.target.value)}
                                        placeholder="/apps/logo.png"
                                        className="w-full bg-background border border-input rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 border-t border-border bg-muted/10 rounded-b-3xl flex justify-end gap-3 sticky bottom-0 z-10">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-3 font-medium rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                                disabled={isPending}
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isPending}
                                className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                            >
                                {isPending ? <span className="animate-pulse">Sauvegarde...</span> : <><Save className="w-4 h-4" /> Publier l'Article</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
