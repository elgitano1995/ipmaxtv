'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function FloatingWhatsApp() {
    const [isVisible, setIsVisible] = useState(false);
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '212657901282';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent("Bonjour TV4Watch, je souhaite avoir plus d'informations.")}`;

    useEffect(() => {
        setIsVisible(true);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[99] animate-in fade-in slide-in-from-bottom-5 duration-700">
            <Link
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center justify-center relative hover:-translate-y-1 transition-transform"
            >
                {/* Tooltip */}
                <span className="absolute -top-12 right-0 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                    Contactez-nous
                    <div className="absolute -bottom-1 right-5 w-2 h-2 bg-black rotate-45" />
                </span>

                {/* Button Container */}
                <div className="bg-[#25D366] hover:bg-[#20bd5a] text-white p-4 rounded-full shadow-2xl shadow-[#25D366]/40 flex items-center justify-center relative overflow-hidden transition-colors">
                    {/* Ping Animation overlay */}
                    <div className="absolute inset-0 rounded-full border-2 border-white opacity-20 animate-ping" />

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-8 h-8 fill-current"
                    >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                    </svg>
                </div>
            </Link>
        </div>
    );
}
