import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync } from 'fs';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        'background/index': resolve(__dirname, 'src/background/index.ts'),
        'content/index': resolve(__dirname, 'src/content/index.ts'),
        'popup/popup': resolve(__dirname, 'src/popup/popup.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        format: 'es',
      },
    },
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    {
      name: 'copy-files',
      closeBundle() {
        mkdirSync('dist', { recursive: true });
        mkdirSync('dist/popup', { recursive: true });
        mkdirSync('dist/icons', { recursive: true });
        
        // Copy manifest
        copyFileSync('manifest.json', 'dist/manifest.json');
        
        // Copy popup HTML and CSS
        copyFileSync('src/popup/popup.html', 'dist/popup/popup.html');
        copyFileSync('src/popup/popup.css', 'dist/popup/popup.css');
        
        // Copy icons
        copyFileSync('icons/icon16.png', 'dist/icons/icon16.png');
        copyFileSync('icons/icon48.png', 'dist/icons/icon48.png');
        copyFileSync('icons/icon128.png', 'dist/icons/icon128.png');
      },
    },
  ],
});
