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

/**
 * Fetch TON price in USD from CoinGecko.
 */
let cachedPrice: { usd: number; ts: number } | null = null;

export async function getTonUsdPrice(): Promise<number> {
  if (cachedPrice && Date.now() - cachedPrice.ts < 60_000) return cachedPrice.usd;
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd');
    const data = await res.json();
    const usd = data['the-open-network']?.usd ?? 0;
    cachedPrice = { usd, ts: Date.now() };
    return usd;
  } catch {
    return cachedPrice?.usd ?? 0;
  }
}

/**
 * Convert nanoton to USD string.
 */
export function nanotonToUsd(nanoton: string | number, tonPrice: number): string {
  const ton = Number(nanotonToTon(nanoton));
  const usd = ton * tonPrice;
  return usd < 0.01 ? '<$0.01' : `$${usd.toFixed(2)}`;
}
