// Vite configuration using the React plugin for fast HMR and JSX support
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})