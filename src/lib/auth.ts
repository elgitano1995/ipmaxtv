import { redirect } from 'next/navigation';

export function checkAdminAuth(cookies: any) {
    const adminPass = cookies.get('adminToken')?.value;
    if (adminPass !== 'Periodico1') {
        redirect('/ta7akom/login');
    }
}
