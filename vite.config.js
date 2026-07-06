import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' so the production build works from any folder or file://
export default defineConfig({
  base: './',
  plugins: [react()],
});
