-- usersテーブル
-- ユーザーの基本情報を保持。

-- sheetsテーブル
-- ユーザーの口座残高情報を保持。
-- accountsの集合体を意味する。

-- accountsテーブル
-- 勘定科目情報を保持。

-- transactionsテーブル
-- 勘定科目間の取引を保持。

-- rolesテーブル
-- sheetの役割情報を保持。
-- userに対して与える、permissionの集合体を意味する。

-- permissionsテーブル
-- ユーザーの権限。

-- ordersテーブル
-- オーダー情報。

-- 関連性
-- usersとsheets: 多対多の関連。一人のユーザーが複数の口座を持つことができ、一つの口座は複数のユーザーに割り当てられる。これを管理するために中間テーブル（例：users_sheets）が必要。
-- sheetsとaccounts: 一対多の関連。一つの口座に対して複数の勘定科目が存在する。
-- sheetsとtransactions: 一対多の関連。一つの口座に対して複数の取引が存在する。
-- sheetsとroles: roles値のうちownerは1つのsheetsに対し1つのみ割り当てられる
-- usersとroles: 多対多の関連。一人のユーザーが複数の役割を持つことができ、一つの役割は複数のユーザーに割り当てられる。これを管理するために中間テーブル（例：users_roles）が必要。
-- rolesとpermissions: 多対多の関連。一つの役割に複数の権限が割り当てられ、一つの権限は複数の役割に適用される。これも中間テーブル（例：roles_permissions）が必要。
-- accountsとtransactions: 多対多の関連。一つの取引に複数の勘定科目が関与し、一つの勘定科目は複数の取引に関与する。


-- DDLを生成することがゴール
-- 下記に列挙されているDMLから、必要となるスキーマを類推し、
-- ひとつのコードブロックの中にコメントとともに
-- DDLを記述して

-- /:user./info.ユーザーの権限を確認するクエリ


-- /:user./info.ユーザーの権限を確認するクエリ
SELECT * FROM user_permissions WHERE user_id = :user_id;

-- /:user./account./transaction./history.アカウントの取引履歴をクエリ
SELECT * FROM account_transactions WHERE account_id IN (SELECT account_id FROM accounts WHERE user_id = :user_id);

-- /:user./account./register.アカウント生成上限をするためのuser情報クエリ
SELECT COUNT(*) AS account_count FROM accounts WHERE user_id = :user_id;

-- /:user./account./register.アカウント生成を実行するクエリ
INSERT INTO accounts (user_id, account_details, creation_date) VALUES (:user_id, :account_details, CURRENT_TIMESTAMP);

-- /:user./account./register.アカウント生成したuser = ownerクエリ
SELECT * FROM accounts WHERE user_id = :user_id AND account_details LIKE '%owner%';

-- /:user./account./info.ユーザーが持つすべてのアカウント情報を取得
SELECT * FROM accounts WHERE user_id = :user_id;

-- /:user./register.ユーザー登録: 新規ユーザーを作成するINSERTクエリ
INSERT INTO users (username, password, email, registration_date) VALUES (:username, :password, :email, CURRENT_TIMESTAMP);

-- /permission.パーミッション一覧を取得するクエリ
SELECT * FROM permissions;

-- /role./list.作成済みrole一覧を取得するクエリ
SELECT * FROM roles;

-- /role./register.該当roleの値に、パーミッション配列を追加するクエリ
INSERT INTO role_permissions (role_id, permission_id) VALUES (:role_id, :permission_id);


-- /role./register.パーミッション一覧を取得するクエリ
SELECT * FROM permissions;

-- /role./register.該当roleの値に、パーミッション配列を追加するクエリ
-- このクエリは一度に複数のパーミッションをroleに追加するため、アプリケーション側で処理を行う必要があります。
-- 以下は一つのパーミッションを追加する例です。
INSERT INTO role_permissions (role_id, permission_id) VALUES (:role_id, :permission_id);

-- /role./edit.パーミッション一覧を取得するクエリ
-- こちらもパーミッションの全リストを取得するクエリです。
SELECT * FROM permissions;


-- /role./edit.該当roleの値に、パーミッション配列を追加するクエリ
-- まず、追加するパーミッションがrole_permissionsテーブルに存在するか確認します
SELECT * FROM role_permissions WHERE role_id = :role_id AND permission_id = :permission_id;

-- 存在しない場合、新しいパーミッションを追加するクエリ
INSERT INTO role_permissions (role_id, permission_id) VALUES (:role_id, :permission_id);

-- /role./delete.該当roleを削除するクエリ
DELETE FROM roles WHERE role_id = :role_id;

-- /order./request.waitオーダーを新しいorderIdとともに追加するクエリ
INSERT INTO orders (user_id, order_details, status, order_date) VALUES (:user_id, :order_details, 'wait', CURRENT_TIMESTAMP);

-- /order./request.ユーザーのメールアドレスを送るためのクエリ
-- これは具体的なアクションが不明ですが、メールアドレスを取得するクエリと仮定します
SELECT email FROM users WHERE user_id = :user_id;

-- /order./:orderId./cancel.オーダーをcancelに変更するクエリ
UPDATE orders SET status = 'cancelled' WHERE order_id = :order_id;

-- /order./:orderId./verification.オーダー現状をwaitからpendingに変更するクエリ
UPDATE orders SET status = 'pending' WHERE order_id = :order_id AND status = 'wait';

-- /order./:orderId./verification.認証するためのクエリ
-- 認証プロセスはアプリケーション固有ですが、一般的な状態更新のクエリとして
UPDATE orders SET status = 'verified' WHERE order_id = :order_id AND status = 'pending';

-- /order./:feature.オーダー状況を取得するクエリ
SELECT * FROM orders WHERE order_id = :order_id;

-- /order./:feature.開始時間から一定時間経過をしたオーダーを取得するクエリ
SELECT * FROM orders WHERE order_date <= CURRENT_TIMESTAMP - INTERVAL 'X' DAY;

-- /order.server.オーダー状況をpendingからdoneに変更するクエリ
UPDATE orders SET status = 'done' WHERE order_id = :order_id AND status = 'pending';



CREATE TABLE account_transactions
(
  transaction_id      INT       GENERATED ALWAYS AS IDENTITY,
  account_id          INT      ,
  transaction_details TEXT     ,
  transaction_date    TIMESTAMP,
  PRIMARY KEY (transaction_id)
);

CREATE TABLE accounts
(
  account_id      INT       GENERATED ALWAYS AS IDENTITY,
  user_id         INT      ,
  account_details TEXT     ,
  creation_date   TIMESTAMP,
  PRIMARY KEY (account_id)
);

CREATE TABLE orders
(
  order_id      INT         GENERATED ALWAYS AS IDENTITY,
  user_id       INT        ,
  order_details TEXT       ,
  status        VARCHAR(50),
  order_date    TIMESTAMP  ,
  PRIMARY KEY (order_id)
);

CREATE TABLE permissions
(
  permission_id   INT          GENERATED ALWAYS AS IDENTITY,
  permission_name VARCHAR(255),
  description     TEXT        ,
  PRIMARY KEY (permission_id)
);

CREATE TABLE role_permissions
(
  role_id       INT,
  permission_id INT,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE roles
(
  role_id     INT          GENERATED ALWAYS AS IDENTITY,
  role_name   VARCHAR(255),
  description TEXT        ,
  PRIMARY KEY (role_id)
);

CREATE TABLE user_permissions
(
  user_id       INT,
  permission_id INT,
  PRIMARY KEY (user_id, permission_id)
);

CREATE TABLE user_roles
(
  user_id INT,
  role_id INT,
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE users
(
  user_id           INT          GENERATED ALWAYS AS IDENTITY,
  user_name         VARCHAR(255),
  email             VARCHAR(255),
  registration_date TIMESTAMP   ,
  PRIMARY KEY (user_id)
);

ALTER TABLE user_permissions
  ADD CONSTRAINT FK_permissions_TO_user_permissions
    FOREIGN KEY (permission_id)
    REFERENCES permissions (permission_id);

ALTER TABLE role_permissions
  ADD CONSTRAINT FK_permissions_TO_role_permissions
    FOREIGN KEY (permission_id)
    REFERENCES permissions (permission_id);

ALTER TABLE user_roles
  ADD CONSTRAINT FK_roles_TO_user_roles
    FOREIGN KEY (role_id)
    REFERENCES roles (role_id);

ALTER TABLE accounts
  ADD CONSTRAINT FK_users_TO_accounts
    FOREIGN KEY (user_id)
    REFERENCES users (user_id);

ALTER TABLE account_transactions
  ADD CONSTRAINT FK_accounts_TO_account_transactions
    FOREIGN KEY (account_id)
    REFERENCES accounts (account_id);

ALTER TABLE orders
  ADD CONSTRAINT FK_users_TO_orders
    FOREIGN KEY (user_id)
    REFERENCES users (user_id);

DROP TABLE IF EXISTS account_transactions;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS user_permissions;
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;

CREATE TABLE authors (
  id   BIGSERIAL PRIMARY KEY,
  name text      NOT NULL,
  bio  text
);

DROP TABLE IF EXISTS authors;