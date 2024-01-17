import { jwt, verify } from 'hono/jwt'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'
import { unstable_dev } from 'wrangler'
import type { UnstableDevWorker } from 'wrangler'
import { genJwt } from './middleware/jwt'
import { authHonoApp } from './route'

describe.skip('Env var from Worker', (c) => {
  describe('', () => {
    let worker: UnstableDevWorker

    beforeAll(async () => {
      worker = await unstable_dev('src/index.ts', {
        experimental: { disableExperimentalWarning: true },
      })
    })

    afterAll(async () => {
      await worker.stop()
    })

    test.skip('should return Hello World', async () => {
      const resp = await worker.fetch()
      const text = await resp.text()
      expect(text).toMatchInlineSnapshot(`"Hello World!"`)
    })

    test('SECRET_KEY', async () => {
      expect(xxx.env.SECRET_KEY).toBe('secret')
    })
  })
})

describe('/auth from outside', () => {
  test('get /auth request check', async () => {
    const res = await authHonoApp.app.request('/auth')
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('Hello Hono!')
  })

  // prepare authorizedUser for test
  const authorizedUsers: [] = [
    { username: 'test', password: 'test' },
    { username: 'test2', password: 'test2' },
  ]

  describe.skip('/auth/login/1', () => {
    describe('正常なログイン', async () => {
      const user = '01'
      const req = new Request('/auth/login/01', {
        method: 'POST',
      })
      // 正しいユーザー名とパスワードを用いてログイン試行
      const isAuthorized =
        authorizedUsers.some(
          // (u) => u.username === user.username && u.password === user.password,
        )

      if (isAuthorized) {
        const res = await authHonoApp.app.request(req)
        describe('OTP認証', () => {
          test('メールアドレスが確認され、認証リンクが送付される', async () => {
            expect(res.status).toBe(200)
          })
        })

        describe('OTP認証後', () => {
          test('生成されたJWTが正しい形式であることを確認', async () => {
            // リクエストするとJWTが生成され、クライアントに返される
            expect(res.status).toBe(200)
            const { token } = await res.json()
            expect(token).toBeDefined()

            // JWTの形式を検証
            const jwtParts = token.split('.')
            expect(jwtParts.length).toBe(3)

            test('JWTの署名が正しいことを確認', async () => {
              // JWTの署名を検証
              let decorded
              try {
                decorded = verify(token, 'secret')
              } catch (err) {
                throw new Error('JWT singature is invalid')
              }

              expect(decorded).toBeDefined()
            })

            test('jwtの期限が近づいている場合に適切な処理が行われることを確認', async () => {
              // 期限切れ間近のJWTの処理を検証
              const decoded = await verify(token, 'secret')
              const now = Math.floor(Date.now() / 1000)
              const exp = decoded.exp
              // 閾値
              const threshold = 60 * 60

              if (exp - now < threshold) {
                // 期限切れ間近のJWTを使用してリフレッシュトークンを要求
                // 期待される結果: ステータスコード200、新しいJWTトークンが返される

                // TODO: payloadをデータベースから生成する
                const payload = {}
                const newToken = await genJwt(payload)
                expect(newToken).toBeDefined()

                const newDecorded = await verify(newToken, 'secret')
                expect(newDecorded.exp).toBeGreaterThan(decoded.exp)
              }
            })

            test('jwt生成後, ペイロードが正確に取得できることを確認', async () => {
              // JWTペイロードの取得と検証
            })
          })

          test('アクセス権限のテスト', async () => {})
        })
      }
    })

    test('無効なユーザー名', async () => {
      const req = new Request('/auth/login/01', {
        method: 'POST',
        body: {
          username: 'test3',
          password: 'test',
        },
      })
      // 存在しないユーザー名でログイン試行
      // 期待される結果: ステータスコード401（Unauthorized）、エラーメッセージが返される
      const res = await authHonoApp.app.request(req)
      expect(res.status).toBe(401)
      expect(await res.json()).toMatchObject({ message: 'Unauthorized' })
    })

    test('無効なパスワード', async () => {
      const req = new Request('/auth/login/01', {
        method: 'POST',
        body: {
          username: 'test',
          password: 'test3',
        },
      })
      // 正しいユーザー名で、間違ったパスワードを用いてログイン試行
      // 期待される結果: ステータスコード401（Unauthorized）、エラーメッセージが返される
      //
      const res = await authHonoApp.app.request(req)
      expect(res.status).toBe(401)
      expect(await res.json()).toMatchObject({ message: 'Unauthorized' })
    })

    test('リクエストフォーマットが不正', async () => {
      // 不正なフォーマット（例: パスワード欠落）でログイン試行
      // 期待される結果: ステータスコード400（Bad Request）、エラーメッセージが返される
      const req = new Request('/auth/login/01', {
        method: 'POST',
        body: {
          username: 'test',
        },
      })

      const res = await authHonoApp.app.request(req)
      expect(res.status).toBe(400)
      expect(await res.json()).toMatchObject({ message: 'Bad Request' })
    })

    test('ログイン試行回数の制限', async () => {
      const req = new Request('/auth/login', {
        method: 'POST',
        body: {
          username: 'test',
          password: 'wrong-password',
        },
      })

      // 短時間内に複数回ログイン試行
      for (let i = 0; i < MAX_LOGIN_ATTEMPTS + 1; i++) {
        const res = await authHonoApp.app.request(req)
        if (i < MAX_LOGIN_ATTEMPTS) {
          // 最大試行回数未満の場合は、ステータスコード401（Unauthorized）が返される
          expect(res.status).toBe(401)
        } else {
          // 最大試行回数を超えた場合は、ステータスコード429（Too Many Requests）が返される
          expect(res.status).toBe(429)
        }
      }
    })

    test('ログイン試行回数の制限を超えた後のログイン試行', async () => {})
  })

  describe('/auth/refresh', () => {
    test.skip('有効なリフレッシュトークンで新しいトークンを取得', async () => {
      // 有効なリフレッシュトークンを用いて新しいJWTトークンを要求
      // 期待される結果: ステータスコード200、新しいJWTトークンが返される
      // TODO: middlewareとして実装することを検討
    })

    test('無効なリフレッシュトークンの使用', async () => {
      // 無効または期限切れのリフレッシュトークンを用いてトークン更新を試みる
      // 期待される結果: ステータスコード401（Unauthorized）、エラーメッセージが返される
    })

    test('リフレッシュトークンが欠落している場合', async () => {
      // リフレッシュトークンを含まないリクエストを送信
      // 期待される結果: ステータスコード400（Bad Request）、エラーメッセージが返される
    })
  })

  describe('/auth/resetpw', () => {
    test('有効なユーザー情報でパスワードリセット', async () => {
      // ユーザー識別情報（例：メールアドレス）と新しいパスワードを送信
      // 期待される結果: ステータスコード200、パスワードがリセットされる
    })

    test('存在しないユーザー情報でパスワードリセットを試みる', async () => {
      // 存在しないユーザー情報でパスワードリセットを試みる
      // 期待される結果: ステータスコード404（Not Found）、エラーメッセージが返される
    })

    test('無効なリセットリクエスト（不適切なフォーマット）', async () => {
      // 不適切なリクエストフォーマット（例: パスワード形式が不適切）
      // 期待される結果: ステータスコード400（Bad Request）、エラーメッセージが返される
    })
  })

  describe.skip('middleware', () => {
    describe('jwt /*', () => {
      test('有効なJWTによる認証が正常に行われることを確認', async () => {
        // JWTを使用した認証リクエストの検証
      })

      describe('非認証状態のテスト', () => {
        test('無効なJWTを使用した場合に401 Unauthorizedが返されることを確認', async () => {
          // 無効なJWTを使用したリクエストの検証
        })

        test('期限切れのJWTを使用した場合に401 Unauthorizedが返されることを確認', async () => {
          // 期限切れのJWTを使用したリクエストの検証
        })
      })

      describe('認証済みユーザーのテスト', () => {
        // アクセス権限の確認
        describe('アクセス権限のテスト', () => {
          test('アクセス権限がないリソースにアクセスした場合に403 Forbiddenが返されることを確認', async () => {
            // 権限がないリソースへのアクセス試行の検証
          })
        })

        test('認証後にJWTペイロードが正確に取得できることを確認', async () => {
          // JWTペイロードの取得と検証
        })

        test('JWTの期限が近づいている場合に適切な処理が行われることを確認', async () => {
          // 期限切れ間近のJWTの処理を検証
        })
      })

      describe('/auth/refresh トークンリフレッシュのテスト', () => {
        test('有効なリフレッシュトークンで新しいJWTが発行されることを確認', async () => {
          // リフレッシュトークンを使用した新しいJWTの発行を検証
        })

        test('無効なリフレッシュトークンを使用した場合に適切なエラーレスポンスが返されることを確認', async () => {
          // 無効なリフレッシュトークンを使用したリフレッシュ試行の検証
        })
      })
    })

    describe('cors /*')
  })
})
