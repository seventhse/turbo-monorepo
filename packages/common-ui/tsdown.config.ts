import { AutoExportsPlugin } from '@vi-space/internal'
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
  minify: true,
  target: 'es2020',
  clean: true,
  unbundle: true,
  external: ['react', 'react-dom'],
  plugins: [
    AutoExportsPlugin({
      excludeFiles: ['index.ts', 'styles.css'],
    }),
  ],
})
