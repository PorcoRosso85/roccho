import path from 'path'
import { Miniflare } from 'miniflare'
/**
 * このファイルは
 * テスト関数を生成するファクトリー関数
 * 生成するためのテスト対象のマッピング定義
 * 生成するためのテスト一覧
 * を含みます。
 * インポートする全オブジェクトはすでにテストが完了しているものとします
 */
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { unstable_dev } from 'wrangler'
import type { UnstableDevWorker } from 'wrangler'
import * as schema from '../dao/schema'
import { TestFunction, TestFunctionItems, TestMap, TestTypeStates } from '../domains/types/feats'
import { Ends } from '../domains/types/feats'
import { feats } from './states'

/**
 * 生成するためのテスト一覧
 * すべてのテストを含む
 */
// []各keyの型を定義する
const testFunctions: { [K in TestFunctionItems]: TestFunction } = {
  // 各testを書くのではなく、各describeについて書くことにした、要件次第ではtestに戻す
  browserWorkerConn: ({ method, end, match, body }) => {
    let res: any
    let worker: UnstableDevWorker

    beforeAll(async () => {
      // relative path from project root to app file
      // index.ts/x should export app as default
      const filePath = path.resolve(__dirname, '../route/states.tsx')
      // console.debug('filePath', filePath)
      worker = await unstable_dev(filePath, {
        experimental: { disableExperimentalWarning: false },
      })
      // console.debug('worker', filePath, worker)
    })

    afterAll(async () => {
      if (worker) {
        await worker.stop()
      }
    })

    test(`responseToContain ${end} ${body}`, async () => {
      switch (method) {
        case 'GET':
          // console.debug('end', end)
          res = await worker.fetch(end)
          // console.debug('res', res)
          break
        case 'POST':
          res = await worker.fetch(end, {
            method: 'POST',
            // body: new URLSearchParams(body).toString(),
          })
          break
        case 'PUT':
          res = await worker.fetch(end, {
            method: 'PUT',
            // body: new URLSearchParams(body).toString(),
          })
          break
        case 'DELETE':
          res = await worker.fetch(end, {
            method: 'DELETE',
            // body: new URLSearchParams(body).toString(),
          })
          break
        default:
          break
      }

      expect(res.status).toBe(200)
      expect(res.statusText).toBe('OK')

      switch (match) {
        case 'toContain':
          expect(await res.text()).toContain(body)
          break
        case 'toEqual':
          expect(await res.text()).toEqual(body)
          break
        default:
          break
      }
    })
  },

  /** queryの単体テストであり、統合テストは別で行う */
  // queryToMiniflareD1: async ({ body }) => {
  //   const mf = new Miniflare({
  //     name: 'main',
  //     modules: true,
  //     script: `
  //                   export default {
  //                   async fetch(request, env, ctx){
  //                       return new Response('Hello World!');
  //                   },};
  //                   `,
  //     d1Databases: ['D1'],
  //   })
  //   const d1db = await mf.getD1Database('D1')

  //   // [] table should be added
  //   const table = ''
  //   // [] table should be added
  //   const query = ''
  //   // [] extract tableName from query
  //   const tableName = ''
  //   const ddl = schema.genDdl(table)
  //   await d1db.exec(ddl)

  //   /** genDdl関数の結合テスト */
  //   test('assert table', async () => {
  //     const { results } = await d1db.prepare('SELECT * FROM sqlite_master;').all()
  //     const tableNames = results.map((result) => result.name)
  //     expect(tableNames).toContain(tableName)
  //   })

  //   describe('after table asserted...', async () => {
  //     const { results } = await d1db.prepare(`PRAGMA table_info(${tableName});`).all()
  //     const columnNames = results.map((result) => result.name)

  //     test(`${tableName} column should be created`, async () => {
  //       for (const columnName of columnNames) {
  //         expect(columnNames).toContain(columnName)
  //       }
  //       // // []手動のテスト
  //       // expect(columnNames).toContain(toContain)
  //     })

  //     describe('after column asserted...', async () => {
  //       // [] extract queryOperation from query
  //       const queryOperation = ''
  //       switch (queryOperation) {
  //         case 'insert':
  //           beforeAll(async () => {
  //             // [] query should be added
  //             await d1db.prepare(query).run()
  //           })

  //           test('query to contain expected', async () => {
  //             // const query = `insert into user (user_id, user_name, user_role, email, created_at, other_info) values ('user_id', 'user_name', 'user_role', 'email', 'created_at', 'other_info');`
  //             expect(query).toContain(toContain)
  //           })

  //           test('validate inserted user.register', async () => {
  //             const { results } = await d1db.prepare('SELECT * FROM user;').all()
  //             expect(results.length).toEqual(1)
  //             expect(results[0].email).toEqual('email')
  //             expect(results[0].user_id).toEqual('user_id')
  //             expect(results[0].user_name).toEqual('user_name')
  //             expect(results[0].user_role).toEqual('user_role')
  //           })
  //           break
  //         case 'update':
  //           break
  //         case 'delete':
  //           break
  //         case 'select':
  //           break
  //         default:
  //           throw new Error('queryOperation is invalid')
  //       }
  //     })
  //   })

  //   describe('query is invalid', async () => {
  //     test('if query is empty', async () => {
  //       const query = ''
  //       // [] should throw error
  //     })

  //     test('if query is invalid', async () => {})
  //   })

  //   describe('transaction', async () => {
  //     test('transaction management', async () => {})
  //   })
  // },

  performanceOptimizationTests: () => {
    test.skip('パフォーマンスの測定（レイテンシ、スループット）', async () => {
      const start = performance.now()

      // APIリクエストの実行
      // deloy先にアクセスする
      // const url = 'https://example.com'
      // const app = new URL(url)
      const response = await fetch(app, url)
      const end = performance.now()

      // レスポンスタイムの計測
      const responseTime = end - start

      // レスポンスタイムが500ミリ秒未満であることを確認
      expect(responseTime).toBeLessThan(500)
    })
  },

  e2e: () => {
    test('異なるブラウザとデバイスでの表示の一貫性', () => {}),
      test('レスポンシブデザイン', () => {}),
      describe.skip('コンポーネント内部のrendering必須項目テスト', () => {
        beforeAll(() => {
          const jsdom = require('jsdom')
          const { JSDOM } = jsdom

          const dom = new JSDOM()
          global.document = dom.window.document
          global.window = dom.window
        })

        test('GetBank returns a button for each endpoint', () => {
          const endpoints = ['a', 'b', 'c']

          /**
           * 仮にコンポーネントをインポートしたとする
           * 下記はコンポーネントの例である
           */
          const GetBank = (endpoints) => {
            const buttons = buttonComponents({ endpoints })
            return (
              <div>
                {buttons.a}
                {buttons.b}
                {buttons.c}
              </div>
            )
          }

          for (const endpoint of endpoints) {
            console.debug('endpoint', endpoint)

            const { getByRole } = render(<GetBank endpoints={endpoints} />)
            const button = getByRole('button')

            expect(button).toHaveAttribute('type', 'button')
          }
        })

        test.skip('GetBank returns a button for each endpoint', () => {
          const endpoints = ['a', 'b', 'c']
          const buttons = buttonComponents({ endpoints })

          for (const endpoint of endpoints) {
            console.debug('endpoint', endpoint)

            console.debug('buttons[endpoint]', buttons[endpoint])
            const { getByRole } = render(buttons[endpoint])
            const button = getByRole('button')

            expect(button).toHaveAttribute('type', 'button')
          }
        })

        describe.skip('compoA', () => {
          const CompoA = () => {
            return (
              <div>
                <h1>Endpoint A</h1>
                <p>Access Endpoint B or C using the links below:</p>
                <ul>
                  <li>
                    <a href="/endpoint-b">Link to Endpoint B</a>
                  </li>
                  <li>
                    <a href="/endpoint-c">Link to Endpoint C</a>
                  </li>
                </ul>
              </div>
            )
          }

          describe.skip('CompoA Component', () => {
            test('contains links to Endpoint B and Endpoint C', () => {
              render(<CompoA />)

              const linkToB = screen.getByRole('link', { name: /link to endpoint b/i })
              expect(linkToB).toBeInTheDocument()
              expect(linkToB).toHaveAttribute('href', '/endpoint-b')

              const linkToC = screen.getByRole('link', { name: /link to endpoint c/i })
              expect(linkToC).toBeInTheDocument()
              expect(linkToC).toHaveAttribute('href', '/endpoint-c')
            })
          })
        })
      })
    // miniflareでシミュレーション不可能であり、dploy後に実施する
    describe('ユーザーアクションからデータストレージまでの流れ', () => {
      test('ハイドレーションが読み込まれている', () => {})
      test('ヘッダーが認識されている', () => {})
      test('ボタンが正しく設定されている', () => {
        // ボタンが正しく設定されている
      })
    })
  },

  frameworkFunctionalityTests: () => {
    test.skip('c.req.parseBody is working', async () => {
      const req = new Request('/economy/user/register', {
        method: 'POST',
        // formの場合は, body: new URLSearchParams({
        body: new URLSearchParams({
          name: 'test',
          email: 'test@mail.com',
        }).toString(),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      const parsedBody = await req.body()
      expect(parsedBody.name).toBe('test')
      expect(parsedBody.email).toBe('test@mail.com')
    })
  },
}

/**
 * 生成するためのテスト対象のマッピング定義
 * @type {Ends}
 * @param end
 * @returns [testFunction, testFunction, ...]
 */
const testMap: TestMap = {
  'get /': {
    end: [
      {
        func: testFunctions.browserWorkerConn,
        match: 'toContain',
        params: [
          // 'hx-boost="true"',
          '<a',
          'href="/user"',
          'href="/bank"',
          'href="/transaction"',
          'href="/support"',
          'hx-target="next main"',
          '<main>',
        ],
      },
    ],
  },

  // 'post /user/register': [
  //   [testFunctions.browserWorkerConn, { toContain: ['<a', 'href="/user"'] }],
  //   [
  //     testFunctions.queryToMiniflareD1,
  //     {
  //       query: [feats['post /user/register'].query.insert_user],
  //       toContain: [
  //         'insert',
  //         'user',
  //         'user_id',
  //         'user_name',
  //         'user_role',
  //         'email',
  //         'created_at',
  //         'other_info',
  //         'values',
  //       ],
  //     },
  //   ],
  // ],
}

/**
 * テスト関数を生成するファクトリー関数
 * @param testMap
 * @returns void
 *
 * methodEndごと
 * - eg. 'get /'
 * 各機能ごと
 * - eg. end, error, query
 * 各機能のテストごと
 * - eg. endの場合、
 * - eg. func = testFunctions.browserWorkerConn
 * - eg. match = toContain
 * - eg. param = ['<a', 'href="/user"']
 *
 */
const testFactory = (testMap: TestMap): void => {
  // methodEndはtestFunctionMapのkey
  const methodEnds = Object.keys(testMap)
  // extract testFunctions from testFunctionMap
  for (const methodEnd of methodEnds) {
    // console.debug('methodEnd', methodEnd)
    const extractedEnd = (methodEnd) => {
      return methodEnd.split(' ')
    }
    let [method, end] = extractedEnd(methodEnd)
    method = method.toUpperCase()

    // extract testFunctions from testFunctionMap
    const featItems = Object.keys(testMap[methodEnd])
    for (const featItem of featItems) {
      // console.debug('featItem', featItem)
      const testFunctions = testMap[methodEnd][featItem]
      console.debug('testFunctions: ', testFunctions)

      for (const testFunction of testFunctions) {
        // console.debug('testFunction', testFunction)
        const { func, match, params } = testFunction as {
          func: TestFunction
          match: string
          params: string[]
        }
        // console.debug('func', func)
        // console.debug('match', match)
        // console.debug('params', params)

        for (const p of params) {
          func({ method, end, match, body: p })
        }
      }
    }
  }
}

testFactory(testMap)
