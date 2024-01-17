import path from 'path'
import { Hono } from 'hono'
import { PreviewServer, preview } from 'vite'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import type { UnstableDevWorker } from 'wrangler'
import { unstable_dev } from 'wrangler'
// import { economyHonoApp, endpoints } from '../index'

export { browserWorkerTest, apiTest }

const browserWorkerTest = (
  describe: string,
  app: Hono,
  endpoint: string,
  method = 'GET',
  body: { [key: string]: any } = {},
  expected?: string,
) => {
  console.debug('endpoint', endpoint)
  let res
  let worker: UnstableDevWorker

  beforeAll(async () => {
    // relative path from project root to app file
    // index.ts/x should export app as default
    const filePath = path.resolve(__dirname, '../../route/index.tsx')
    // console.debug('filePath', filePath)
    worker = await unstable_dev(filePath, {
      experimental: { disableExperimentalWarning: false },
    })
    console.debug('worker', filePath, worker)
  })

  afterAll(async () => {
    if (worker) {
      await worker.stop()
    }
  })
}

const apiTest = () => {
  test('APIの契約テスト', () => {})
  describe.skip('APIの機能テスト', () => {
    let server: PreviewServer
    let browser: Browser
    let page: Page
    let context: BrowserContext

    const PORT = 8787

    beforeAll(async () => {
      // start server
      server = await preview({
        root: './',
        server: {
          port: PORT,
        },
      })
      // check with all browser
      const launchOptions = {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      }
      browser = await chromium.launch(launchOptions)

      page = await browser.newPage()
    })

    afterAll(async () => {
      await browser.close()
      await new Promise<void>((resolve, reject) => {
        server.httpServer.close((err) => {
          if (err) {
            reject(err)
            return
          }
          resolve()
        })
      })
    })

    test('count updated when button clicked', async () => {
      await page.goto(`http://localhost:${PORT}/economy}`)
      const button = await page.$('button')
      await button?.click()
      const count = await page.$eval('p', (el) => el.textContent)
      expect(count).toBe('1')
    })

    test('should change count when button clicked', async () => {
      await page.goto(`http://localhost:${PORT}`)
      const button = page.getByRole('button', { name: /Clicked/ })
      await expectPlayWright(button).toBeVisible()

      await expectPlayWright(button).toHaveText('Clicked 0 time(s)')

      await button.click()
      await expectPlayWright(button).toHaveText('Clicked 1 time(s)')
    }, 60_000)

    test('hx- エンドポイントが正しく設定されている', () => {
      // https://github.com/vitest-dev/vitest/blob/userquin/feat-isolate-browser-tests/examples/react-testing-lib-browser/src/App.test.tsx
    })
    test('hx- 正常な結果、適切な要素が更新されている', () => {})
    test('ボタンのレンダリングテスト', async () => {
      // ボタンのレンダリングテスト: コンポーネントが正しくレンダリングされるかをテストします。これには、レンダリングされたHTMLが期待通りであることを確認するアサーションが含まれます。

      // test対象は "get /economy"
      // check page resolve test endpoint
      test('ボタンのレンダリングテスト', async () => {
        try {
          await page.goto('http://localhost:8787/economy')
          const button = await page.$('button')
          // その他のテストコード
        } catch (error) {
          console.error('Error occurred during page navigation:', error)
          // 必要に応じてエラーハンドリングを行います
        }
      })
    })
    // イベントハンドラのテスト: ボタンのクリックイベントなどのイベントハンドラが正しく動作するかをテストします。これには、ボタンをクリックした際の挙動をシミュレートし、期待される結果が得られるかを検証するアサーションが含まれます。
    // 非同期動作のテスト: あるボタンが非同期リクエストを行う場合、その動作をテストします。これには、非同期リクエストが完了した後の状態を検証するアサーションが含まれます。
  })
  test('エンドポイントの検証とバリデーション', () => {})
  test('レート制限とスロットリング', () => {})
}
