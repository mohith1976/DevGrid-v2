import { defineConfig } from 'vite';
import { resolve } from 'path';

// Background service worker config - can be ES module
export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/background/index.ts'),
      name: 'DevGridBackground',
      formats: ['es'],
      fileName: () => 'background/index.js',
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
