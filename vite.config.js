import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('framer-motion')) {
              return 'vendor-framer-motion'
            }
            if (id.includes('gsap') || id.includes('lenis')) {
              return 'vendor-animation'
            }
            if (id.includes('react-icons')) {
              return 'vendor-icons'
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react'
            }
            return 'vendor-utils'
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
})
