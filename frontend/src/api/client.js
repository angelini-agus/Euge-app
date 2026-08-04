import axios from 'axios'

/**
 * Axios instance pre-configured to point at the backend API.
 * In development, Vite proxies /api to http://localhost:5000,
 * so we can use relative paths in dev and absolute in production.
 *
 * Set VITE_API_URL in Cloudflare Pages env vars for production.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Response interceptor: log errors in dev
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (import.meta.env.DEV) {
      console.error('[API Error]', error.response?.status, error.config?.url, error.message)
    }
    return Promise.reject(error)
  }
)

export default apiClient
