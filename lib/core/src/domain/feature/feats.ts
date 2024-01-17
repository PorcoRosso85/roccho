import { Context } from 'hono'
import { createMachine } from 'xstate'

export { GetType, PostType, DeleteType, PutType, Ends }

import { states } from '../states'
import { Types } from '../v2'
import { Query, QueryOperationType, TableFromTypeBox } from '../v2/util'

const featsTypeStates = {
  Ends: {
    on: {
      ifGetMethod: 'GetType',
      ifPostMethod: 'PostType',
      ifDeleteMethod: 'DeleteType',
      ifPutMethod: 'PutType',
    },
  },
  Query: {},
  QueryOperation: {
    on: { extractedFrom: 'TableFromTypeBox' },
  },
  TableFromTypeBox: {},
  BaseType: {
    on: {
      useAsType: 'Query',
    },
  },
  GetType: {
    on: { extends01: 'BaseType' },
  },
  PostType: {
    on: { extends01: 'BaseType', useAsParam: 'Context' },
  },
  DeleteType: {
    on: { extends01: 'BaseType' },
  },
  PutType: {
    on: {
      extends01: 'BaseType',
      useAsParam: 'Context',
    },
  },
  Context: {},
}

export const featsTypeStateMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDcCWYDusAEBDAdhNmADZgC2Y+ALrAHQCihsAxKgGYDiY1AsjwAsA9hADaABgC6iUAAchsVNVRD8MkAA9EAJgDM2ugDYArIe0B2ACzGAjAA5jdmzcsAaEAE8d583RvbjcW1Dc0NxcUMbYwBfaPc0TBwCIlIKKlpGZjZ2AAUFPkERCWkkEHlFZVV1LQQ9AxMzK1sHJxd3LwR7YzonAJtDAE5w8ztLXVj49Cw8QmIyShp6JghWDgARVOowfmphMSl1cqUVNVKauqNTC2su1rdPRF1dbrDw3RcbXRDxSwmQBOmyTmaUWmRW2RyAFcCrsigdSkdKqdQOd9JdGjcWs57h07HY6OI7OZAmYTENTOM4v8pklZqkFhkAIqQsAAJw8AHlZGzcEiWGANNRWbgAMZbCAAMVZQnIxUOCmOVTOOjRDWuzUc2PajwGlgJxPEXwi5gsA105j+ANpKXm6XoACFcLAwAAVDzcliQ50AQVgbu5coRCqR1UQeMMdHMZtGXxNPl0dm1tVVNnC2hsQyjdl04hiVKtMxtIIy3Go-rA-MFVBW4hsgbkwZOoYQxgGAzoxnNndslnMqeJSYsvn8gWCoXCkTzk0SheBDPoeVgZfdFYFW2YtfrZUbSpRiFb7c7xOeLj74gHD1q2nxwQC6csllv6cp08BdNtoMXy49XrAvpyuDCrK8INhUTbKi2bYdl2J69v2xhJjYUZ0JY4S1pEfR2Nelo0rO9J2nQGxkFs5aVuuNZ1iB25gbumj7lBR7dqe8FJk8Lxoe8lifN8vz5rhQL4Z+0KkWu1awJuVGIuBe6QYeME9meF4dJ84jQcSqZ2OeVi6A+OEzgJH4ZFC34Vr+-6AbgwElKBirInRslqUxcHnghl5OEYBq5pYQw5lxlJUvgIhwOoBYGcW8BBjRdk1AAtIYSZxQSaHJSl556W+RbzmCEU2SGEEDAYwREoY5rmISehIUmUH6F2UZmj5lh2Ol1pzgRzJsh0uXSfZqbXn44S9TpfbhoOaI5qV2h6AMdjTZNzV4YZ9DteyXI8nlXW0TUj6sWakaGESdglW2GaWIY81hVlLq4AARmQUoyuW9pCDUG3RYgqERsSGLGNcp2nTtuh7QdR0DCdZ18fp77hXQjrOuW8pRc2oQGM4AS9qYjigwMo0GONPiTbo02zedUNZaW8ORbZzYPqp1icbqJWE1GrkdBYEZOESPjiFjoSGLxr4tYJRn5BTr3Uz9dD6GeRLaAMJWNfFl5dB2ERjnUgwMyTmUEURPCuiuCNUxBYwGMYIwuDNUbmiYrHPHQsvmk4TSOBjWutUJJmG+t9l05LP39j4nYc0mRKRr0GMDCM2iEm7Qv0AAwqoWyCl73U1MjfgjujJgzRmIf4pE1gzWazjGH5sSxEAA */
  id: 'views and elements',
  tsTypes: {} as import('./feats.typegen').Typegen0,
  schema: {
    // context: {} as { contextType },
    events: {} as { type: 'eventType' },
  },
  context: {
    // initialContextValue,
  },
  initial: 'Ends',
  states: featsTypeStates,
})

type BaseType = {
  end: string
  error: LogCalling
  [key: string]: any
  component?: JSX.Element
  query?: Types['QueryToExecute'] | Types['QueryToExecute'][]
  client?: {
    anchors: string[]
    elements: {
      [key: string]: () =>
        | (JSX.Element | undefined)
        | (JSX.Element | undefined)[]
        | ((props: any) => JSX.Element | undefined)
    }
    contain?: string[]
  }
}

type GetType<T = {}> = BaseType & T

type PostType = BaseType & {
  validate?: (c: Context) => void
}

type DeleteType<T = {}> = BaseType & T

type PutType<T = {}> = BaseType & {
  validate: (c: Context) => void
} & T

type Ends = {
  [K in keyof typeof states]: K extends `get /${string}`
    ? GetType
    : K extends `post /${string}`
      ? PostType
      : K extends `delete /${string}`
        ? DeleteType
        : K extends `put /${string}`
          ? PutType
          : BaseType
}
