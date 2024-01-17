import { Context, Hono } from 'hono'
import { Types } from '../domains/types'
import { Ends } from '../domains/types/feats'

const app = new Hono()

// これにより、FeatsオブジェクトはStatesのキーのみを含むことが保証されます
const feats: Ends = {
  // const feats = {
  notFound: {
    end: 'notfound',
    error: {},
  },

  onError: {
    end: 'onerror',
    error: {},
  },

  /**
   * /user, /bank, /transaction, /support機能のトリガーを提供する
   * トリガーは、各エンドポイントへのアンカー要素
   */
  'get /': {
    end: '/',
    error: {
      ROOT_NOT_FOUND: 'Root component not found',
      ANCHORS_NOT_FOUND: 'Anchors not found',
      RENDER_ERROR: 'Error occurred while rendering',
    },

    // []リロードしたときbody以外リロードさせなければ、bodyにhtml（あるいは局所的css, js）を追加するだけでいい、body=htmlにできる
    client: {
      anchors: ['/user', '/bank', '/transaction', '/support'],
      elements: {
        /**
         * client側が持つ機能を一括で提供する
         * 機能一覧
         * - hx-boost
         * - htmx preload extension
         * - service-workerスクリプト, PWA
         * - layout
         */
        Root: (props = { children: null }) => {
          return (
            <div hx-boost="true" {...props}>
              {props.children}
            </div>
          )
        },
        anchors: (): JSX.Element[] | undefined => {
          return feats['get /'].client?.anchors.map((url, index) => (
            <>
              <a key={index.toString} href={url} hx-target="next main">
                {url}
              </a>
              <br />
            </>
          ))
        },
        Header: () => {
          return (
            <header>
              <h1>Header</h1>
            </header>
          )
        },
      },
    },
    handler: async (c: Context) => {
      const RootCompo = feats['get /'].client?.elements.Root
      return RootCompo !== undefined
        ? c.render(
            <div hx-target="next main">
              <RootCompo>{feats['get /'].client?.elements.anchors()}</RootCompo>
              <main />
            </div>,
          )
        : // エラーならhonoのエラーハンドラーに任せる:w
          logger({
            level: LogLevelConst.ERROR,
            message: feats['get /'].error.ROOT_NOT_FOUND,
            timestamp: Date.now(),
          })
    },
  },

  /**
   * /user/*機能のトリガーを提供する
   * トリガーは、各エンドポイントへのアンカー要素
   */
  'get /user': {
    end: '/user',
    error: {},
    client: {
      anchors: ['/user/setting', '/user/register', '/user/update', '/user/delete'],
      elements: {},
    },
  },

  /**
   *
   */
  'post /user/register': {
    end: '/user/register',
    /**
     *
     */
    error: {},
    validate: (c) => {
      const { name, email } = c.req.parseBody()
      if (!name || !email) {
        throw new Error('name or email is empty')
      }
    },
    /**
     * @param c
     * - email
     * - user_id
     * - user_name
     * - user_role
     */
    query: {
      insert_user: (params) => '',
    },
    /**
     * component should render anchor tag to
     * - /user
     */
    client: {
      anchors: ['/user'],
      elements: {
        /** anchorsのリンクへのanchor要素 */
        // [] todo
        anchors: () => {
          return feats['post /user/register'].client?.anchors.map((url, index) => (
            <a key={index.toString} href={url}>
              {url}
            </a>
          ))
        },
      },
    },
  },

  'get /bank': {
    end: '/bank',
    error: {},
  },

  'get /transaction': {
    end: '/transaction/:from/:to',
    error: {},
    query: {
      insert_transaction_from: (params) =>
        `insert into transaction (from) values (${params.any.from})`,
      insert_transaction_to: (params) => `insert into transaction (to) values (${params.any.to})`,
    },
    handler: async (c: Context<{ Bindings: Bindings }>) => {
      const { from, to } = c.req.param()
      const query = feats['get /transaction'].query.insert_transaction({
        from,
        to,
      })
      // query: string[], then, generate db.prepare(query[0]), db.prepare(query[1])
      // await c.env.D1DB.batch([c.env.D1DB.prepare(query[0]), c.env.D1DB.prepare(query[1])])
      // refactor
      for (const q of query) {
        await c.env.D1DB.batch([c.env.D1DB.prepare(q)])
      }

      // check insert result
      const result = await c.env.D1DB.prepare('select * from transaction').run()

      return c.json(result)
    },
  },
}

app.get('/', async (c) => c.html('hello world'))
// app
//   .notFound((c) => c.text('not found'))

//   .onError((e, c) => {
//     console.error(e)
//     c.status(500)
//     return c.text('on error')
//   })

//   .get(feats['get /'].end, feats['get /'].handler)

//   .get(feats['get /user'].end, (c) => {
//     return c.text('get /user')
//   })

//   .get(feats['get /bank'].end, (c) => {
//     return c.text('get /bank')
//   })

//   .post(feats['post /user/register'].end, (c) => {
//     return c.html(<>{feats['post /user/register'].client?.elements.anchors()}</>)
//   })

export { app }
