export type LogEntry = {
  timestamp: Date
  level: 'info' | 'error' | 'warn'
  message: string
  context?: any
  userId?: string // ユーザー識別子（オプショナル）
  requestId?: string // リクエスト識別子（オプショナル）
  errorStack?: string // エラースタックトレース（エラー時のみ）
}

// Loggerクラス
export class Logger {
  constructor(
    private config: {
      broker: Queue<LogEntry>
      serviceName: string
      serviceAccount: string
      req?: Request
    },
  ) {}

  async sendEntries(): Promise<void> {
    // ログエントリをキューに送信するロジック
  }

  // 他のロギング関連メソッド
}

// Chatクラス
export class Chat {
  constructor(private logger: Logger) {}

  async handleMessage(userInput: string): Promise<string> {
    // ユーザー入力を処理するロジック
    return 'Response to user'
  }

  // 他のチャット関連メソッド
}

// ApiClientクラス
export class ApiClient {
  constructor(private logger: Logger, private targetHost: string) {}

  async makeRequest(endpoint: string, data: any): Promise<any> {
    // HTTPリクエストを送信するロジック
    return {} // レスポンスを返す
  }

  // 他のAPI通信関連メソッド
}

export type Env = {
  LOGGING_QUEUE: Queue<LogEntry>
  GCP_SERVICE_ACCOUNT: string
  //   DIALOGFLOW_CX_ENV_ID: string
  TARGET_HOST: string
  API_KEY: string
}

export class DIContainer {
  // private _dialogflowCX?: DialogflowCX;
  private _logger?: Logger
  private _chat?: Chat
  private _apiClient?: ApiClient

  constructor(
    private readonly env: Env,
    private readonly req?: Request, // わざとオプショナル
  ) {}

  async cleanup(): Promise<void> {
    // 全体の処理の最後に実行したいメソッド一覧をここに書く
    const callers = new Map<string, () => Promise<void>>()
    callers.set('logger', this.logger.sendEntries)
    for (const [caller, cleanup] of callers) {
      try {
        await cleanup()
      } catch (err) {
        // LogPush 頼り
        console.error(`cleanup error at ${caller}:`, err)
      }
    }
  }

  get logger(): Logger {
    return (
      this._logger ??
      (this._logger = new Logger({
        broker: this.env.LOGGING_QUEUE,
        serviceName: 'chat-api',
        serviceAccount: this.env.GCP_SERVICE_ACCOUNT,
        req: this.req,
      }))
    )
  }

  // get dialogflowCX(): DialogflowCX {
  //   const gcpLocation = 'asia-northeast2';
  //   const agentId = 'a7593dda-7250-4307-9660-28671628377b';
  //   return (
  //     this._dialogflowCX ??
  //     (this._dialogflowCX = new DialogflowCX(
  //       this.env.GCP_SERVICE_ACCOUNT,
  //       gcpLocation,
  //       agentId,
  //       this.env.DIALOGFLOW_CX_ENV_ID,
  //     ))
  //   );
  // }

  get chat(): Chat {
    return this._chat ?? (this._chat = new Chat(this.logger, this.dialogflowCX))
  }

  get apiClient(): ApiClient {
    return this._apiClient ?? (this._apiClient = new ApiClient(this.logger, this.env.TARGET_HOST))
  }
}
