// import { Bindings } from '@quantic/config'
import { Context, Env, Hono } from 'hono'
import {
  CommonColumns,
  Feature,
  Features,
  QueryResult,
  Table,
  User,
  UserColumns,
} from '../../../core/src/domain/io/appIo'

type Bindings = {
  env: Env
  context: Context
}

/**
 * { [keyof string]: Feature<Env, Table<any>> }
 */

export const features: Features = {
  'GET__/': {
    end: '/',
    handler: (context) => {
      return context.html('Hello World')
    },
  },

  'GET__/users': {
    end: '/users',
    // [] Table<any>なので、User型を指定したい
    // storage<User>とかできないかな
    storage: {
      query: 'SELECT * FROM users',
      result: {
        rows: [
          {
            id: '1',
            name: 'Alice',
            email: 'user@mail.com',
            age: 20,
            address: 'Tokyo',
            date: '2021-01-01',
          },
        ],
      },
    },
    handler: (context) => {
      const { rows } = features['GET__/users'].storage
        ? features['GET__/users'].storage.result
        : { rows: [] }
      return context.html('Hello World')
    },
  },
}

/**
 * featuresを受け取り、appを返す関数
 */
const createApp = (
  app: Hono<{ Bindings: Bindings }>,
  features: Record<string, Feature<Env, Table<any>>>,
) => {
  for (const [key, value] of Object.entries(features)) {
    // typeof key is string
    // typeof value is Feature<Env, Table<any>>
    app.get(key, value.handler)
  }

  return app
}

// export const app = createApp(new Hono<{ Bindings: Bindings }>(), features)

export const app = new Hono()
app.get('/', (c) => c.html('Hello World'))
