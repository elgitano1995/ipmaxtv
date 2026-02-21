'use server';

import { revalidatePath } from 'next/cache';
import { Product, Category, Review } from '@/lib/types';
import { getProducts, getCategories, getReviews, saveProducts, saveCategories, saveReviews } from '@/lib/github-api';

export async function addProductStatusAction(product: Product) {
    try {
        const products = await getProducts();
        const existingIndex = products.findIndex((p) => p.id === product.id);

        if (existingIndex >= 0) {
            products[existingIndex] = product;
        } else {
            products.push(product);
        }

        const success = await saveProducts(products);
        if (!success) {
            return { success: false, error: 'Failed to save product.' };
        }

        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteProductAction(productId: string) {
    try {
        const products = await getProducts();
        const newProducts = products.filter((p) => p.id !== productId);

        const success = await saveProducts(newProducts);
        if (!success) {
            return { success: false, error: 'Failed to delete product.' };
        }

        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function addCategoryAction(category: Category) {
    try {
        const categories = await getCategories();
        const existingIndex = categories.findIndex((c) => c.id === category.id);

        if (existingIndex >= 0) {
            categories[existingIndex] = category;
        } else {
            categories.push(category);
        }

        const success = await saveCategories(categories);
        if (!success) {
            return { success: false, error: 'Failed to save category.' };
        }

        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function reorderCategoriesAction(categories: Category[]) {
    try {
        const success = await saveCategories(categories);
        if (!success) {
            return { success: false, error: 'Failed to save categories order.' };
        }

        // Removed revalidatePath here to prevent the drag-and-drop hot reload loop
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function addReviewAction(review: Review) {
    try {
        const reviews = await getReviews();
        const existingIndex = reviews.findIndex((r) => r.id === review.id);

        if (existingIndex >= 0) {
            reviews[existingIndex] = review;
        } else {
            reviews.push(review);
        }

        const success = await saveReviews(reviews);
        if (!success) {
            return { success: false, error: 'Failed to save review.' };
        }

        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteReviewAction(reviewId: string) {
    try {
        const reviews = await getReviews();
        const newReviews = reviews.filter((r) => r.id !== reviewId);

        const success = await saveReviews(newReviews);
        if (!success) {
            return { success: false, error: 'Failed to delete review.' };
        }

        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
