import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // This forces Vite to only use one copy of React, fixing the Lucide-React hook error
    dedupe: ['react', 'react-dom']
  }
})
