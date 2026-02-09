import { defineConfig } from 'vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  // Base public path for GitHub Pages deployment
  // Change this if deploying to a custom domain or subdirectory
  base: './',

  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: 'Dutch Pronunciation Flip Cards',
        short_name: 'FlipCards',
        description: 'Learn Dutch pronunciation through interactive flip cards and quizzes',
        theme_color: '#F97316',
        background_color: '#ffffff',
        display: 'standalone',
        scope: './',
        start_url: './',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512x512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,json,woff,woff2}'],
        navigateFallback: 'index.html',
      },
    }),
  ],

  build: {
    // Output directory for production build
    outDir: 'dist',

    // Source maps only in development
    sourcemap: false,

    // Ensure assets are properly chunked
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },

  server: {
    // Development server port
    port: 5173,

    // Open browser on server start
    open: true,
  },

  preview: {
    // Preview server port
    port: 4173,
  },

  // Resolve aliases for cleaner imports
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  // Vitest configuration
  test: {
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.js'],
      exclude: ['src/data/lessons/*.json'],
    },
  },
});
