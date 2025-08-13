import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Detectar el entorno de despliegue
const base = process.env.GITHUB_ACTIONS 
  ? '/hockey-player-management/' // GitHub Pages
  : '/' // Vercel/Netlify

export default defineConfig({
  plugins: [react()],
  base: base,
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
