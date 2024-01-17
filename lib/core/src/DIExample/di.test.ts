import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { UnstableDevWorker, unstable_dev } from 'wrangler'
import { libHonoApp } from '@PorcoRosso85/app/src/route/route'

describe('env', () => {
  let worker: UnstableDevWorker

  beforeAll(async () => {
    // relative path from project root to app file
    worker = await unstable_dev('./src/index.ts', {
      experimental: { disableExperimentalWarning: true },
      vars: {
        API_KEY: 'api',
      },
    })
  })

  afterAll(async () => {
    await worker.stop()
  })

  test.skip('api_key var', async () => {
    const res = await worker.fetch('/env')
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('api')
  })
})
