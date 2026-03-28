'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CurrencyCode, CURRENCIES } from '@/lib/currency';

interface CurrencyContextType {
    currency: CurrencyCode;
    setCurrency: (code: CurrencyCode) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrencyState] = useState<CurrencyCode>('EUR');
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // Load preference from localStorage
        const stored = localStorage.getItem('ipmaxtv_currency');
        if (stored && CURRENCIES[stored as CurrencyCode]) {
            setCurrencyState(stored as CurrencyCode);
        } else {
            // Attempt to guess by locale if needed, but EUR is safe default
            setCurrencyState('EUR');
        }
    }, []);

    const setCurrency = (code: CurrencyCode) => {
        setCurrencyState(code);
        localStorage.setItem('ipmaxtv_currency', code);
    };

    // Prevent hydration mismatch by blocking render or returning a default 
    // Usually, we return the tree but standard EUR on server.
    // To prevent flashing, we just use the default until mounted.
    return (
        <CurrencyContext.Provider value={{ currency: isMounted ? currency : 'EUR', setCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
