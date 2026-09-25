/**
 * Format number to Indonesian Rupiah currency string.
 * Example: 100000 -> "Rp100.000"
 */
export function formatCurrency(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'Rp0';
  }
  const formatted = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `Rp${formatted}`;
}

/**
 * Format price range.
 * Example: 20000, 50000 -> "Rp20.000 - Rp50.000" or "Rp20K - Rp50K" (compact)
 */
export function formatPriceRange(min: number, max: number, compact = false): string {
  if (min === 0 && max === 0) {
    return 'Gratis';
  }
  if (compact) {
    const minK = min >= 1000 ? `${Math.round(min / 1000)}K` : `${min}`;
    const maxK = max >= 1000 ? `${Math.round(max / 1000)}K` : `${max}`;
    if (min === max) return `Rp${minK}`;
    return `Rp${minK} - Rp${maxK}`;
  }
  if (min === max) {
    return formatCurrency(min);
  }
  return `${formatCurrency(min)} - ${formatCurrency(max)}`;
}
