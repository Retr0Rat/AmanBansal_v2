import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // '/' for Vercel — update sitemap, robots.txt, and canonical in index.html to match
  base: '/',

  server: {
    host: true,
    port: 5173,
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
    },
  },

  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) return 'vendor'
          if (id.includes('node_modules/react-router-dom')) return 'router'
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/gsap')) return 'animation'
          if (id.includes('node_modules/lenis')) return 'lenis'
        },
      },
    },
  },
})
