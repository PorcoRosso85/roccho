import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      includeSource: ['./src/**/*.{js,ts,jsx,tsx}'],
      exclude: [...configDefaults.exclude, 'packages/template/*'],
    },
  }),
)
