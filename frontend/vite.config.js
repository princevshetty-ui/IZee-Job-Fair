import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // This allows the dev server to accept the Railway domain
    allowedHosts: true,
    proxy: {
      '/api': {
        // Use your environment variable here instead of hardcoding localhost
        target: process.env.VITE_API_URL || 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  preview: {
    // This allows the preview server (often used in production starts) to accept the domain
    allowedHosts: true,
  }
})