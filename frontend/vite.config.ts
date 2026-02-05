import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    watch: {
      usePolling: true,
      interval: 1000,
    },
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3000,
    },
    // Proxy API requests to the Laravel backend running in Docker
    // Use service name so the dev server (running inside the frontend container)
    // can reach the backend at runtime.
    proxy: {
      '/api': {
        target: 'http://laravel_app:8000',
        changeOrigin: true,
        secure: false,
        ws: false,
      },
      // Also proxy Sanctum CSRF endpoint if needed
      '/sanctum': {
        target: 'http://laravel_app:8000',
        changeOrigin: true,
        secure: false,
        ws: false,
      }
    }
  },
  // Provide an explicit file extension list to reduce encoding surprises
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.tsx', '.jsx', '.json']
  },
  optimizeDeps: {
    include: ['react-hook-form', 'react-to-print', 'html2canvas', 'jspdf']
  }
});
