import { Client } from 'pg'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest'

import fs from 'fs'
import path from 'path'
// import {
//   createAccount,
//   deleteAccount,
//   getAccount,
//   listAccounts,
// } from '../src/gen/sqlc/pg/account_sql'

import { deleteUser, editUser, getUserInfo, getUserRole, insertItem, insertUser } from './query_sql'

import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers'

describe('user', async () => {
  let client: Client
  let container: StartedTestContainer

  beforeEach(async () => {
    // PostgreSQL コンテナを起動
    container = await new GenericContainer('postgres:latest')
      .withEnvironment({
        POSTGRES_DB: 'testdb',
        POSTGRES_USER: 'user',
        POSTGRES_PASSWORD: 'password',
      })
      .withExposedPorts(5432)
      // TCPポートが利用可能になるまで待機
      .withWaitStrategy(Wait.forListeningPorts())
      .start()

    // postgres クライアントの設定
    client = new Client({
      host: container.getHost(),
      port: container.getMappedPort(5432),
      database: 'testdb',
      user: 'user',
      password: 'password',
    })
    await client.connect()

    // データベースへの ping (接続テスト)
    await client.query('SELECT 1')

    // ファイルを読み込んでSQL文を取得
    const sqlFilePath = path.resolve(__dirname, '../postgresql/models/economy/schema.sql')
    const schemaSQL = fs.readFileSync(sqlFilePath, 'utf-8')

    // スキーマの初期化
    await client.query(schemaSQL)
  })

  afterEach(async () => {
    await client.end()

    // コンテナを停止
    await container.stop()
  })

  test('Insert user and select', async () => {
    // await createAccount(client, { id: 'spam', displayName: 'Egg', email: 'ham@example.com' })
    await insertUser(client, {
      userId: 1,
      userName: 'user',
      email: 'user@mail.com',
      registeredAt: new Date(),
    })

    const users = await getUserInfo(client, { userId: 1 })
    expect(users?.userId).toBe(1)
    expect(users?.userName).toBe('user')
    expect(users?.email).toBe('user@mail.com')
    expect(users?.registeredAt).not.toBe(null)
  }, 30_000)

  test('Update user and delete', async () => {
    await insertUser(client, {
      userId: 1,
      userName: 'user',
      email: 'user@mail.com',
      registeredAt: new Date(),
    })
    let user = await editUser(client, {
      userId: 1,
      userName: 'user+',
      email: 'user+@mail.com',
      registeredAt: new Date(),
    })

    expect(user?.userId).toBe(1)
    expect(user?.userName).toBe('user+')
    expect(user?.email).toBe('user+@mail.com')
    expect(user?.registeredAt).not.toBe(null)

    await deleteUser(client, { userId: 1 })
    user = await getUserInfo(client, { userId: 1 })
    expect(user).toBe(null)
  }, 30_000)

  test('Insert role and select', async () => {
    await insertUser(client, {
      userId: 1,
      userName: 'user',
      email: 'user@mail.com',
      registeredAt: new Date(),
    })

    const item = await insertItem(client, {
      itemId: 1,
      itemName: 'item01',
      ownerUserId: 1,
      lastUpdated: new Date(),
    })

    expect(item?.itemId).toBe(1)
    expect(item?.itemName).toBe('item01')
    expect(item?.ownerUserId).toBe(1)
    expect(item?.lastUpdated).not.toBe(null)
  })
})
