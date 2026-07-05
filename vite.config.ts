import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // File watching has proven unreliable in this environment; poll instead.
    watch: { usePolling: true, interval: 300 },
  },
})
