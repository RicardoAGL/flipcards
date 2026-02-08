import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Base public path for GitHub Pages deployment
  // Change this if deploying to a custom domain or subdirectory
  base: './',

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
