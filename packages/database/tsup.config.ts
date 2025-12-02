import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/client.ts',
    'src/repositories/analytics/index.ts',
    'src/repositories/api/index.ts',
    'src/repositories/auth/index.ts',
    'src/repositories/base/index.ts',
    'src/repositories/endpoint/index.ts',
    'src/repositories/mock/index.ts',
    'src/repositories/user/index.ts',
    'src/repositories/workspace/index.ts',
  ],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['@prisma/client'],
})
