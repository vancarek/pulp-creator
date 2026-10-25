import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// GitHub Pages serwuje aplikację pod /<nazwa-repo>/
const base = process.env.BASE_PATH ?? '/pulp-creator/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: 'Kreator Pulp Cthulhu',
        short_name: 'Pulp Cthulhu',
        description: 'Kreator i karty postaci do Pulp Cthulhu',
        lang: 'pl',
        theme_color: '#1c1712',
        background_color: '#f3ead8',
        display: 'standalone',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
