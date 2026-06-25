import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const r = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      'server-only': r('./node_modules/next/dist/compiled/server-only/empty.js'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    css: false,
    exclude: ['node_modules/**', '.next/**', 'e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['**/*.{ts,tsx}'],
      exclude: [
        '**/*.module.css',
        '**/*.css',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/test/**',
        '**/e2e/**',
        '**/node_modules/**',
        '**/.next/**',
        '**/coverage/**',
        '**/vitest.setup.ts',
        '**/*.config.{ts,js,mjs}',
        '**/next-env.d.ts',
        '**/next.config.ts',
        '**/shared/config/**',
        '**/shared/lib/types/**',
        '**/eslint.config.mjs',
        '**/commitlint.config.js',
      ],
    },
  },
})
