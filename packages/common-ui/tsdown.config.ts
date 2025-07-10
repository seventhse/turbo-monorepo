import { defineConfig } from 'tsdown'
import { AutoExportsPlugin } from '../../scripts/auto-exports'

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
