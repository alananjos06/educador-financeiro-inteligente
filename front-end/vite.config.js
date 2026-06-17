import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/educador-financeiro-inteligente/',
  build: {
    outDir: 'docs'
  }
})
