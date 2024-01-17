/** エンドポイントからJSXを返すことを保証する */
type ButtonComponent<Endpoints extends readonly string[]> = {
  [K in Endpoints[number]]: JSX.Element
}

/**
 * この関数は、エンドポイントの配列を受け取り、
 * そのエンドポイントに対応するボタンを返す
 * const buttons = genComponent({ endpoints: ['a', 'b', 'c'] })
 * というように呼び出す
 * buttons.a というように、エンドポイント名をプロパティ名として
 * ボタンを取得できる
 */
const buttonComponents = <Endpoints extends readonly string[]>({
  endpoints,
}: { endpoints: Endpoints }): ButtonComponent<Endpoints> => {
  const buttonComponent = (endpoint: string): JSX.Element => (
    <button type="button" hx-get={endpoint}>
      Create Bank at {endpoint}
    </button>
  )

  const buttons = endpoints.reduce((acc: any, endpoint: string) => {
    // プロパティ名を動的に生成
    acc[endpoint] = buttonComponent(endpoint)
    return acc
  }, {})

  return buttons as ButtonComponent<Endpoints>
}

export { buttonComponents }
