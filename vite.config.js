import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import {defineConfig} from 'vite';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: './', // Ensures relative paths for GitHub Pages
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    hmr: process.env.DISABLE_HMR !== 'true',
  },
});
