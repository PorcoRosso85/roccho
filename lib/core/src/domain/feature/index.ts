import path from 'path'
import { Context } from 'hono'
import { Miniflare } from 'miniflare'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { UnstableDevWorker, unstable_dev } from 'wrangler'
import { feats } from '../../route/states'
import { states } from '../states'

export { TestFunctionItems, TestFunction, TestMap, TestTypeStates } from './test'
export { LogLevelConst, LogEntry, LogLevel, logger } from './logger'

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

/**
 * Types型はすべての型を定義しています
 */
type Types = {
  AnyMethodEnd: {
    end: string
    // error: LogCalling
    [key: string]: any
    component?: JSX.Element
    query?: Types['QueryStringToDatabase']
    client?: {
      anchors: string[]
      elements: {
        [key: string]: () =>
          | (JSX.Element | undefined)
          | (JSX.Element | undefined)[]
          | ((props: any) => JSX.Element | undefined)
      }
      contain?: string[]
    }
    handler?: <T>(c: Context<T>) => void
  }

  GetMethodEnd: <T>(type: T) => Types['AnyMethodEnd'] & T

  PostMethodEnd: <T>(type: T) => Types['AnyMethodEnd'] & T & { validate?: (c: Context) => void }

  DeleteMethodEnd: <T>(type: T) => Types['AnyMethodEnd'] & T

  PutMethodEnd: <T>(type: T) => Types['AnyMethodEnd'] & T & { validate: (c: Context) => void }

  MethodEnds: {
    [K in keyof typeof states]: K extends `get /${string}`
      ? Types['GetMethodEnd']
      : K extends `post /${string}`
        ? Types['PostMethodEnd']
        : K extends `delete /${string}`
          ? Types['DeleteMethodEnd']
          : K extends `put /${string}`
            ? Types['PutMethodEnd']
            : Types['AnyMethodEnd']
  }

  QueryStringToDatabase: (params: { table: string; columns: string[]; any: any }) => string

  QueryToExecute: { [K in string]: Types['QueryStringToDatabase'] }

  HandlerOfHonoEndpoint: JSX.Element

  Context: Context

  /** For Tests */
  TestsMap: {
    [K in keyof typeof feats]: {
      [L in keyof (typeof feats)[K]]: {
        testFunction: Types['TestFunction']
        testTarget: any
        testParams: {
          type: 'toBe' | 'toEqual' | 'toMatchObject' | 'toContain' | 'toContainEqual'
          params: string[]
        }[]
      }[]
    }
  }

  TestFunctionItems: 'browserWorkerConn' | 'queryToContain' | 'queryToMiniflareD1'

  TestFunction: (params: Types['ParamsForTestFunction']) => void

  TestFunctionsObject: {
    [K in Types['TestFunctionItems']]: Types['TestFunction']
  }

  ParamsForTestFunction: {
    method: string
    end: string
    body?: string
    query?: string | string[]
    match: {
      type: string
      params: string[]
    }
  }

  /** map(とfunctionItems)から実行 */
  // TestFactory: (map: Types['TestsMap']) => Types['TestFunction'][]
  TestFactory: (map: Types['TestsMap']) => void
}

/**
 * typesStatesオブジェクトは、型同士の遷移を定義しています
 * 特に関数型は入力型と出力型を定義できることから、
 * 入力/出力のみの型の遷移入力を省略しています
 */
const typesStates: { [K in keyof Types]: { on?: { [L in string]: keyof Types } } } = {
  HandlerOfHonoEndpoint: {
    on: { 'feats[methoEnd].handler': 'Context', 'feats[methoEnd].query': 'QueryStringToDatabase' },
  },
  AnyMethodEnd: {},

  GetMethodEnd: {
    on: {
      type: 'AnyMethodEnd',
    },
  },
  PostMethodEnd: {
    on: {
      type: 'AnyMethodEnd',
      validate: 'Context',
    },
  },
  DeleteMethodEnd: {
    on: {
      type: 'AnyMethodEnd',
    },
  },
  PutMethodEnd: {
    on: {
      type: 'AnyMethodEnd',
      validate: 'Context',
    },
  },
  MethodEnds: {
    on: {
      'asdf \
      asdf \
      asdf \
      asdf \
      asdf \
      asdf \
      \
      ': 'GetMethodEnd',
      postMethodEnd: 'PostMethodEnd',
      deleteMethodEnd: 'DeleteMethodEnd',
      putMethodEnd: 'PutMethodEnd',
      anyMethodEnd: 'AnyMethodEnd',
    },
  },
  QueryStringToDatabase: {},
  QueryToExecute: {
    on: {
      params: 'QueryStringToDatabase',
    },
  },
  Context: {},
  TestsMap: {
    on: {
      testFunction: 'TestFunction',
      // testTarget: 'AnyMethodEnd | GetMethodEnd | PostMethodEnd | DeleteMethodEnd | PutMethodEnd',
    },
  },
  TestFunction: {
    on: {
      params: 'ParamsForTestFunction',
    },
  },
  TestFunctionsObject: {
    on: {
      TestFunctionItems: 'TestFunction',
    },
  },
  TestFunctionItems: {},
  ParamsForTestFunction: {},
  TestFactory: {
    on: {
      map: 'TestsMap',
    },
  },
}

// export const typeStateMachine = createMachine({
//   /** @xstate-layout N4IgpgJg5mDOIC5QDcCWYDusAEBDAdhNmADZgC2Y+ALrAHQASBEZATgPIBmDA9vjwFFCABx6oaAYk5hctANqVqAC0GEAunSXM2cgAxrEoUbFTVUfQyAAeiAGwBWABx1Hu2wCYALAHZ3AZkdbb0dvABoQAE9Ee3s-OhjdRIDEgEZdXwBfDPC0TBxmYjJKGnomQjYuXn4hCFFxaikZeUUVGo0ARwBXMFYIvQMkEGNTc3xLGwQHZ1cPH39A4LDIu113Ok8U9xig+3cU7wBOPyyc9Cw8QkKKKlo6AHEwagBZR5UIGolqCOEwfsthswWQYTKYuNxeXwBIIhcJRBDuXQpOgHTaeTxOA62A6edyYk4gXLnAqka4lOgABR4sGerx470In2+v30-ypIyBoBBTjBs0hCxhy3hsWR3k8B3FYr8nkcjjR+MJ+UuJOKt0p1JeyjpH2QuBIqAgsmZAyMbMBY2Bdm5Mwh82hSzhflWLj8ou8sW8opigXlZ0VRGVN3oABESdQwBq3h8vj8-oMAaNxpbpuC5lDFrDEH57EjvIlVo4-LjdosfXkLv6ioGKZ0aZr6RBGTGWXHTQmLZMrSm+XaMwhPLo4t4PPZPH4-AcEXsUp5S0SlZWyeSaxGtQydXqDWHYyaTGbEx3k7zbenBei1sPERO3QcZbZZ36rir6Cv67AJDBa5HCNuhq2OdZEC8JFdBCaV3EcTEIOnXsESRFEvHRCCsRxPFsgJX1y0fKsXxqN9jE-VcIB-eN-wmIC6BA0VHHAyCUU8GDbF0OgAjdNI9ncQ43XvTCAzJHDCDfCBQ3DWl62Iv9zU5QCNgo0DqKQqD6MFLMczzcDCwOYsQm44kF1ufiIDw5dRJqcTdzbKT4RkyiwIUujew2Jj9nsXQRxSdyx1WbwdPnUl9JMgSJAICIDLM9lJIAqzgLkmjbEU3tHCRIIxQOED0k2VZ3B8is-PoABFbpegAFUEKwwAAYxrMAJGEXBWFwchYDCvd21Ba1U35e1EFzA46DdNSRyzbws2yrCySKuBaCeXBhE+SaADFOnwcqzWaizIrartjwFOEHCRDiXMLWw-Fsac4tG3jbgm6lFuWs0arqhqmubHdwv3DKmNFAIUlsBxfoLXsXOcYax28FJC1HSiLr0+hruoW6VtGWB2AAIwAKwqho4YRs0AEkw0atbSKTHkbTTHbokRdZQM0lJ7HFexTuh3K6Gx3AVp4XoJHIGaiYisjrJiuzoMFPa6AOgd3GO07PHO-F+CE+BBgVHiYdZcziYQABaWxex15mn0YbQekqPhVFqMQaHVt72xxWxkVRXwYm+2wlLhGJer+8Czzio4srQlXdJZgBBfAQoCiBrZayyDl8ZijlcXEHBRI5e00lxGPHN0NmnbYDarB4CPrKP1omWWmNS2Z5jRcUthgqnGI8cDRRRAcDnzxcqSLmoS812XvD60DhsY2VqPcBimJAzY6fFOKRw724QzIMMDN7-nEHRJiNkZn7x1jxJ7F7FT45dXxXaHE77AX+gl27wg1-3Hw4hScVY7ipvHGzQ-T10XrAhCemEFYgLGvnQAyStXrR0ip-CifhUROGCHTWI49BRS0nolLY6JHSV39qcMsQdDYFR6BEAAytQVg4goAlSDLIXAKNcCwDAA-dssc1jjmSEnemL8-C9kYr1LMexGZxTgbLFIoCiHFVKhVKqzDLLSk8HQRuQFYqQl7D1dYo5ghSixAOfYoCADCfAwxWGoLIyKrCT6J0xFw1Oylwbx3FJ-D0Z5qKgLhrAaawgzFl1cOLRm-gAm6DFFLN2loK5xUOE3TYiUr4BwwgQqs2MlqI3-CRdeCBxQDy2AWOK+xjq+BQe7EC6wOK-3ybEeCbiFrJLNMjdGmNvEb2FPYfqiR3DtJ2CkQGVMUgYIQZvVK7c4n4N8obJJd1Rj4woBA38Gt0k4iPr0+I-iNgekCIzY4wy5w5UNuSR6jV5qc3GSkiKaT3pwPttwt0uYghjilt05wOIerlPHJsKpN12bUE5nCSBpdEAQWdJsQsAQIJv0cLwlyyIImYnadEumWQshAA */
//   id: 'views and elements',
//   tsTypes: {} as import('./index.typegen').Typegen0,
//   schema: {
//     // context: {} as { contextType },
//     events: {} as { type: 'eventType' },
//   },
//   context: {
//     // initialContextValue,
//   },
//   initial: 'HandlerOfHonoEndpoint',
//   states: typesStates,
// })

const appFilePath = path.resolve(__dirname, '../../route/states.tsx')

const testFunctionsObject: Types['TestFunctionsObject'] = {
  browserWorkerConn: ({ method, end, match, body }) => {
    let res: any
    let worker: UnstableDevWorker

    const { type, params } = match

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
  },

  queryToContain: ({ method, end, body, query, match }) => {
    console.debug('match', match)
    const { type, params } = match
    switch (type) {
      case 'toBe':
        break
      case 'toEqual':
        break
      case 'toMatchObject':
        break
      case 'toContain':
        for (const param of params) {
          // if query is array, then check all to contain or not
          if (Array.isArray(query)) {
            for (const q of query) {
              test(`queryContain of ${q}`, () => {
                console.debug('param', param)
                console.debug('q', q)
                expect(q).toContain(param)
              })
            }
          } else {
            test(`queryContain of ${query}`, () => {
              expect(query).toContain(param)
            })
          }
        }
        break
      case 'toContainEqual':
        break
      default:
        break
    }
  },

  queryToMiniflareD1: async ({ method, end, query, match }) => {
    const mf = new Miniflare({
      name: 'main',
      modules: true,
      script: `
        export default {
        async fetch(request, env, ctx){
            return new Response('Hello World!');
        },};
      `,
      d1Databases: ['D1'],
    })
    const d1db = await mf.getD1Database('D1')

    // [] table should be added
    const table = ''
    // [] extract tableName from query
    const tableName = ''
    const ddl = schema.genDdl(table)
    await d1db.exec(ddl)

    /** genDdl関数の結合テスト */
    test('assert table', async () => {
      const { results } = await d1db.prepare('SELECT * FROM sqlite_master;').all()
      const tableNames = results.map((result) => result.name)
      expect(tableNames).toContain(tableName)
    })

    describe('after table asserted...', async () => {
      const { results } = await d1db.prepare(`PRAGMA table_info(${tableName});`).all()
      const columnNames = results.map((result) => result.name)

      test(`${tableName} column should be created`, async () => {
        for (const columnName of columnNames) {
          expect(columnNames).toContain(columnName)
        }
        // // []手動のテスト
        // expect(columnNames).toContain(toContain)
      })

      describe('after column asserted...', async () => {
        // [] extract queryOperation from query
        const queryOperation = ''
        switch (queryOperation) {
          case 'insert':
            beforeAll(async () => {
              // [] query should be added
              await d1db.prepare(query).run()
            })

            test('query to contain expected', async () => {
              // const query = `insert into user (user_id, user_name, user_role, email, created_at, other_info) values ('user_id', 'user_name', 'user_role', 'email', 'created_at', 'other_info');`
              expect(query).toContain(toContain)
            })

            test('validate inserted user.register', async () => {
              const { results } = await d1db.prepare('SELECT * FROM user;').all()
              expect(results.length).toEqual(1)
              expect(results[0].email).toEqual('email')
              expect(results[0].user_id).toEqual('user_id')
              expect(results[0].user_name).toEqual('user_name')
              expect(results[0].user_role).toEqual('user_role')
            })
            break
          case 'update':
            break
          case 'delete':
            break
          case 'select':
            break
          default:
            throw new Error('queryOperation is invalid')
        }
      })
    })

    describe('query is invalid', async () => {
      test('if query is empty', async () => {
        const query = ''
        // [] should throw error
      })

      test('if query is invalid', async () => {})
    })

    describe('transaction', async () => {
      test('transaction management', async () => {})
    })
  },
}

const testMap: Types['TestsMap'] = {
  'get /transaction': {
    end: [
      // {
      //   testFunction: testFunctionsObject.browserWorkerConn,
      //   testTarget: feats['get /transaction'].end,
      //   testParams: [{ type: 'toContain', params: ['hello', 'get', '/transaction'] }],
      // },
    ],
    query: [
      {
        testFunction: testFunctionsObject.queryToContain,
        testTarget: feats['get /transaction'].query.insert_transaction_from({
          table: 'from',
          columns: ['columns'],
          any: 'any',
        }),
        testParams: [{ type: 'toContain', params: ['insert', 'transaction', '(from)'] }],
      },
    ],
  },
}

const testFactory: Types['TestFactory'] = (map: Types['TestsMap']) => {
  const testFunctions: Types['TestFunction'][] = []

  for (const [methodEnd, features] of Object.entries(map)) {
    // extract method and end
    const { method, end } = methodEnd.split(' ') as [string, string]

    for (const [feature, tests] of Object.entries(features)) {
      switch (feature) {
        case 'end': {
          for (const test of tests) {
            const { testFunction, testTarget, testParams } = test
            for (const { type, params } of testParams) {
              testFunction({
                method,
                end,
                body: testTarget,
                match: { type: type, params: params },
              })
            }
          }
        }
        break
        case 'query': {
          for (const test of tests) {
            const { testFunction, testTarget, testParams } = test
            for (const { type, params } of testParams) {
              testFunction({
                method,
                end,
                query: testTarget,
                match: { type: type, params: params },
              })
            }
          }
        }
        break
        case 'handler':
          break
        case 'client':
          break
        case 'component':
          break
        case 'validate':
          break
        default:
          break
      }
    }
  }
  // return testFunctions
}

export { testFactory, testMap, Types }
