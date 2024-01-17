import { verify } from 'hono/jwt'
import { describe, expect, test } from 'vitest'
import { genJwt } from './jwt'

describe('jwt', async () => {
  test('genJwt()から、生成されるjwtが正しいこと', async () => {
    const secret = process.env.JWT_SECRET_KEY
    const payload = {
      sub: 'user123',
      role: 'admin',
    }

    const token = await genJwt(payload)

    // トークンが正しく生成されることを確認
    expect(token).toBeTruthy()

    // 生成したトークンを検証
    if (!secret) {
      throw new Error('JWT_SECRET_KEY is not defined')
    }
    const decodedPayload = await verify(token, secret)

    // 検証したペイロードが元のペイロードと一致することを確認
    expect(decodedPayload).toEqual(payload)
  })
})
