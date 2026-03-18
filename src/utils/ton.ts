/**
 * Convert nanoton (string or number) to TON display string.
 * 1 TON = 1_000_000_000 nanoton
 */
export function nanotonToTon(nanoton: string | number): string {
  const nano = typeof nanoton === 'string' ? BigInt(nanoton) : BigInt(nanoton);
  const whole = nano / BigInt(1_000_000_000);
  const frac = nano % BigInt(1_000_000_000);
  const fracStr = frac.toString().padStart(9, '0').replace(/0+$/, '');
  if (fracStr === '') return whole.toString();
  return `${whole}.${fracStr}`;
}

/**
 * Convert TON to nanoton string for transactions.
 */
export function tonToNanoton(ton: number): string {
  return Math.floor(ton * 1_000_000_000).toString();
}

/**
 * Format TON amount for display.
 */
export function formatTon(nanoton: string | number): string {
  return `${nanotonToTon(nanoton)} TON`;
}
