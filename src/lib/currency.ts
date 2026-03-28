export type CurrencyCode = 'EUR' | 'USD' | 'CAD' | 'MAD' | 'GBP' | 'CHF';

export interface CurrencyConfig {
    code: CurrencyCode;
    symbol: string;
    rate: number; // Exchange rate relative to 1 EUR
    label: string;
}

// Exchange rates (Static fallback - relatively typical values for 2026)
export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
    EUR: { code: 'EUR', symbol: '€', rate: 1.0, label: 'Euro' },
    USD: { code: 'USD', symbol: '$', rate: 1.09, label: 'US Dollar' },
    CAD: { code: 'CAD', symbol: 'C$', rate: 1.48, label: 'Canadian Dollar' },
    GBP: { code: 'GBP', symbol: '£', rate: 0.85, label: 'British Pound' },
    CHF: { code: 'CHF', symbol: 'CHF', rate: 0.95, label: 'Swiss Franc' },
    MAD: { code: 'MAD', symbol: 'DH', rate: 10.85, label: 'Dirham Marocain' },
};

/**
 * Format a base price (always assumed to be EUR internally) into the target currency.
 */
export function formatPrice(basePriceEur: number, targetCurrency: CurrencyCode): string {
    const config = CURRENCIES[targetCurrency];
    if (!config) return `${basePriceEur}€`; // Fallback safely

    const converted = basePriceEur * config.rate;

    // Formatting rules: 
    // MAD usually doesn't show decimals for standard large purchases, but we'll keep 2 everywhere for consistency,
    // or round gracefully if it's MAD.
    if (targetCurrency === 'MAD') {
        return `${Math.ceil(converted)} ${config.symbol}`;
    }

    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: targetCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(converted);
}
