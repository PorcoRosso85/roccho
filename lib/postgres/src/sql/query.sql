-- /user_account./:user_id./user_info.ユーザー情報を取得するクエリ { users }
-- name: getUserInfo :one
SELECT * FROM users WHERE user_id = $1;

-- /user_account./:user_id./user_info.ユーザーの権限を確認するクエリ { users, roles }
-- name: getUserRole :one
SELECT sqlc.embed(users), sqlc.embed(roles), sqlc.embed(users_roles)
FROM users
JOIN users_roles ON users_roles.user_id = users.user_id
JOIN roles ON roles.role_id = users_roles.role_id
WHERE users."user_id" = $1;

-- /user_account./:user_id./transaction_item./make_transaction./transaction_history.オーダーテーブルから取引履歴をクエリ -> { order, transaction }

-- /user_account./:user_id./transaction_item./register_item.勘定科目を登録する前にユーザーが登録上限を迎えていないかのため、ユーザー情報を取得するクエリ { users }
-- 上限数は、roles情報が持っている

-- /user_account./:user_id./transaction_item./register_item.勘定科目生成を実行するクエリ,生成された勘定科目は1つのuser_idをownerとして保持する -> { items }
-- /user_account./:user_id./transaction_item./register_item.ユーザー登録時自動的にitemを生成するクエリ -> アプリケーションで対応
-- name: insertItem :one
INSERT INTO items (item_id, item_name, owner_user_id, last_updated) VALUES (
    $1, $2, $3, $4
    ) RETURNING *;

-- /user_account./:user_id./transaction_item./user_invitation./invitation_history.オーダーから招待履歴を取得するクエリ

-- /user_account./:user_id./transaction_item./item_info.ユーザーが持つすべての勘定科目情報を取得  -> {items}
-- name: getItem :one
-- []test
SELECT * FROM items WHERE item_id = $1;

-- /user_account./register_user.ユーザー登録: 新規ユーザーを作成するINSERTクエリ { users }
-- name: insertUser :one
INSERT INTO users (user_id, user_name, email, registered_at) VALUES (
    $1, $2, $3, $4
    ) RETURNING *;

-- /user_account./:user_id./update_user.ユーザー情報を更新するクエリ
-- name: editUser :one
UPDATE users SET user_name = $2, email = $3, registered_at = $4 WHERE user_id = $1 RETURNING *;

-- /user_account./:user_id./delete_user.ユーザーを削除するクエリ
-- name: deleteUser :one
DELETE FROM users WHERE user_id = $1 RETURNING *;

-- /user_account./:user_id./items_group./register_group.グループを登録するクエリ

-- /user_account./:user_id./items_group./register_group.ユーザー登録時自動的にグループを生成するクエリ

-- /user_account./:user_id./items_group./update_group.グループ情報を変更するクエリ

-- /user_account./:user_id./items_group./delete_group.グループを削除するクエリ

-- /user_account./:user_id./items_group./group_info.グループ情報を取得するクエリ