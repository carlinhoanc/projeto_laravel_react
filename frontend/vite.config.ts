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
  },
  // Provide an explicit file extension list to reduce encoding surprises
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.tsx', '.jsx', '.json']
  }
});
