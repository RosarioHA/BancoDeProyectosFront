import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// determine outDir based on the BUILD_ENV variable
let outputDirectory = 'development';

if(process.env.BUILD_ENV === 'production') {
  outputDirectory = 'production';
} else if (process.env.BUILD_ENV === 'staging') {
  outputDirectory = 'staging';
}

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173, // Configurar el puerto aquí
  },
  plugins: [ react() ],
  build: {
    outDir: `dist/${outputDirectory}`,
  }
})
