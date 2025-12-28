import { defineConfig } from 'vite'

import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  build: {
    target: ['node25'],
    outDir: join(__dirname, 'dist'),
    lib: {
      entry: join(__dirname, './extension.mjs'),
      name: 'extension',
      formats: ['es']
    },
    minify: false,
    rollupOptions: {
      external: [
        'eslint',
        'hermes-eslint',
        'node:assert',
        'node:fs/promises',
        'node:path',
        'node:url',
        'prettier',
        'vscode'
      ]
    }
  }
})
