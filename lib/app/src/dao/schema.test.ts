/**
 * このファイルは、テスト用のファイルです。
 */

/**
 * Miniflareを使用して、すべてのテーブル・カラムが
 * 適切に作成されているかどうかを確認します。
 */
import { Miniflare } from 'miniflare'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { endpoints } from '../route/index'
import * as schema from './schema'

// [] すべてのDDL（各テーブルのDDL）に関してテストを追加する
describe('test ./schema functions', async () => {
  describe('test genDdl function', async () => {
    test('gen ddl contains required queries', async () => {
      const ddl = schema.genDdl(schema.userTableTypeBox)
      console.debug(ddl)
      expect(ddl).toContain('CREATE TABLE user')
      expect(ddl).toContain('user_id TEXT')
      expect(ddl).toContain('user_name TEXT')
      expect(ddl).toContain('user_role TEXT')
      expect(ddl).toContain('email TEXT')
      expect(ddl).toContain('created_at TEXT')
      expect(ddl).toContain('other_info TEXT')
    })
  })
})

describe('test queries with miniflare', async () => {
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
  const tables: any[] = []
  tables.push(schema.userTableTypeBox)

  for (const table of tables) {
    const ddl = schema.genDdl(table)
    // console.debug('ddl', ddl)
    await d1db.exec(ddl)
  }

  test('assert table', async () => {
    const { results } = await d1db.prepare('SELECT * FROM sqlite_master;').all()
    const tableNames = results.map((result) => result.name)
    // console.debug('tableNames', tableNames)
    expect(tableNames).toContain('user')
    // expect(tableNames).toContain('account')
  })

  describe('after table asserted...', async () => {
    const { results } = await d1db.prepare('PRAGMA table_info(user);').all()
    const columnNames = results.map((result) => result.name)
    test('user.register column has been created', async () => {
      expect(columnNames).toContain('user_id')
      expect(columnNames).toContain('user_name')
      expect(columnNames).toContain('user_role')
      expect(columnNames).toContain('email')
      expect(columnNames).toContain('created_at')
      expect(columnNames).toContain('other_info')
    })

    describe('validate inserted user.register', async () => {
      console.debug('user.register columnNames', columnNames)

      beforeAll(async () => {
        const query = `insert into user (user_id, user_name, user_role, email, created_at, other_info) values ('user_id', 'user_name', 'user_role', 'email', 'created_at', 'other_info');`
        await d1db.prepare(query).run()
      })

      test('validate inserted user.register', async () => {
        const { results } = await d1db.prepare('SELECT * FROM user;').all()
        console.debug('results', results)
        expect(results.length).toEqual(1)
        expect(results[0].email).toEqual('email')
        expect(results[0].user_id).toEqual('user_id')
        expect(results[0].user_name).toEqual('user_name')
        expect(results[0].user_role).toEqual('user_role')
      })
    })
  })
})

// []
/**
 * 実際のデータベースに接続して、
 * テーブル・カラムが適切に作成されているかどうかを確認します。
 */
