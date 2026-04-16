import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Forward /api/* to the Vercel dev server when running `vercel dev`.
    // Plain `npm run dev` won't have anything listening on 3000, so API
    // calls will fail with a network error (expected — use `vercel dev` to
    // test serverless functions locally).
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
