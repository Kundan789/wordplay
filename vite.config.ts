import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/wordplay/', // Ensures absolute asset resolution for GitHub Pages (https://kundan789.github.io/wordplay/)
  plugins: [react()],
  server: {
    host: true, // Allows access via mobile phone on local network (e.g. http://192.168.x.x:5173)
    port: 5173
  }
});
