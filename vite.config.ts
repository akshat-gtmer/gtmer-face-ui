import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Note: Vite dev server handles SPA fallback automatically.
// For production, ensure your hosting platform (Vercel, Netlify, etc.)
// is configured to serve index.html for all routes (SPA mode).
// Vercel & Netlify do this by default. For Nginx, add: try_files $uri /index.html;
export default defineConfig({
  plugins: [react()],
})
