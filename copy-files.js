import { copyFileSync, mkdirSync } from 'fs';

// Create directories
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

console.log('✓ Files copied successfully');
