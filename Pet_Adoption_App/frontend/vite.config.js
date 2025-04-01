// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // port: 3000,        // remove or comment out
    // strictPort: true,  // remove or comment out
    watch: {
      usePolling: true
    },
    host: true
  }
})
