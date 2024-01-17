/**
 * このファイルは、このプロジェクトが必ず経由すべきinterfaceを定義するファイルです。
 */

/**
 * このプロジェクトで使用するinterfaceを定義します。
 * このプロジェクトは
 * - honoフレームワークを使用するWebAPIアプリケーション
 * - cloudflare workerを基盤として使用
 * - SSRも行い、コンテキストにはhtmlを追加してレスポンスする
 * という特性を持っています。
 */

import { Context, Env } from 'hono'
import { ViewTransition } from '../view'

/**
 * Tablesは、プログラムから生成されるDDLが
 * テーブル定義に適合しているかを検証するためのinterfaceです。
 */
interface CommonColumns {
  id: string
  date: Date
}

/**
 * UserColumnsは、usersテーブルのカラムを表現するためのinterfaceです。
 * このinterfaceは、CommonColumnsを継承することで、
 * idとdateを持つことを保証しています。
 */
interface UserColumns extends CommonColumns {
  name: string
  email: string
  age: number
  address: string
}

/**
 * Tableは、テーブル定義を表現するためのinterfaceです。
 * このinterfaceは、ジェネリクス型がCommonColumnsを継承することで、
 * idとdateを持つことを保証しています。
 */
interface Table<T extends CommonColumns> {
  tableName: string
  columns: T
}

interface User extends Table<UserColumns> {
  tableName: 'users'
  columns: UserColumns
}

/**
 * QueryResult型は、SQLのクエリ結果を表現するための型です。
 * @example
interface User {
  id: number;
  name: string;
  email: string;
}

{
  rows: [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    // 他のユーザー...
  ],
  count: 2 // rowsの要素数
}
 * この型があることで以下の点が保証されます。
  * - テーブル定義とクエリ結果の型が一致している
 */
interface QueryResult<T extends Table<any>> {
  rows: T['columns'][]
  count?: number
}

/**
 * Featureは、honoフレームワークが
 * サーバーで定義されるべき機能を定義するためのinterfaceです。
 *
 * end:
 * - エンドポイントを表現する文字列
 *
 * storage:
 * - クエリ結果を保持するためのオブジェクト
 * - query: クエリを表現する文字列
 * - result: クエリ結果を表現するオブジェクト
 *
 * handler:
 * - エンドポイントに対する処理を表現する関数
 * - contextを受け取り、Responseを返す
 * - contextは、honoフレームワークが提供するもの
 * - Responseは、cloudflare workerが提供するもの
 *
 */
interface Feature<T extends Env, U extends Table<any>> {
  end: string
  storage?: {
    query: string
    result: QueryResult<U>
  }
  handler: (context: Context<T>) => Response | Promise<Response>
}

export type Features = {
  [K in keyof ViewTransition]: Feature<Env, Table<any>>
}

export { CommonColumns, UserColumns, QueryResult, Feature, Table, User }
