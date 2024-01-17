import { JSDOM } from 'jsdom'
import { describe, expect, test } from 'vitest'
import { Compo } from './Compo'

describe('', () => {
  test('', () => {
    const result = Compo()
    expect(result.toString()).toBe('<div>Compo</div>')
  })
})

const componentTests = {
  errorBoundary: {
    sync: {
      noError: 'コンポーネントがエラーなしで正常にレンダリングされるかテスト',
      withError: 'コンポーネントがエラーを投げたときにフォールバックUIが表示されるかテスト',
    },
    async: {
      noError: '非同期コンポーネントがエラーなしで正常にレンダリングされるかテスト',
      withError: '非同期コンポーネントがエラーを投げたときにフォールバックUIが表示されるかテスト',
    },
    nested: {
      noError: '入れ子になったコンポーネントがエラーなしで正常にレンダリングされるかテスト',
      errorInParent: '親コンポーネントでエラーが発生したときにフォールバックUIが表示されるかテスト',
      errorInChild: '子コンポーネントでエラーが発生したときにフォールバックUIが表示されるかテスト',
    },
    onError: {
      noError: 'エラーがない場合、onErrorコールバックがトリガされないことをテスト',
      withError: 'エラーがある場合、onErrorコールバックが適切なエラーでトリガされるかテスト',
    },
    fallbackRender: {
      noError: 'エラーがない場合、デフォルトのレンダリングが行われるかテスト',
      withError: 'エラーがある場合、fallbackRenderで定義されたカスタムUIが表示されるかテスト',
    },
  },
  suspense: {
    streaming: {
      noError: '非同期コンポーネントがエラーなしでストリーミングレンダリングされるかテスト',
      withError: '非同期コンポーネントがエラーを投げたときのストリーミングレンダリングをテスト',
    },
    multipleSuspense: {
      noError: '複数のSuspenseコンポーネントがエラーなしでレンダリングされるかテスト',
      withError: '複数のSuspenseコンポーネント内の一つでエラーが発生したときの挙動をテスト',
    },
    nested: {
      noError: '入れ子になったSuspenseコンポーネントがエラーなしでレンダリングされるかテスト',
      errorInParent: '親コンポーネントでエラーが発生したときの挙動をテスト',
      errorInChild: '子コンポーネントでエラーが発生したときの挙動をテスト',
    },
  },
  jsxMiddleware: {
    renderHtmlStrings: 'HTML文字列をレンダリングするかテスト',
    usedWithHtmlMiddleware: 'htmlミドルウェアと一緒に使用されるかテスト',
    renderAsyncComponent: '非同期コンポーネントが正しくレンダリングされるかテスト',
    asyncComponentWithHtmlTaggedTemplate:
      'htmlタグ付きテンプレート文字列と非同期コンポーネントが正しくレンダリングされるかテスト',
  },
  renderToString: {
    nestedArray: 'ネストされた配列が正しくレンダリングされるかテスト',
    emptyElements: '空の要素が閉じタグなしでレンダリングされるかテスト',
    propsValueNull: 'propsの値がnullの場合のレンダリングをテスト',
    propsValueUndefined: 'propsの値がundefinedの場合のレンダリングをテスト',
    dangerouslySetInnerHTML: {
      renderDangerouslySetInnerHTML: 'dangerouslySetInnerHTMLが正しくレンダリングされるかテスト',
      errorWithChildren: '子要素と一緒に使用された場合にエラーが発生するかテスト',
    },
    booleansNullUndefinedIgnored: '真偽値、null、undefinedが無視されるかテスト',
    propsDefaultToTrue: 'propsがデフォルトでtrueになるかテスト',
    booleanAttribute: 'ブール属性が正しくレンダリングされるかテスト',
    functionsAsChildren: '子要素としての関数が正しくレンダリングされるかテスト',
    fc: 'FC型が正しく定義されているかテスト',
    styleAttribute: 'style属性がオブジェクトから文字列に変換されるかテスト',
    htmlEscapedInProps: 'props内のHTMLエスケープが二重にされないかテスト',
  },
  memo: {
    memoized: 'memo化されたコンポーネントが正しくレンダリングされるかテスト',
    propsUpdated: 'propsが更新された時の挙動をテスト',
    customPropsAreEqual: 'カスタムpropsAreEqual関数が正しく動作するかテスト',
  },
  fragment: {
    renderChildren: 'Fragmentが子要素を正しくレンダリングするかテスト',
    renderChild: 'Fragmentが単一の子要素を正しくレンダリングするかテスト',
    renderNothingForEmptyFragment: '空のFragmentが何もレンダリングしないかテスト',
    renderNothingForUndefined: 'undefinedがレンダリングされないかテスト',
  },
  context: {
    withProvider: {
      hasChild: 'Providerが子要素を持つ場合のレンダリングをテスト',
      hasChildren: 'Providerが複数の子要素を持つ場合のレンダリングをテスト',
      nested: 'ネストされたProviderのレンダリングをテスト',
    },
    defaultValue: 'Contextのデフォルト値が正しくレンダリングされるかテスト',
  },
  streaming: {
    suspenseRenderToReadableStream:
      'Suspense内でのrenderToReadableStreamを使用したレンダリングをテスト',
    throwPromiseInsideSuspense: '`throw promise`をSuspense内で使用した際の挙動をテスト',
    simpleContentInsideSuspense: 'Suspense内の単純なコンテンツのレンダリングをテスト',
    childrenSuspense: '子要素としてのSuspenseのレンダリングをテスト',
    childrenSuspenseAndString: 'Suspenseと文字列を子要素として持つ場合のレンダリングをテスト',
    resolveUndefined: 'resolve(undefined)の結果が正しくレンダリングされるかテスト',
    resolveNull: 'resolve(null)の結果が正しくレンダリングされるかテスト',
    rejectPromise: 'Promiseのrejectの結果が正しくレンダリングされるかテスト',
    multipleAwaitCall: '複数の`await`呼び出しを含むレンダリングをテスト',
    complexFallbackContent: '複雑なフォールバックコンテンツを持つSuspenseのレンダリングをテスト',
    nestedSuspense: 'ネストされたSuspenseのレンダリングをテスト',
    multipleSuspenseOrder:
      '複数のSuspenseが解決される順序に基づいて正しくレンダリングされるかテスト',
    suspenseWithResolveStream: 'resolveStreamを使用したSuspenseのレンダリングをテスト',
    renderToReadableStreamWithString:
      '文字列を引数としてrenderToReadableStreamを使用したレンダリングをテスト',
    renderToReadableStreamWithPromise:
      'Promiseを引数としてrenderToReadableStreamを使用したレンダリングをテスト',
  },
}
