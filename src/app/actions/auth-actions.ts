'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(formData: FormData) {
    'use server';
    const password = formData.get('password');
    if (password === 'Periodico1') {
        const cookieStore = await cookies();
        cookieStore.set('adminToken', 'Periodico1', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });
        redirect('/ta7akom');
    } else {
        return { error: 'Mot de passe incorrect' };
    }
}
