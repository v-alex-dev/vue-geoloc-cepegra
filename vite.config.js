import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html',
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
      },
      manifest: {
        name: 'GeoLoc Cepegra',
        short_name: 'GeoLoc',
        start_url: '/',
        display: 'standalone',
        background_color: '#1f2937',
        theme_color: '#ff9100',
        icons: [
          {
            src: '/favicon_16x16.png',
            sizes: '16x16',
            type: 'image/png',
          },
          {
            src: '/favicon_32x32.png',
            sizes: '32x32',
            type: 'image/png',
          },
          {
            src: '/favicon_96x96.png',
            sizes: '96x96',
            type: 'image/png',
          },
          {
            src: '/favicon_256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: '/favicon_512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/favicon.ico',
            sizes: '48x48',
            type: 'image/x-icon',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
