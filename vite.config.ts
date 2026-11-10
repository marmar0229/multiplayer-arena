import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 🚀 Captures /createuser, /login, /arena-data and routes them to Express
      '/createuser': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/login': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/arena-data': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
})
