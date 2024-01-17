/**
 * このファイルは、Featureのテスト関数を定義するファイルです。
 * このファイルの完了は、Featureの
 */
import path from 'path'
import { Bindings } from '@quantic/config'
import { Context, Env, Hono } from 'hono'
import { DurableObjectsOptionsSchema, Miniflare } from 'miniflare'
import { Test, afterAll, beforeAll, describe, expect, expectTypeOf, test } from 'vitest'
import { UnstableDevWorker, unstable_dev } from 'wrangler'
import { features } from '@PorcoRosso85/app/src/route/route'
import { browserWorkerConn } from '../io/appIo.test'
import { TestFactory, TestFunction, TestFunctionImplement, TestMap, TestMapImplement } from '.'

/**
 * FeatureTest型を使って、Featureのテスト関数を定義します。
 * @example
 *
 * const featureTests: FeatureTest[] = [
 *  {
 *   test: 'test',
 *   end: '/test',
 *   handler: async () => new Response('test'),
 *  },
 * ]
 */
const testFunctionImplement: TestFunctionImplement = {
  browserWorkerConn: browserWorkerConn,
}

const testMapImplement: TestMapImplement = {
  'GET__/': [
    {
      testFunction: browserWorkerConn,
      testTarget: features['GET__/'].end,
      textContexts: [
        {
          type: 'toContain',
          params: ['Hello World'],
        },
      ],
    },
  ],
  'GET__/users': [],
  'GET__/account': [],
}

/**
 * testFactory関数は、testMapImplementを受け取り、実行するtestFunctionImplementからテスト関数を選択し、実行します。
 * @param testMapImplement: TestMapImplement
 */
const testFactory: TestFactory = (testMapImplement: TestMapImplement) => {
  for (const [MethodEnd, testMaps] of Object.entries(testMapImplement)) {
    const [method, end] = MethodEnd.split('__')

    for (const testMap of testMaps) {
      // testMapのtestFunctionを取得する
      const testFunction: TestFunction = testMap.testFunction

      // testMapのtestTargetを取得する
      const testTarget = testMap.testTarget

      // testMapのtestContextsを取得する
      const testContexts = testMap.textContexts
      console.debug('testContexts', testContexts)

      for (const testContext of testContexts) {
        // testFunctionを実行する
        testFunction({
          method: method,
          end: testTarget,
          body: undefined,
          query: undefined,
          context: testContext,
        })
      }
    }
  }
}

testFactory(testMapImplement)
