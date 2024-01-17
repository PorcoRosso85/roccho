const getErrorCode = (error: any) => {
  switch (errorCode) {
    // 500を返すケース
    case 500:
    // Internal Server Error
    case 501:
    // Not Implemented
    case 503:
    // Service Unavailable
    case 505:
    // HTTP Version Not Supported
    case 506:
    // Variant Also Negotiates
    case 507:
    // Insufficient Storage
    case 508:
    // Loop Detected
    case 510:
    // Not Extended
    case 511: // Network Authentication Required
      return 500

    // 502を返すケース
    case 502:
    // Bad Gateway
    case 504: // Gateway Timeout
      return 502

    // それ以外のケース
    default:
      // ここでは500をデフォルトのエラーコードとする
      return 500
  }
}

const serverErrors = {
  500: 'Internal Server Error - サーバー内部で問題が発生した。',
  501: 'Not Implemented - サーバーがリクエストを実行する機能を持っていない。',
  502: 'Bad Gateway - サーバーがゲートウェイやプロキシとして動作中に無効な応答を受け取った。',
  503: 'Service Unavailable - サーバーが一時的にリクエストを処理できない。通常、過負荷やメンテナンスのため。',
  504: 'Gateway Timeout - ゲートウェイ・プロキシサーバーがタイムアウトした。',
  505: 'HTTP Version Not Supported - サーバーがリクエストで使用されているHTTPバージョンをサポートしていない。',
  506: 'Variant Also Negotiates - 透過的な内容交渉で内部設定エラーが発生した。',
  507: 'Insufficient Storage - サーバーに十分なストレージがない。',
  508: 'Loop Detected - サーバーがリクエストの処理中に無限ループを検出した。',
  510: 'Not Extended - リクエストの処理にはさらなる拡張が必要。',
  511: 'Network Authentication Required - ネットワークアクセスを得るために認証が必要。',
}

export const errors = (statusCode: number) => {
  let message

  switch (statusCode) {
    case 500:
      message = serverErrors[statusCode]
      break
    case 502:
      message = serverErrors[statusCode]
      break
    default:
      message = 'サーバー内部で問題が発生した'
  }

  return { message, statusCode }
}
