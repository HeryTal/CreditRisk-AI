const FALLBACK_DEV_API_URL = 'http://localhost:5000'
const FALLBACK_PROD_API_URL = 'https://creditrisk-ai.onrender.com'

const rawApiUrl = import.meta.env.VITE_API_URL?.trim()
const fallbackApiUrl = import.meta.env.PROD ? FALLBACK_PROD_API_URL : FALLBACK_DEV_API_URL

export const API_URL = (rawApiUrl || fallbackApiUrl).replace(/\/+$/, '')

if (import.meta.env.PROD && !rawApiUrl) {
  console.warn('VITE_API_URL is missing in production. Using fallback API URL:', API_URL)
}

