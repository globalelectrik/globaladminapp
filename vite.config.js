import path from 'path';
import fs from 'fs';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    exclude: ['@azure/msal-browser', '@azure/msal-react'], // Exclude MSAL packages from optimization
  },
  server: {
    // Uncomment and adjust the below block if using HTTPS locally
    /*
    https: {
      key: fs.readFileSync('C:/Windows/System32/localhost-key.pem'),
      cert: fs.readFileSync('C:/Windows/System32/localhost.pem'),
    },
    host: '0.0.0.0',
    */
    port: 3000,
  },
});
