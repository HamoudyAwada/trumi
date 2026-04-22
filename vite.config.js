import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
      manifest: {
        name: 'Trumi',
        short_name: 'Trumi',
        description: 'Growth that feels like you.',
        theme_color: '#fffcfa',
        background_color: '#fffcfa',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
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
