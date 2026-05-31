import { defineConfig } from 'vite';
import { resolve } from 'path';

// Popup config - must be IIFE (no ES modules in popup)
export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/popup/popup.ts'),
      name: 'DevGridPopup',
      formats: ['iife'],
      fileName: () => 'popup/popup.js',
    },
    rollupOptions: {
      output: {
        extend: true,
      },
    },
    emptyOutDir: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
