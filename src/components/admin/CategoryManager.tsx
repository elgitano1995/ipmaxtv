'use client';

import { useState, useEffect, useId } from 'react';
import { Category } from '@/lib/types';
import { addCategoryAction, reorderCategoriesAction } from '@/app/actions/admin-actions';
import { Plus, GripVertical, Trash2, Eye, EyeOff } from 'lucide-react';
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

function SortableCategoryItem({ category, onToggle, onDelete }: { category: Category, onToggle: (c: Category) => void, onDelete: (id: string) => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: category.id });

    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div ref={setNodeRef} style={style} className="flex items-center justify-between p-3 bg-card border border-border rounded-xl mb-2 group">
            <div className="flex items-center gap-3 flex-1">
                <button {...attributes} {...listeners} className="cursor-grab text-muted-foreground hover:text-foreground">
                    <GripVertical className="w-4 h-4" />
                </button>
                <span className="font-medium text-sm">{category.name}</span>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => onToggle(category)} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors" title="Visibilité site">
                    {category.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
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

    const handleDelete = async (id: string) => {
        // Basic array filter, in realistic scenario needs backend delete too.
        // For demo, we just remove and re-sync order.
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
                                    onToggle={handleToggle}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
}
