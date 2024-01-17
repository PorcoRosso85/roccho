import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'node',
      // include: [
      //   'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      //   'src/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      // ],
      exclude: [
        ...configDefaults.exclude,
        'packages/template/*',
        'packages/node_modules/*',
        'node_modules/*',
      ],
      cache: false,
      setupFiles: ['./setup.ts'],
      coverage: {
        reporter: [
          'text',
          [
            'lcov',
            {
              projectRoot: './',
            },
          ],
        ],
      },
    },
  }),
)
