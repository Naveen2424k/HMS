import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'



// https://vitejs.dev/config/

export default defineConfig({
    plugins: [react()],
    build: {
        chunkSizeWarningLimit: 1000, // Increase limit to 1000 kB
        rollupOptions: {
            output: {
                manualChunks: {
                    // Split vendor chunks for better caching
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'clerk-vendor': ['@clerk/clerk-react'],
                    'ui-vendor': ['framer-motion', 'lucide-react', 'recharts'],
                }
            }
        }
    }
})
