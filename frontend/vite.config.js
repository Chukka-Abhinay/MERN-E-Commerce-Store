import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // This rule handles your API calls
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // ✅ ADD THIS RULE to handle image requests
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    }
  }
})