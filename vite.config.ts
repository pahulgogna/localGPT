import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5123,
    strictPort: true
  },
  base: "./",
  build: {
    outDir: "dist-react"
  }
})
