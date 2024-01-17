import { Context } from 'hono'
import { states } from '../../../states'

type AnyMethodEnd = {
  end: string
  // error: LogCalling
  [key: string]: any
  component?: JSX.Element
  query?: Types['QueryStringToDatabase']
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
  handler?: <T>(c: Context<T>) => void
}

type GetMethodEnd = <T>(type: T) => AnyMethodEnd & T

type PostMethodEnd = <T>(type: T) => AnyMethodEnd & T & { validate?: (c: Context) => void }

type DeleteMethodEnd = <T>(type: T) => AnyMethodEnd & T

type PutMethodEnd = <T>(type: T) => AnyMethodEnd & T & { validate: (c: Context) => void }

type MethodEnds = {
  [K in keyof typeof states]: K extends `get /${string}`
    ? GetMethodEnd
    : K extends `post /${string}`
      ? PostMethodEnd
      : K extends `delete /${string}`
        ? DeleteMethodEnd
        : K extends `put /${string}`
          ? PutMethodEnd
          : AnyMethodEnd
}

export { MethodEnds }
