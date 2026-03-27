let cachedRate: number | null = null
let lastFetched: number | null = null
const CACHE_DURATION = 1000 * 60 * 60 // 1 hour

export async function getUsdToNgnRate(): Promise<number> {
  const now = Date.now()
  if (cachedRate && lastFetched && now - lastFetched < CACHE_DURATION) {
    return cachedRate
  }

  try {
    // You can replace this with your preferred exchange rate API
    // e.g., https://open.er-api.com/v6/latest/USD
    // Or a specific Nigerian endpoint if you need black market rates
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
    const data = await response.json()

    if (data && data.rates && data.rates.NGN) {
      cachedRate = data.rates.NGN
      lastFetched = now
      return cachedRate as number
    }
  }
  catch (error) {
    console.error('Failed to fetch exchange rate:', error)
  }

  // Fallback rate if API fails (update this to a reasonable default or throw)
  return cachedRate || 1500
}

export function convertUsdToNgn(usdAmount: number, rate: number): number {
  return usdAmount * rate
}
