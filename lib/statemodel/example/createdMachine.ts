import { createMachine } from 'xstate'

export const machine = createMachine(
  {
    id: 'app',
    initial: '/',
    states: {
      '/': {
        on: {
          click: [
            {
              target: '/user_account',
              guard: 'login',
            },
            {
              target: '/auth',
              guard: 'logout',
            },
          ],
          'button_get__/permission': {
            target: '/permission',
          },
          'button_get__/role': {
            target: '/role',
          },
          'Event 5': {
            target: '/order',
          },
        },
      },
      '/user_account': {
        initial: '/',
        states: {
          '/': {
            on: {
              '1': {
                target: '/register_user',
              },
              next: {
                target: '/:user_id',
              },
            },
          },
          '/:user_id': {
            initial: '/',
            states: {
              '/': {
                on: {
                  '1': {
                    target: '/user_info',
                  },
                  '2': {
                    target: '/transaction_item',
                  },
                  '3': {
                    target: '/item_info',
                  },
                  '5': {
                    target: '/update_user',
                  },
                  '6': {
                    target: '/delete_user',
                  },
                  '7': {
                    target: '/items_group',
                  },
                },
              },
              '/user_info': {
                states: {
                  'ユーザー情報を取得するクエリ { users }': {},
                  'ユーザーの権限を確認するクエリ { users, roles }': {},
                },
                type: 'parallel',
              },
              '/transaction_item': {
                initial: '/',
                states: {
                  '/': {
                    on: {
                      '1': {
                        target: '/user_invitation',
                      },
                      '2': {
                        target: '/register_item',
                      },
                      '3': {
                        target: '/item_info',
                      },
                      '4': {
                        target: '/make_transaction',
                      },
                    },
                  },
                  '/make_transaction': {
                    initial: '/',
                    states: {
                      '/': {
                        on: {
                          '1': {
                            target: '/transaction_history',
                          },
                        },
                      },
                      '/transaction_history': {
                        states: {
                          'オーダーテーブルから取引履歴をクエリ -> { order, transaction }': {},
                        },
                        type: 'parallel',
                      },
                    },
                    on: {
                      '1': {
                        target: '#app./order./request',
                      },
                    },
                  },
                  '/register_item': {
                    states: {
                      '勘定科目を登録する前にユーザーが登録上限を迎えていないかのため、ユーザー情報を取得するクエリ { users }':
                        {},
                      '勘定科目生成を実行するクエリ,生成された勘定科目は1つのuser_idをownerとして保持する -> { items }':
                        {},
                      ユーザー登録時自動的にitemを生成するクエリ: {},
                    },
                    type: 'parallel',
                  },
                  '/user_invitation': {
                    initial: '/',
                    states: {
                      '/': {
                        on: {
                          '1': {
                            target: '/invitation_history',
                          },
                        },
                      },
                      '/invitation_history': {
                        states: {
                          オーダーから招待履歴を取得するクエリ: {},
                        },
                        type: 'parallel',
                      },
                    },
                  },
                  '/item_info': {
                    states: {
                      'ユーザーが持つすべての勘定科目情報を取得  -> {items}': {},
                    },
                    type: 'parallel',
                  },
                },
              },
              '/item_info': {
                states: {
                  'ユーザーが持つすべての勘定科目情報を取得  -> {items}': {},
                },
                type: 'parallel',
              },
              '/delete_user': {
                states: {
                  ユーザーを削除するクエリ: {},
                },
                type: 'parallel',
              },
              '/items_group': {
                initial: '/',
                states: {
                  '/': {
                    on: {
                      '1': {
                        target: '/register_group',
                      },
                      '2': {
                        target: '/update_group',
                      },
                      '3': {
                        target: '/delete_group',
                      },
                      '4': {
                        target: '/group_info',
                      },
                    },
                  },
                  '/register_group': {
                    states: {
                      グループを登録するクエリ: {},
                      ユーザー登録時自動的にグループを生成するクエリ: {},
                    },
                    type: 'parallel',
                  },
                  '/update_group': {
                    states: {
                      グループ情報を変更するクエリ: {},
                    },
                    type: 'parallel',
                  },
                  '/delete_group': {
                    states: {
                      グループを削除するクエリ: {},
                    },
                    type: 'parallel',
                  },
                  '/group_info': {
                    states: {
                      グループ情報を取得するクエリ: {},
                    },
                    type: 'parallel',
                  },
                },
              },
              '/update_user': {
                states: {
                  ユーザー情報を更新するクエリ: {},
                },
                type: 'parallel',
              },
            },
          },
          '/register_user': {
            states: {
              'ユーザー登録: 新規ユーザーを作成するINSERTクエリ { users }': {},
            },
            type: 'parallel',
          },
        },
      },
      '/auth': {
        on: {
          authed: {
            target: '/',
          },
        },
      },
      '/permission': {
        states: {
          パーミッション一覧を取得するクエリ: {},
        },
        type: 'parallel',
      },
      '/role': {
        initial: '/',
        states: {
          '/': {
            on: {
              div: {
                target: '/list',
              },
              'button_get__/role/register': {
                target: '/register',
              },
              'get__/role/edit': {
                target: '/edit',
              },
              'delete__/role/delete': {
                target: '/delete',
              },
            },
          },
          '/list': {
            states: {
              作成済みrole一覧を取得するクエリ: {},
            },
            type: 'parallel',
          },
          '/register': {
            states: {
              パーミッション一覧を取得するクエリ: {
                on: {
                  next: {
                    target: '該当roleの値に、パーミッション配列を追加するクエリ',
                  },
                },
              },
              '該当roleの値に、パーミッション配列を追加するクエリ': {},
            },
            type: 'parallel',
          },
          '/edit': {
            states: {
              パーミッション一覧を取得するクエリ: {
                on: {
                  next: {
                    target: '該当roleの値に、パーミッション配列を追加するクエリ',
                  },
                },
              },
              '該当roleの値に、パーミッション配列を追加するクエリ': {},
            },
            type: 'parallel',
          },
          '/delete': {
            states: {
              該当roleを削除するクエリ: {},
            },
            type: 'parallel',
          },
        },
      },
      '/order': {
        initial: '/',
        states: {
          '/': {
            on: {
              'button_post__/order/:orderId': {
                target: '/request',
              },
              url: {
                target: '/:orderId',
              },
              'button_get__/order/info/:feature': {
                target: '/:feature',
              },
            },
          },
          '/request': {
            states: {
              waitオーダーを新しいorderIdとともに追加するクエリ: {
                on: {
                  next: {
                    target: 'ユーザーのメールアドレスを送るためのクエリ',
                  },
                },
              },
              ユーザーのメールアドレスを送るためのクエリ: {},
            },
            type: 'parallel',
          },
          '/:orderId': {
            initial: '/',
            states: {
              '/': {
                on: {
                  'button_post__/order/:orderId/cancel': {
                    target: '/cancel',
                  },
                  url: {
                    target: '/verification',
                  },
                },
              },
              '/cancel': {
                states: {
                  オーダーをcancelに変更するクエリ: {},
                },
                type: 'parallel',
              },
              '/verification': {
                states: {
                  'オーダー現状をwait＞pendingに変更するクエリ': {},
                  認証するためのクエリ: {},
                },
                type: 'parallel',
              },
              'New state 1': {},
            },
            type: 'parallel',
          },
          '/:feature': {
            description: '/:transaction\n\n/:invite',
            states: {
              オーダー状況を取得するクエリ: {},
              開始時間から一定時間経過をしたオーダーを取得するクエリ: {},
            },
            type: 'parallel',
          },
          server: {
            states: {
              オーダー状況をpendingからdoneに変更するクエリ: {},
            },
            type: 'parallel',
          },
        },
      },
      '「ユーザーにアカウントをもたせ、ownerユーザーがアカウントに他のownerユーザーを招待し、アカウント内で数値を取引する」という要件':
        {
          states: {
            'user x ownerの中間テーブル': {},
            'account x item & transaction': {},
            'item x transaction': {},
          },
          type: 'parallel',
        },
      tables: {
        description:
          '\\-- usersテーブル -- ユーザーの基本情報を保持。\n\n\\-- sheetsテーブル -- ユーザーの口座残高情報を保持。 -- accountsの集合体を意味する。\n\n\\-- accountsテーブル -- 勘定科目情報を保持。\n\n\\-- transactionsテーブル -- 勘定科目間の取引を保持。\n\n\\-- rolesテーブル -- sheetの役割情報を保持。 -- userに対して与える、permissionの集合体を意味する。\n\n\\-- permissionsテーブル -- ユーザーの権限。\n\n\\-- ordersテーブル -- オーダー情報。\n\n\\-- 関連性 -- usersとsheets: 多対多の関連。一人のユーザーが複数の口座を持つことができ、一つの口座は複数のユーザーに割り当てられる。これを管理するために中間テーブル（例：users_sheets）が必要。 -- sheetsとaccounts: 一対多の関連。一つの口座に対して複数の勘定科目が存在する。 -- sheetsとtransactions: 一対多の関連。一つの口座に対して複数の取引が存在する。 -- sheetsとroles: roles値のうちownerは1つのsheetsに対し1つのみ割り当てられる -- usersとroles: 多対多の関連。一人のユーザーが複数の役割を持つことができ、一つの役割は複数のユーザーに割り当てられる。これを管理するために中間テーブル（例：users_roles）が必要。 -- rolesとpermissions: 多対多の関連。一つの役割に複数の権限が割り当てられ、一つの権限は複数の役割に適用される。これも中間テーブル（例：roles_permissions）が必要。 -- accountsとtransactions: 多対多の関連。一つの取引に複数の勘定科目が関与し、一つの勘定科目は複数の取引に関与する',
      },
    },
    types: {
      events: {} as
        | { type: '1' }
        | { type: '2' }
        | { type: '3' }
        | { type: '4' }
        | { type: '5' }
        | { type: '6' }
        | { type: '7' }
        | { type: 'click' }
        | { type: 'button_get__/permission' }
        | { type: 'button_get__/role' }
        | { type: 'Event 5' }
        | { type: 'authed' }
        | { type: 'div' }
        | { type: 'button_get__/role/register' }
        | { type: 'get__/role/edit' }
        | { type: 'delete__/role/delete' }
        | { type: 'next' }
        | { type: 'button_post__/order/:orderId' }
        | { type: 'url' }
        | { type: 'button_get__/order/info/:feature' }
        | { type: 'button_post__/order/:orderId/cancel' },
    },
  },
  {
    actions: {},
    actors: {},
    guards: {
      login: ({ context, event }, params) => {
        return false
      },
      logout: ({ context, event }, params) => {
        return false
      },
    },
    delays: {},
  },
)
