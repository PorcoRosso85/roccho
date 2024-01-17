-- 「ユーザーにアカウントをもたせ、ownerユーザーがアカウントに他のownerユーザーを招待し、アカウント内で数値を取引する」という要件.item x transaction-- /user_account./:user_id./user_info.ユーザー情報を取得するクエリ { users }

-- /user_account./:user_id./user_info.ユーザーの権限を確認するクエリ { users, roles }

-- /user_account./:user_id./transaction_item./make_transaction./transaction_history.オーダーテーブルから取引履歴をクエリ -> { order, transaction }

-- /user_account./:user_id./transaction_item./register_item.勘定科目を登録する前にユーザーが登録上限を迎えていないかのため、ユーザー情報を取得するクエリ { users }

-- /user_account./:user_id./transaction_item./register_item.勘定科目生成を実行するクエリ,生成された勘定科目は1つのuser_idをownerとして保持する -> { items }

-- /user_account./:user_id./transaction_item./register_item.ユーザー登録時自動的にitemを生成するクエリ

-- /user_account./:user_id./transaction_item./user_invitation./invitation_history.オーダーから招待履歴を取得するクエリ

-- /user_account./:user_id./transaction_item./item_info.ユーザーが持つすべての勘定科目情報を取得  -> {items}

-- /user_account./:user_id./item_info.ユーザーが持つすべての勘定科目情報を取得  -> {items}

-- /user_account./:user_id./delete_user.ユーザーを削除するクエリ

-- /user_account./:user_id./items_group./register_group.グループを登録するクエリ

-- /user_account./:user_id./items_group./register_group.ユーザー登録時自動的にグループを生成するクエリ

-- /user_account./:user_id./items_group./update_group.グループ情報を変更するクエリ

-- /user_account./:user_id./items_group./delete_group.グループを削除するクエリ

-- /user_account./:user_id./items_group./group_info.グループ情報を取得するクエリ

-- /user_account./:user_id./update_user.ユーザー情報を更新するクエリ

-- /user_account./register_user.ユーザー登録: 新規ユーザーを作成するINSERTクエリ { users }

-- /permission.パーミッション一覧を取得するクエリ

-- /role./list.作成済みrole一覧を取得するクエリ

-- /role./register.パーミッション一覧を取得するクエリ

-- /role./register.該当roleの値に、パーミッション配列を追加するクエリ

-- /role./edit.パーミッション一覧を取得するクエリ

-- /role./edit.該当roleの値に、パーミッション配列を追加するクエリ

-- /role./delete.該当roleを削除するクエリ

-- /order./request.waitオーダーを新しいorderIdとともに追加するクエリ

-- /order./request.ユーザーのメールアドレスを送るためのクエリ

-- /order./:orderId./

-- /order./:orderId./cancel

-- /order./:orderId./verification

-- /order./:orderId.New state 1

-- /order./:orderId./cancel.オーダーをcancelに変更するクエリ

-- /order./:orderId./verification.オーダー現状をwait＞pendingに変更するクエリ

-- /order./:orderId./verification.認証するためのクエリ

-- /order./:feature.オーダー状況を取得するクエリ

-- /order./:feature.開始時間から一定時間経過をしたオーダーを取得するクエリ

-- /order.server.オーダー状況をpendingからdoneに変更するクエリ

-- 「ユーザーにアカウントをもたせ、ownerユーザーがアカウントに他のownerユーザーを招待し、アカウント内で数値を取引する」という要件.user x ownerの中間テーブル

-- 「ユーザーにアカウントをもたせ、ownerユーザーがアカウントに他のownerユーザーを招待し、アカウント内で数値を取引する」という要件.account x item & transaction

-- 「ユーザーにアカウントをもたせ、ownerユーザーがアカウントに他のownerユーザーを招待し、アカウント内で数値を取引する」という要件.item x transaction