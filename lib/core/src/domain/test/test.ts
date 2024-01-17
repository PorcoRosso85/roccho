import { createMachine } from 'xstate'

export { TestFunctionItems, TestFunction, TestMap, TestTypeStates }
import { Ends } from './feats'
import { Query, QueryOperationType, TableFromTypeBox } from '../util'

const testTypeStates = {
  TestMap: {
    on: {
      key: 'TestFunction',
    },
  },
  TestFunction: {
    on: {
      type: 'Query',
    },
  },
  Query: {},
  void: {
    on: {
      'testFactory()': 'TestMap',
    },
  },
}

export const testTypeStateMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDcCWYDusAEBDAdhNmADZgC2Y+ALrAHQAqc1AsrgA4DEA1mAJ4BtAAwBdRKHYB7WKmqpJ+cSAAeiACxqhdAIzaATAFZtAZiHaDADgBsV42oA0IPogva6ATleG9QvVYsGBu5WAL4hjmiYOAREpBRUtIzMAGIArvgAxnIKnNR87GDCYkggUjLZiiWqCFYA7BZ0etoWtQb+7mq1dbWOzgiuHl4GPn4BQaHhIJFYeITEZJQ09MiSqBC5KbhZkgBOfAAUAJRFSmWy8pWg1dpWenTGLQa+niNCDk4ubp76w77+gcEwpN8JIIHAlNNonM4otaKdpOcFEpqgBaKy9RBosIRdAzGLzeJLJKwVgceHlC7IxDGbTuOi1QxmIRCYwPNRBYwY-puOpPXxqJraTT+bFTXFQ2ILBL0JgktKZCrkxGXFSIYZ0tS3J56CzGWr61pcga85l6AW6YUWUWQ2aSwmJACKqTAeyViqqiH1dxuhl07n5RncRp5rVN5qFQhFkxt+Jh0roKzWbspHoQAuDdBN-MFlqBISAA */
  id: 'views and elements',
  tsTypes: {} as import('./test.typegen').Typegen0,
  schema: {
    // context: {} as { contextType },
    events: {} as { type: 'eventType' },
  },
  context: {
    // initialContextValue,
  },
  initial: 'void',
  states: testTypeStates,
})

type TestTypeStates = {
  [Return in keyof typeof testTypeStates]: {
    [On in keyof (typeof testTypeStates)[Return]]: {
      [Declare in keyof (typeof testTypeStates)[Return][On]]: any
    }
  }
}

type TestFunctionItems =
  // initialDevelopmentPhaseTests
  // - browserClient
  | 'unitTests' // コンポーネントや機能のユニットテスト
  | 'uiUxTests' // UI/UXテスト、初期モックアップの評価
  | 'browserWorkerConn' // 追加: ブラウザとワーカー間の通信テスト
  | 'queryToMiniflareD1'
  | 'notFound' // 追加: 404と500のテスト
  | 'renderingContain' // レンダリングのテスト
  | 'frameworkFunctionalityTests' // ルーティングやリクエスト処理の基本機能テスト
  | 'moduleIntegrationTests' // 他のライブラリやモジュールとの統合テスト
  | 'basicPerformanceTests' // Cloudflare Workersの基本パフォーマンステスト
  | 'crossBrowserTesting' // 異なるブラウザでの動作テスト
  | 'accessibilityTests' // アクセシビリティテスト
  | 'e2e' // ユーザーのシナリオに沿ったE2Eテスト
  | 'apiIntegrationTests' // 外部APIとの統合テスト
  | 'errorHandlingTests' // エラー処理テスト
  | 'loadTesting' // 負荷テスト
  | 'securityTesting' // セキュリティテスト（XSS、CSRFなど）
  | 'performanceOptimizationTests' // パフォーマンス最適化テスト
  | 'finalUserTesting' // 最終ユーザーテスト
  | 'crossDeviceConsistencyTests' // 追加: 異なるブラウザとデバイスでの表示の一貫性テスト
  | 'stressTesting' // ストレステスト
  | 'finalIntegrationTesting' // 最終統合テスト
  | 'disasterRecoveryTests' // 災害復旧テスト
  | 'scalingTests' // スケーリングテスト
  | 'continuousMonitoring' // 継続的なモニタリング
  | 'userFeedbackAnalysis' // ユーザーフィードバック分析
  | 'dependencyUpdateTests' // 依存関係更新テスト
  | 'performanceMonitoring' // パフォーマンスモニタリング
  | 'infrastructureAudit' // 基盤の監査
  | 'complianceTesting' // コンプライアンステスト

type TestFunction = (params: {
  method: string
  end: string
  body?: any
  match?: string
  query?: Query
}) => void | Promise<void>

type TestMatch = 'toContain' | 'toEqual' | 'toMatchObject' | 'toBe' | 'toBeUndefined'

type TestMap = {
  [MethodEnd in keyof Ends]: {
    [Item in keyof Ends[MethodEnd]]: {
      func: TestFunction
      match: TestMatch
      params: string[]
    }[]
  }
}

type TestItems = {
  initialDevelopmentPhaseTests: {
    browserClient: {
      unitTests: string // コンポーネントや機能のユニットテスト
      uiUxTests: string // UI/UXテスト、初期モックアップの評価
      browserWorkerConn: string // 追加: ブラウザとワーカー間の通信テスト
      notFound: string // 追加: 404と500のテスト
      renderingContain: string
    }
    webFramework: {
      frameworkFunctionalityTests: string // ルーティングやリクエスト処理の基本機能テスト
      moduleIntegrationTests: string // 他のライブラリやモジュールとの統合テスト
    }
    infrastructure: {
      basicPerformanceTests: string // Cloudflare Workersの基本パフォーマンステスト
    }
  }
  midDevelopmentPhaseTests: {
    browserClient: {
      crossBrowserTesting: string // 異なるブラウザでの動作テスト
      accessibilityTests: string // アクセシビリティテスト
      e2e: string // ユーザーのシナリオに沿ったE2Eテスト
    }
    webFramework: {
      apiIntegrationTests: string // 外部APIとの統合テスト
      errorHandlingTests: string // エラー処理テスト
    }
    infrastructure: {
      loadTesting: string // 負荷テスト
      securityTesting: string // セキュリティテスト（XSS、CSRFなど）
    }
  }
  preReleasePhaseTests: {
    browserClient: {
      performanceOptimizationTests: string // パフォーマンス最適化テスト
      finalUserTesting: string // 最終ユーザーテスト
      crossDeviceConsistencyTests: string // 追加: 異なるブラウザとデバイスでの表示の一貫性テスト
    }
    webFramework: {
      stressTesting: string // ストレステスト
      finalIntegrationTesting: string // 最終統合テスト
    }
    infrastructure: {
      disasterRecoveryTests: string // 災害復旧テスト
      scalingTests: string // スケーリングテスト
    }
  }
  operationPhaseTests: {
    browserClient: {
      continuousMonitoring: string // 継続的なモニタリング
      userFeedbackAnalysis: string // ユーザーフィードバック分析
    }
    webFramework: {
      dependencyUpdateTests: string // 依存関係更新テスト
      performanceMonitoring: string // パフォーマンスモニタリング
    }
    infrastructure: {
      infrastructureAudit: string // 基盤の監査
      complianceTesting: string // コンプライアンステスト
    }
  }
}

const testItems = {
  initialDevelopmentPhaseTests: {
    browserClient: {
      unitTests: '', // コンポーネントや機能のユニットテスト
      uiUxTests: '', // UI/UXテスト、初期モックアップの評価
      browserWorkerConn: '', // 追加: ブラウザとワーカー間の通信テスト
      notFound: '', // 追加: 404と500のテスト
      renderingContain: '',
    },
    webFramework: {
      frameworkFunctionalityTests: '', // ルーティングやリクエスト処理の基本機能テスト
      moduleIntegrationTests: '', // 他のライブラリやモジュールとの統合テスト
    },
    infrastructure: {
      basicPerformanceTests: '', // Cloudflare Workersの基本パフォーマンステスト
    },
  },

  midDevelopmentPhaseTests: {
    browserClient: {
      crossBrowserTesting: '', // 異なるブラウザでの動作テスト
      accessibilityTests: '', // アクセシビリティテスト
      e2e: '', // ユーザーのシナリオに沿ったE2Eテスト
    },
    webFramework: {
      apiIntegrationTests: '', // 外部APIとの統合テスト
      errorHandlingTests: '', // エラー処理テスト
    },
    infrastructure: {
      loadTesting: '', // 負荷テスト
      securityTesting: '', // セキュリティテスト（XSS、CSRFなど）
    },
  },

  preReleasePhaseTests: {
    browserClient: {
      performanceOptimizationTests: '', // パフォーマンス最適化テスト
      finalUserTesting: '', // 最終ユーザーテスト
      crossDeviceConsistencyTests: '', // 追加: 異なるブラウザとデバイスでの表示の一貫性テスト
    },
    webFramework: {
      stressTesting: '', // ストレステスト
      finalIntegrationTesting: '', // 最終統合テスト
    },
    infrastructure: {
      disasterRecoveryTests: '', // 災害復旧テスト
      scalingTests: '', // スケーリングテスト
    },
  },

  operationPhaseTests: {
    browserClient: {
      continuousMonitoring: '', // 継続的なモニタリング
      userFeedbackAnalysis: '', // ユーザーフィードバック分析
    },
    webFramework: {
      dependencyUpdateTests: '', // 依存関係更新テスト
      performanceMonitoring: '', // パフォーマンスモニタリング
    },
    infrastructure: {
      infrastructureAudit: '', // 基盤の監査
      complianceTesting: '', // コンプライアンステスト
    },
  },
}
