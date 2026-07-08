import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' so the production build works from any folder or file://
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    watch: {
      // don't watch word pictures: files being copied in are briefly locked
      // on Windows and crash the watcher; a page refresh picks them up anyway
      ignored: ['**/public/assets/images/**'],
    },
  },
});
