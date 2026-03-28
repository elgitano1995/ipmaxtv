export type CurrencyCode = 'EUR' | 'USD' | 'CAD' | 'MAD' | 'GBP' | 'CHF';

export interface CurrencyConfig {
    code: CurrencyCode;
    symbol: string;
    rate: number; // Exchange rate relative to 1 MAD
    label: string;
}

// Exchange rates relative to 1 MAD (Moroccan Dirham) based on user specs
export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
    MAD: { code: 'MAD', symbol: 'DH', rate: 1.0, label: 'Dirham Marocain' },
    EUR: { code: 'EUR', symbol: '€', rate: 8 / 75, label: 'Euro' }, // User specifies 75 MAD = 8 EUR
    USD: { code: 'USD', symbol: '$', rate: 7.5 / 75, label: 'US Dollar' }, // User specifies 75 MAD = 7.5 USD
    CAD: { code: 'CAD', symbol: 'C$', rate: 0.14, label: 'Canadian Dollar' },
    GBP: { code: 'GBP', symbol: '£', rate: 0.08, label: 'British Pound' },
    CHF: { code: 'CHF', symbol: 'CHF', rate: 0.09, label: 'Swiss Franc' },
};

/**
 * Format a base price (always assumed to be MAD internally) into the target currency.
 */
export function formatPrice(basePriceMad: number, targetCurrency: CurrencyCode): string {
    const config = CURRENCIES[targetCurrency];
    if (!config) return `${basePriceMad} DH`; // Fallback safely

    const converted = basePriceMad * config.rate;

    // Formatting rules:
    // MAD usually doesn't show decimals for exact integer subscriptions.
    if (targetCurrency === 'MAD') {
        return `${Math.ceil(converted)} ${config.symbol}`;
    }

    // Other currencies get exact formatting
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: targetCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(converted);
}
