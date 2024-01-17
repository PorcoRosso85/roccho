/**
 * このファイルは、テスト関数の契約を定義するファイルです。
 *
 * @example
 * interface FeatureTest {}
 * interface
 */
import { Env } from 'hono'
import { features } from '../route'
import { Feature, Features, Table, Types, User, UserColumns } from './io/appIo'
import { browserWorkerConn } from './io/appIo.test'
import { ViewTransition } from './view'

/**
 * テスト関数の契約を定義する
 * この契約は、このプロジェクトのすべてのテスト関数が満たすべきものです。
 */
export interface TestFunction {
  (params: {
    method: string
    end: string
    body?: string
    query?: string | string[]
    context: {
      type: string
      params: string[]
    }
  }): void
}

/**
 * テスト関数の実装一覧を格納するオブジェクトを定義する
 */
export type TestFunctionImplement = {
  [key in string]: TestFunction
}

export interface TestMap {
  testFunction: TestFunction
  testTarget: any
  textContexts: {
    type: TestTypes
    params: string[]
  }[]
}

export type TestMapImplement = {
  // このkeyは、Types.Featuresのkeyを表現する文字列
  // ViewTransitionのkeyを表現する文字列そのままではあるが、Featuresに依存させる
  [K in keyof Features]: TestMap[]
}

export type TestTypes = 'toBe' | 'toEqual' | 'toMatchObject' | 'toContain' | 'toContainEqual'

export type TestFactory = (testMap: {
  [key: string]: TestMap
}) => void
