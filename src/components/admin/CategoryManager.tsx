'use client';

import { useState, useEffect, useId } from 'react';
import { Category } from '@/lib/types';
import { addCategoryAction, reorderCategoriesAction, deleteCategoryAction } from '@/app/actions/admin-actions';
import { Plus, GripVertical, Trash2, Eye, EyeOff, Pencil, Check, X, PanelTop } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableCategoryItem({ category, onToggleVisibility, onToggleHeader, onDelete, onUpdateName }: { category: Category, onToggleVisibility: (c: Category) => void, onToggleHeader: (c: Category) => void, onDelete: (id: string) => void, onUpdateName: (id: string, newName: string) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: category.id });
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(category.name);

    const style = { transform: CSS.Transform.toString(transform), transition };

    const handleSave = () => {
        if(editName.trim() && editName !== category.name) {
            onUpdateName(category.id, editName.trim());
        } else {
            setEditName(category.name);
        }
        setIsEditing(false);
    }

    return (
        <div ref={setNodeRef} style={style} className="flex items-center justify-between p-3 bg-card border border-border rounded-xl mb-2 group">
            <div className="flex items-center gap-3 flex-1">
                <button {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground">
                    <GripVertical className="w-4 h-4" />
                </button>
                {isEditing ? (
                    <div className="flex items-center gap-2 flex-1 relative z-50">
                        <input autoFocus value={editName} onChange={e => setEditName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSave()} className="flex-1 bg-background border border-border rounded-md px-2 py-1 text-sm focus:ring-1 focus:ring-primary outline-none" />
                        <button onClick={handleSave} className="p-1 text-emerald-500 hover:bg-emerald-500/10 rounded-md transition-colors"><Check className="w-4 h-4" /></button>
                        <button onClick={() => { setEditName(category.name); setIsEditing(false); }} className="p-1 text-rose-500 hover:bg-rose-500/10 rounded-md transition-colors"><X className="w-4 h-4" /></button>
                    </div>
                ) : (
                    <span className="font-medium text-sm flex-1">{category.name}</span>
                )}
            </div>
            <div className="flex items-center gap-2">
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors" title="Renommer">
                        <Pencil className="w-4 h-4" />
                    </button>
                )}
                <button onClick={() => onToggleHeader(category)} className={`p-1.5 rounded-md transition-colors ${category.showInHeader ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`} title="Afficher dans le menu">
                    <PanelTop className="w-4 h-4" />
                </button>
                <button onClick={() => onToggleVisibility(category)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors" title="Visibilité section page d'accueil">
                    {category.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                <button onClick={() => { if(confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) onDelete(category.id); }} className="p-1.5 text-rose-500/70 hover:text-rose-500 hover:bg-rose-500/10 rounded-md transition-colors" title="Supprimer">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
    const [categories, setCategories] = useState<Category[]>([...initialCategories].sort((a, b) => a.order - b.order));
    const [newCatName, setNewCatName] = useState('');
    const dndId = useId();

    useEffect(() => {
        setCategories([...initialCategories].sort((a, b) => a.order - b.order));
    }, [initialCategories]);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCatName.trim()) return;

        const newCat: Category = {
            id: crypto.randomUUID(),
            name: newCatName.trim(),
            isVisible: true,
            showInHeader: false,
            order: categories.length
        };

        const res = await addCategoryAction(newCat);
        if (res.success) {
            setCategories([...categories, newCat]);
            setNewCatName('');
        } else {
            alert("Erreur d'ajout : " + res.error);
        }
    };

    const handleToggle = async (cat: Category) => {
        const updated = { ...cat, isVisible: !cat.isVisible };
        const res = await addCategoryAction(updated);
        if (res.success) {
            setCategories(categories.map(c => c.id === cat.id ? updated : c));
        }
    };

    const handleToggleHeader = async (cat: Category) => {
        const updated = { ...cat, showInHeader: !cat.showInHeader };
        const res = await addCategoryAction(updated);
        if (res.success) {
            setCategories(categories.map(c => c.id === cat.id ? updated : c));
        }
    };

    const handleUpdateName = async (id: string, newName: string) => {
        const cat = categories.find(c => c.id === id);
        if (!cat) return;
        const updated = { ...cat, name: newName };
        const res = await addCategoryAction(updated);
        if (res.success) {
            setCategories(categories.map(c => c.id === id ? updated : c));
        } else {
            alert("Erreur de modification : " + res.error);
        }
    };

    const handleDelete = async (id: string) => {
        const res = await deleteCategoryAction(id);
        if (res.success) {
            setCategories(categories.filter(c => c.id !== id));
        } else {
            alert("Erreur de suppression : " + res.error);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = categories.findIndex(c => c.id === active.id);
            const newIndex = categories.findIndex(c => c.id === over?.id);

            const newArr = arrayMove(categories, oldIndex, newIndex);
            // Update order property
            const reordered = newArr.map((c, i) => ({ ...c, order: i }));
            setCategories(reordered);

            // Persist new order
            await reorderCategoriesAction(reordered);
        }
    };

    return (
        <div className="space-y-6">
            <form onSubmit={handleAdd} className="flex gap-2">
                <input
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    placeholder="Nouvelle catégorie..."
                    className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none"
                />
                <button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-lg">
                    <Plus className="w-5 h-5" />
                </button>
            </form>

            {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground italic text-center py-4">Aucune catégorie.</p>
            ) : (
                <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={categories} strategy={verticalListSortingStrategy}>
                        <div>
                            {categories.map(cat => (
                                <SortableCategoryItem
                                    key={cat.id}
                                    category={cat}
                                    onToggleVisibility={handleToggle}
                                    onToggleHeader={handleToggleHeader}
                                    onDelete={handleDelete}
                                    onUpdateName={handleUpdateName}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
}
