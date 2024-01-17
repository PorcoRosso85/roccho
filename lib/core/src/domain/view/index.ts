/**
 * このファイルは、画面遷移の契約を表現するファイルです。
 * この表現をもとに、画面遷移の実装を行います。
 * その実装のために、このファイル内で遷移の契約も定義し制約を設けます。
 * // https://stately.ai/registry/editor/19f6abeb-e3c3-464b-828b-8df038bdc47d
 */
import { createMachine } from 'xstate'

export const machine = createMachine(
  {
    id: 'economy',
    initial: '/',
    states: {
      '/': {
        on: {
          clickA: {
            target: '/user',
          },
          clickB: {
            target: '/account',
          },
        },
      },
      '/user': {
        on: {
          click: {
            target: '/account',
          },
        },
      },
      '/account': {},
    },
    schema: {
      events: {} as { type: '' } | { type: 'click' } | { type: 'clickA' } | { type: 'clickB' },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {},
    services: {},
    guards: {},
    delays: {},
  },
)

const states = {
  'GET__/': {
    on: {
      clickA: {
        target: '/user',
      },
      clickB: {
        target: '/account',
      },
    },
  },
  'GET__/users': {
    on: {
      click: {
        target: '/account',
      },
    },
  },
  'GET__/account': {},
} as const

export type ViewTransition = {
  [K in keyof typeof states]: {
    // extract event like 'click'
    [L in keyof (typeof states)[K]['on']]: {
      target: (typeof states)[K]['on'][L]['target']
    }
  }
}
