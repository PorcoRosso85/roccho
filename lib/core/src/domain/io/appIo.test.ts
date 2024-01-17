import path from 'path'
import { Bindings } from '@quantic/config'
import { Context, Env, Hono } from 'hono'
import { Miniflare } from 'miniflare'
import { afterAll, beforeAll, describe, expect, expectTypeOf, test } from 'vitest'
import { UnstableDevWorker, unstable_dev } from 'wrangler'
import { features } from '@PorcoRosso85/app/src/route/route'
import { TestFunction } from '../tests'
import { Types } from '../types'
import { CommonColumns, Feature, QueryResult, Table, User, UserColumns } from './appIo'

function getTableName<T extends Table<any>>(table: T): string {
  return table.tableName
}

// テスト
describe('getTableName', () => {
  test('should return the table name', () => {
    const user: User = {
      tableName: 'users',
      columns: {
        id: '',
        date: new Date(),
        name: 'John Doe',
        email: 'john.doe@example.com',
        age: 30,
        address: '123 Main St',
      },
    }

    expect(getTableName(user)).toBe('users')
  })
})

/**
 * この関数は、interface宣言を検証するための関数です。
 */
const staticIo = () => {
  test('target is working', () => {
    let target: Record<string, Feature<Env, Table<any>>>
    target = features
    expectTypeOf(features).toEqualTypeOf(target)
  })
}

staticIo()

export const browserWorkerConn: TestFunction = ({ method, end, context, body }) => {
  let res: any
  let worker: UnstableDevWorker

  console.debug('context', context)
  const { type, params } = context

  beforeAll(async () => {
    // relative path from project root to app file
    // index.ts/x should export app as default
    const filePath = appFilePath
    // console.debug('filePath', filePath)
    worker = await unstable_dev(filePath, {
      experimental: { disableExperimentalWarning: false },
    })
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

    for (const param of params) {
      switch (type) {
        case 'toContain':
          expect(await res.text()).toContain(param)
          break
        case 'toEqual':
          expect(await res.text()).toEqual(param)
          break
        default:
          break
      }
    }
  })
}

browserWorkerConn({
  method: 'GET',
  end: '/users',
  match: { type: 'toContain', params: ['Hello'] },
  body: '',
})

/**
 * このプロンプトの目的は, 設計されるべき関数とその型を定義することです
 * 下記の情報を理解し、必要な型をコメント付きで定義してください
 *
 * 設計されるべき関数は、要件に基づきます
 * このアプリケーションの目的は
 * - ユーザーがアカウントに所属し
 * - 各アカウントは勘定科目を持ち
 * - 各勘定科目は取引を持つことで取引を可能にすること
 * 機能要件は
 * - これがhonoフレームワークを使用したウェブアプリケーションであること
 * - httpリクエストを受け取り、httpレスポンスを返すこと
 * - リクエストを受け取ったら、データベースにクエリを実行すること
 * - データベースからのレスポンスを受け取ったら、レスポンスを返すこと
 * - レスポンスを返す前に、レスポンスを検証すること
 *
 */

const appFilePath = path.resolve(__dirname, '../../index.ts')

// const testFunctionsObject: Types['TestFunctionsObject'] = {
//   browserWorkerConn: ({ method, end, match, body }) =>
//     browserWorkerConn({ method, end, match, body }),

//   queryToContain: ({ method, end, body, query, match }) => {
//     console.debug('match', match)
//     const { type, params } = match
//     switch (type) {
//       case 'toBe':
//         break
//       case 'toEqual':
//         break
//       case 'toMatchObject':
//         break
//       case 'toContain':
//         for (const param of params) {
//           // if query is array, then check all to contain or not
//           if (Array.isArray(query)) {
//             for (const q of query) {
//               test(`queryContain of ${q}`, () => {
//                 console.debug('param', param)
//                 console.debug('q', q)
//                 expect(q).toContain(param)
//               })
//             }
//           } else {
//             test(`queryContain of ${query}`, () => {
//               expect(query).toContain(param)
//             })
//           }
//         }
//         break
//       case 'toContainEqual':
//         break
//       default:
//         break
//     }
//   },

//   queryToMiniflareD1: async ({ method, end, query, match }) => {
//     const mf = new Miniflare({
//       name: 'main',
//       modules: true,
//       script: `
//         export default {
//         async fetch(request, env, ctx){
//             return new Response('Hello World!');
//         },};
//       `,
//       d1Databases: ['D1'],
//     })
//     const d1db = await mf.getD1Database('D1')

//     // [] table should be added
//     const table = ''
//     // [] extract tableName from query
//     const tableName = ''
//     const ddl = schema.genDdl(table)
//     await d1db.exec(ddl)

//     /** genDdl関数の結合テスト */
//     test('assert table', async () => {
//       const { results } = await d1db.prepare('SELECT * FROM sqlite_master;').all()
//       const tableNames = results.map((result) => result.name)
//       expect(tableNames).toContain(tableName)
//     })

//     describe('after table asserted...', async () => {
//       const { results } = await d1db.prepare(`PRAGMA table_info(${tableName});`).all()
//       const columnNames = results.map((result) => result.name)

//       test(`${tableName} column should be created`, async () => {
//         for (const columnName of columnNames) {
//           expect(columnNames).toContain(columnName)
//         }
//         // // []手動のテスト
//         // expect(columnNames).toContain(toContain)
//       })

//       describe('after column asserted...', async () => {
//         // [] extract queryOperation from query
//         const queryOperation = ''
//         switch (queryOperation) {
//           case 'insert':
//             beforeAll(async () => {
//               // [] query should be added
//               await d1db.prepare(query).run()
//             })

//             test('query to contain expected', async () => {
//               // const query = `insert into user (user_id, user_name, user_role, email, created_at, other_info) values ('user_id', 'user_name', 'user_role', 'email', 'created_at', 'other_info');`
//               expect(query).toContain(toContain)
//             })

//             test('validate inserted user.register', async () => {
//               const { results } = await d1db.prepare('SELECT * FROM user;').all()
//               expect(results.length).toEqual(1)
//               expect(results[0].email).toEqual('email')
//               expect(results[0].user_id).toEqual('user_id')
//               expect(results[0].user_name).toEqual('user_name')
//               expect(results[0].user_role).toEqual('user_role')
//             })
//             break
//           case 'update':
//             break
//           case 'delete':
//             break
//           case 'select':
//             break
//           default:
//             throw new Error('queryOperation is invalid')
//         }
//       })
//     })

//     describe('query is invalid', async () => {
//       test('if query is empty', async () => {
//         const query = ''
//         // [] should throw error
//       })

//       test('if query is invalid', async () => {})
//     })

//     describe('transaction', async () => {
//       test('transaction management', async () => {})
//     })
//   },
// }

// const testMap: Types['TestsMap'] = {
//   'get /transaction': {
//     end: [
//       // {
//       //   testFunction: testFunctionsObject.browserWorkerConn,
//       //   testTarget: feats['get /transaction'].end,
//       //   testParams: [{ type: 'toContain', params: ['hello', 'get', '/transaction'] }],
//       // },
//     ],
//     query: [
//       {
//         testFunction: testFunctionsObject.queryToContain,
//         testTarget: feats['get /transaction'].query.insert_transaction_from({
//           table: 'from',
//           columns: ['columns'],
//           any: 'any',
//         }),
//         testParams: [{ type: 'toContain', params: ['insert', 'transaction', '(from)'] }],
//       },
//     ],
//   },
// }

// const testFactory: Types['TestFactory'] = (map: Types['TestsMap']) => {
//   const testFunctions: Types['TestFunction'][] = []

//   for (const [methodEnd, features] of Object.entries(map)) {
//     // extract method and end
//     const { method, end } = methodEnd.split(' ') as [string, string]

//     for (const [feature, tests] of Object.entries(features)) {
//       switch (feature) {
//         case 'end': {
//           for (const test of tests) {
//             const { testFunction, testTarget, testParams } = test
//             for (const { type, params } of testParams) {
//               testFunction({
//                 method,
//                 end,
//                 body: testTarget,
//                 match: { type: type, params: params },
//               })
//             }
//           }
//         }
//         break
//         case 'query': {
//           for (const test of tests) {
//             const { testFunction, testTarget, testParams } = test
//             for (const { type, params } of testParams) {
//               testFunction({
//                 method,
//                 end,
//                 query: testTarget,
//                 match: { type: type, params: params },
//               })
//             }
//           }
//         }
//         break
//         case 'handler':
//           break
//         case 'client':
//           break
//         case 'component':
//           break
//         case 'validate':
//           break
//         default:
//           break
//       }
//     }
//   }
//   // return testFunctions
// }

// export { testFactory, testMap, Types }
