import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  "./database/vitest.config.ts",
  "./PorcoRosso85/vitest.config.ts",
  "./PorcoRosso85/lib/web/vitest.config.ts",
  "./PorcoRosso85/lib/auth/vitest.config.ts",
  "./PorcoRosso85/lib/postgres/vitest.config.ts"
])
