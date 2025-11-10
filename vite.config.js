import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/IndusCarRental/', // 👈 this is important for GitHub Pages
  plugins: [react()],
})
