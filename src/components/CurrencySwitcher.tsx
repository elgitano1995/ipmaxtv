'use client';

import * as React from 'react';
import { useCurrency } from './CurrencyProvider';
import { CURRENCIES, CurrencyCode } from '@/lib/currency';

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();
  const currentConfig = CURRENCIES[currency];

  return (
    <div className="relative inline-flex items-center">
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
        className="h-9 appearance-none bg-card border border-border text-foreground text-sm font-medium rounded-md pl-3 pr-8 hover:bg-muted transition-colors focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer"
        aria-label="Select Currency"
      >
        {Object.values(CURRENCIES).map((config) => (
          <option key={config.code} value={config.code}>
            {config.code} ({config.symbol})
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-muted-foreground">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
}
