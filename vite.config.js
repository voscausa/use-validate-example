import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

const __dirname = path.resolve();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    // sourcemap: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      $lib: path.resolve('./src/lib'),
      $stores: path.resolve('./src/stores'),
      $utils: path.resolve('./src/utilities')
    }
  }  
})
