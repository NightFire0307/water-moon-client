import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { compression } from 'vite-plugin-compression2'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), svgr({
    svgrOptions: {
      icon: true,
    },
  }), compression()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 5174,
    host: '0.0.0.0',
    proxy: {
      // '/api': 'https://apifoxmock.com/m1/4320757-3963744-default',
      '/api': {
        target: 'http://localhost:3000',
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: '[ext]/[name]-[hash].[ext]',
        // manualChunks(id) {
        //   if (id.includes('/node_modules/')) {
        //     const module = id.split('/node_modules/')[1].split('/')[1]
        //     console.log('module: ', module)

        //     const map: Record<string, string> = {
        //       'react': 'vendor_react',
        //       '@ant-design': 'vendor_antd',
        //       '@ant-design/icons': 'vendor_antd_icons',
        //       'lucide-react': 'vendor_lucide',
        //       'framer-motion': 'vendor_framer_motion',
        //       'lodash-es': 'vendor_utils',
        //     }

        //     for (const key of Object.keys(map)) {
        //       if (module.startsWith(key)) {
        //         return map[key]
        //       }
        //     }
        //   }
        // },
      },
    },
  },
})
