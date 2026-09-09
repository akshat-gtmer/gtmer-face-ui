/**
 * Central API configuration
 * 
 * - In browser environments (both Vercel production and Vite dev server),
 *   relative '/api/v1' is used and proxied to 'https://dev.gtmer.ai/api/v1'.
 *   This eliminates browser CORS preflight blocks because requests are same-origin.
 * - For full-page redirects (OAuth / SSO login), BACKEND_URL ('https://dev.gtmer.ai') is used.
 */

export const BACKEND_URL = 'https://dev.gtmer.ai'
export const API_BASE = '/api/v1'
