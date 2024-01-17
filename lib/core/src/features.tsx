import { tbValidator } from '@hono/typebox-validator'
import { type Static, Type } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
/**
 * motivation: ポイントエコノミーシステムのルーティングを作成する
 */
import { Context, Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import * as schema from '../dao/schema'
import { T } from '../dao/schema'
import { errors } from './error/error'

type BaseType = {
  endpoint: string
  error: object
  [key: string]: any
}

type GetType<T = any> = BaseType & {
  query: (params: T) => string
}

type PostType = BaseType & {
  validate: (c: Context) => void
  query: any
}

type DeleteType<T = any> = BaseType & {
  query: (params: T) => string
}

type PutType<T = any> = BaseType & {
  validate: (c: Context) => void
  query: (params: T) => string
}

const endpoints = {
  /**
   * ポイントエコノミーシステムの初期ページを表示するためのHTMLとTailwindCSS, ハイドレーションするJavascriptを作成します。
   * javascriptのスクリプトは、scriptタグの中に記載します。
   *
   */
  // [] 基本的なルートから エラーハンドリング一通り データベースの操作一通り
  root: {
    endpoint: '/economy',
    query: (id: string) => {
      return `select * from root where ID = ${id}`
    },
    /**
     * 200, 404, 500以外のステータスコード
     *
     * 下記はhonoよりさらに深いバックエンドレイヤーでのエラーのハンドリング処理を想定します。
     * - return status code
     *  - 5xx
     *   - 500: "Internal Server Error - サーバー内部で問題が発生した。",
     *   - 501: "Not Implemented - サーバーがリクエストを実行する機能を持っていない。",
     *   - 502: "Bad Gateway - サーバーがゲートウェイやプロキシとして動作中に無効な応答を受け取った。",
     *   - 503: "Service Unavailable - サーバーが一時的にリクエストを処理できない。通常、過負荷やメンテナンスのため。",
     *   - 504: "Gateway Timeout - ゲートウェイ・プロキシサーバーがタイムアウトした。",
     *   - 505: "HTTP Version Not Supported - サーバーがリクエストで使用されているHTTPバージョンをサポートしていない。",
     *   - 506: "Variant Also Negotiates - 透過的な内容交渉で内部設定エラーが発生した。",
     *   - 507: "Insufficient Storage - サーバーに十分なストレージがない。",
     *   - 508: "Loop Detected - サーバーがリクエストの処理中に無限ループを検出した。",
     *   - 510: "Not Extended - リクエストの処理にはさらなる拡張が必要。",
     *   - 511: "Network Authentication Required - ネットワークアクセスを得るために認証が必要。"
};
     *  - 4xx
     *   - 400 if validation error
     *   - 401 if not authorized => deprecated
     *   - 403 if forbidden
     *   - 404 if not found
     *   - 405 if method not allowed => deprecated
     *   - 406 if not acceptable => deprecated
     *   - 409 if conflict => deprecated
     *   - 415 if unsupported media type => deprecated
     *   - 422 if unprocessable title => deprecated
     *   - 429 if too many requests => deprecated
     *   - 451 if unavailable for legal reasons => deprecated
     *  - 3xx
     *   - 301 if moved permanently
     *   - 302 if found => deprecated
     *   - 303 if see other => deprecated
     *   - 304 if not modified => deprecated
     *
     *   - 307 if temporary redirect => deprecated
     *   - 308 if permanent redirect => deprecated
     *  - 2xx
     *   - 200 if ok
     *   - 201 if created => deprecated
     *   - 202 if accepted => deprecated
     *   - 203 if non-authoritative information => deprecated
     *
     */
    /**
     * 上記の要件から、このエンドポイントで想定されるエラーは
     * 200, 404, 500を除いて
     *  -
     */
    error: {},

    /**
     * apiレート制限
     */
    limit: {},
  } as GetType,

  user: {
    /**
     * ユーザー情報
     */
    root: {
      endpoint: '/economy/user',
    } as GetType,

    /** ログイン */
    login: {} as PostType,

    /** ログアウト */
    logout: {},
    /**
     * ユーザー登録
     * formデータを受け取るためのUIを提供し、
     * formデータを受け取り、データベースを更新します。
     */
    register: {
      /**
       * ユーザー登録
       * post
       */
      endpoint: '/economy/user/register',
      /**
       * @param c
       * - email
       * - user_id
       * - user_name
       * - user_role
       */
      middleware: {
        validation: tbValidator('form', schema.userTableTypeBox.columns, (result, c) => {
          // []untested
          console.debug('result', result)
          if (!result.success) {
            return c.text('Invalid!', 400)
          }
        }),
      },
      /**
       * formデータを受け取るためのUIを提供し、
       * formデータを受け取り、
       * データベースに登録します。
       */
      query: {
        insert_user: (params: Static<typeof schema.userTableTypeBox.columns>) => {
          return `INSERT INTO user (user_id, user_name, user_role, email) VALUES ('${params.user_id}', '${params.user_name}', '${params.user_role}', ${params.email});`
        },
      },
      /**
       * このエンドポイントで想定されるエラーは
       * 200, 404, 500を除いて
       * - 400 if validation error
       */
      error: {},
    },

    /**
     * ユーザー更新
     * formデータを受け取るためのUIを提供し、
     * formデータを受け取り、データベースを更新します。
     */
    update: {
      endpoint: '/economy/user/update',
      query: {},
      /**
       * このエンドポイントで想定されるエラーは
       * 200, 404, 500を除いて
       * - 400 if validation error
       */
      error: {},
    },

    /** */
    delete: '/economy/user/delete',

    setting: {
      /** */
      root: '/economy/setting',

      /** */
      auto: '/economy/setting/auto', // 自動設定（分配率、配当率）
    },

    /** */
    notification: '/economy/notification', // 通知
  },

  bank: {
    /**
     * バンク, 口座, 勘定科目
     * バンクの作成、更新、削除を行います。
     * ユーザーは最低一つのバンクを持ちます
     * バンクは一意のIDを持ち、
     * IDは「ユーザーID＋バンク名」で構成されます。
     */
    root: '/economy/bank',

    /**
     * バンク作成
     * バンクの作成を行います。
     * バンクは一意のIDを持ち、
     * IDは「ユーザーID＋バンク名」で構成されます。
     *
     */
    create: {
      endpoint: '/economy/bank/create',
      query: {
        insert_bank: (params: Static<typeof schema.bankTableTypeBox.columns>) => {
          return `INSERT INTO bank (bank_id, bank_name, bank_type) VALUES ('${params.bank_id}', '${params.bank_name}', '${params.bank_type}');`
        },
        /**
         *
         * 既存のbank_idを取得します。
         * この関数は、bank_idがユニークであることを保証するために必要です。
         * bank_idがバリデーションされたときのみ、クエリを実行します。
         */
        select_bank_id: (bank_id: string) => {
          return Value.Check(T.bankId, bank_id)
            ? `SELECT bank_id FROM bank WHERE bank_id = '${bank_id}';`
            : (() => {
                throw new Error('invalid bank id')
              })()
        },
      },
      /**
       * bank_idの生成
       * bank_nameのバリデーションを強化し, バリデーションに成功した場合のみbank_idを生成します。
       */
      generateBankId: (user_id: string, bank_name: string) => {
        return Value.Check(T.bankName, bank_name)
          ? `${user_id}_${bank_name}`
          : (() => {
              throw new Error('invalid bank name')
            })()
      },
      /**
       * 生成されたbank_idがデータベースに存在しないことを保証
       * この関数は、bank_idがユニークであることを保証するために必要です。
       *
       * @param {string} bank_id - バンクID
       * @returns {boolean} - バンクIDが存在しない場合はtrueを返します。
       */
      // [] untested
      validateAccountIdInDatabase: (bank_id: string) => {
        // query bank_id
        const query = endpoints.bank.create.query.select_bank_id(bank_id)
      },
      validate: (c: Context) => {},
      /**
       * このエンドポイントで想定されるエラーは
       * 200, 404, 500を除いて
       * - 400 if validation error
       */
      error: {},
    } as PostType,

    update: '/economy/bank/update',
    delete: '/economy/bank/delete',

    /**
     * アカウント内のメンバーとその権限を表示します。
     */
    member: {
      invite: {},
      permission: {},
    },
  },

  transaction: {
    /**
     * 取引実行前のバリデーション
     * 取引実行前にサーバーに確認し、実行可能かどうかを判断します。
     * バリデーション対象は、
     * - 取引元の残高
     * - 取引先のエンティティの存在
     */
    validOrNot: {
      endpoint: '/economy/transaction/validornot',
      query: {
        /**
         * 取引元の残高をselect
         * @param {string} title_id - 取引元のID
         * @returns {number} - 取引元の残高を返します。
         */
        select_originating_title_balance: (title_id: string) => {},
        /**
         * 取引先のエンティティの存在をselect
         * @param {string} title_id - 取引先のID
         * @returns {boolean} - 取引先のエンティティが存在する場合はtrueを返します。
         */
        exists_target_title: (title_id: string) => {},
      },
      /**
       * このエンドポイントで想定されるエラーは
       * 200, 404, 500を除いて
       * - 400 if validation error
       */
      error: {},
    },

    /**
     * 二重取引防止
     */
    duplicatedOrNot: {
      endpoint: '/economy/transaction/duplicatedornot',
      query: {},
      /**
       * このエンドポイントで想定されるエラーは
       * 200, 404, 500を除いて
       * - 400 if validation error
       */
      error: {},
    },

    /**
     * 取引
     * 取引とは、ある口座から別の口座への数値の移動です。
     * この口座のユーザーは問わず、
     * 自らの別の口座への移動も取引として、あるいは、
     * 別のユーザーの口座への移動も取引として扱います。
     *
     * 取引を行うためのUIを提供し、取引を行うロジックを実行、データベースを更新します。
     */
    execute: {
      /**
       * 取引実行
       * 取引の種類は、取引の説明によって決定されます。
       */
      endpoint: '/economy/transaction/execute',
      /**
       * debitトランザクションのinsert
       * creditトランザクションのinsert
       */
      query: {},
      /**
       * このエンドポイントで想定されるエラーは
       * 200, 404, 500を除いて
       * - 400 if validation error
       */
      error: {},
    },
    /**
     * ユーザー情報
     * ユーザーの各残高を表示します。
     */
  },

  /**
   * 勘定科目
   * 該当する科目に関する情報を表示します。
   */
  title: {
    /**
     * バンクが持つ勘定科目の一覧を表示します。
     */
    info: {},
    balance: {},

    /** 勘定科目の取引履歴 */
    history: {},
  },

  open: {
    /**
     * アルゴリズムエンドポイントは、
     * 基準となる数値と選択されたアルゴリズムから計算された数値を返します。
     */
    algorithm: {
      basic: {
        /**
         * このエンドポイントは、リクエストした数値をそのまま返します。
         */
        oneToOne: {
          endpoint: '/economy/open/algorithm/basic/oneToOne',
        },
      },
      bankingStandards: {
        /**
         * 日本の会計基準
         */
        jpn: {
          endpoint: '/economy/open/algorithm/accountingStandards/jpn',
          middleware: {},
          query: {},
        },
        /**
         * 国際会計基準
         */
        global: {
          endpoint: '/economy/open/algorithm/accountingStandards/global',
          middleware: {},
          query: {},
        },
      },
    },
  },

  support: '/economy/support', // サポート
}

const app = new Hono()

app
  .use(logger())

  .use(cors())

  .use(
    // jwt auth middleware
    // if authed
    // if not authed
  )

  .get('/', (c) => {
    return c.html(
      <div hx-target="next div">
        <button type="button" hx-get={endpoints.user.root} />
        {/* {Object.keys(endpoints).map((key) => {
            if (typeof endpoints[key] === 'string') {
              return <button type="button" hx-get={endpoints[key]} />
            }
            return Object.keys(endpoints[key]).map((key2) => {
              return <button type="button" hx-get={endpoints[key][key2]} />
            })
          })} */}
        <div />
        <script>console.log('hello world')</script>
      </div>,
    )
  })

// .post(
//   endpoints.user.register.endpoint,
//   /**
//    *
//    * @param c
//    * @returns
//    * handler is required to
//    * - parse body
//    * - insert data to database
//    * - check inserted or not
//    */
//   async (c: Context) => {
//     const { email, user_name, user_role } = await c.req.parseBody()
//     const user_id = crypto.getRandomValues(new Uint32Array(1))[0].toString(16)
//     console.debug('user_id', user_id)

//     // tested
//     const query = endpoints.user.register.query.insert_user({
//       email,
//       user_id,
//       user_name,
//       user_role,
//     })
//     // TODO: when test this, 'unstable_dev' is required
//     await c.env.D1DB.prepare(query)

//     // TODO: untested
//     // check inserted or not
//     const query2 = "select * from user where user_id = 'user_id'"
//     const result = await c.env.D1DB.prepare(query2)
//     if (result === null) {
//       // return status code 500
//       // TODO: check this or 'onError' in hono
//       c.status(500)
//       c.header('X-Status-Reason', 'User not inserted')
//       c.header('X-Message', 'User not inserted')
//       return c.html(<div>user not inserted</div>)
//     }
//     return c.html(<div>user inserted</div>)
//   },
// )

export { app }
