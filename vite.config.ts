// vite.config.ts
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import path from 'path'

export default defineConfig({
  plugins: [uni()],
  resolve: {
    alias: {
      // 与 tsconfig paths 同步！
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
