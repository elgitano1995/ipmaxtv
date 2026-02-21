import { Product, Category, Review } from './types';
import fs from 'fs/promises';
import path from 'path';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO; // Format: username/repo
const BRANCH = process.env.GITHUB_BRANCH || 'v0';

/**
 * Helper to get the raw JSON from GitHub or local fallback if token is missing.
 */
async function fetchGithubFile<T>(filePath: string, defaultData: T): Promise<T> {
    if (!GITHUB_TOKEN || !GITHUB_REPO) {
        console.warn(`[GitHub API] Missing credentials. Falling back to local read for ${filePath}`);
        try {
            const localPath = path.join('/tmp', filePath);
            const data = await fs.readFile(localPath, 'utf-8');
            return JSON.parse(data) as T;
        } catch {
            return defaultData;
        }
    }

    try {
        const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}?ref=${BRANCH}`, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3.raw',
            },
            next: { tags: [filePath] }, // For Next.js cache revalidation
            cache: 'no-store',
        });

        if (!res.ok) {
            if (res.status === 404) return defaultData;
            throw new Error(`Failed to fetch ${filePath} from GitHub`);
        }

        const data = await res.text();
        return JSON.parse(data) as T;
    } catch (error) {
        console.error(`[GitHub API] Error fetching ${filePath}:`, error);
        return defaultData;
    }
}

/**
 * Commits a file to GitHub via the REST API.
 */
export async function commitGithubFile(filePath: string, content: any, message: string): Promise<boolean> {
    const jsonContent = JSON.stringify(content, null, 2);

    // Always write to /tmp/ for local fast persistence (as required)
    const localPath = path.join('/tmp', filePath);
    await fs.mkdir(path.dirname(localPath), { recursive: true });
    await fs.writeFile(localPath, jsonContent, 'utf-8');

    if (!GITHUB_TOKEN || !GITHUB_REPO) {
        console.warn(`[GitHub API] Missing credentials. Only saved locally to ${localPath}`);
        return true;
    }

    try {
        // 1. Get the current file SHA (required to update)
        let sha: string | undefined;
        const resSha = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}?ref=${BRANCH}`, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json',
            },
            cache: 'no-store'
        });

        if (resSha.ok) {
            const fileData = await resSha.json();
            sha = fileData.sha;
        }

        // 2. Commit the new content
        const base64Content = Buffer.from(jsonContent, 'utf-8').toString('base64');

        const resCommit = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: 'application/vnd.github.v3+json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                content: base64Content,
                sha,
                branch: BRANCH,
            }),
        });

        if (!resCommit.ok) {
            const err = await resCommit.json();
            throw new Error(`Failed to commit ${filePath}: ${err.message}`);
        }

        return true;
    } catch (error) {
        console.error(`[GitHub API] Error committing ${filePath}:`, error);
        return false;
    }
}

// Data Accessors
export const getProducts = () => fetchGithubFile<Product[]>('data/products.json', []);
export const getCategories = () => fetchGithubFile<Category[]>('data/categories.json', []);
export const getReviews = () => fetchGithubFile<Review[]>('data/reviews.json', []);

export const saveProducts = (products: Product[]) => commitGithubFile('data/products.json', products, 'Update products.json');
export const saveCategories = (categories: Category[]) => commitGithubFile('data/categories.json', categories, 'Update categories.json');
export const saveReviews = (reviews: Review[]) => commitGithubFile('data/reviews.json', reviews, 'Update reviews.json');
