
-- CREATE TABLE users
-- (
--   user_id           INT          GENERATED ALWAYS AS IDENTITY,
--   user_name          VARCHAR(255),
--   email             VARCHAR(255),
--   registration_date TIMESTAMP   ,
--   PRIMARY KEY (user_id)
-- );

-- テスト用ランダムデータを生成して、usersテーブルにINSERTする
-- tested
INSERT INTO users (user_name, email, registration_date)
SELECT 
  concat('user', generate_series),
  concat('user', generate_series, '@example.com'),
  '2019-01-01 00:00:00'::timestamp + (random() * (now() - '2019-01-01 00:00:00'::timestamp))
FROM generate_series(1, 1000);

-- テスト用ランダムデータを生成して、ordersテーブルにINSERTする

INSERT INTO orders (user_id, order_details, status, order_date)
SELECT 
  (random() * 1000)::integer,
  'details',
  'status',
  '2019-01-01 00:00:00'::timestamp + (random() * (now() - '2019-01-01 00:00:00'::timestamp))
FROM generate_series(1, 1000);

-- テスト用ランダムデータを生成して、accountテーブルにINSERTする

INSERT INTO account (user_id, account_details, creation_date)
SELECT 
  (random() * 1000)::integer,
  'details',
  '2019-01-01 00:00:00'::timestamp + (random() * (now() - '2019-01-01 00:00:00'::timestamp))
FROM generate_series(1, 1000);

-- テスト用ランダムデータを生成して、permissionsテーブルにINSERTする

INSERT INTO permissions (permission_name, description)
SELECT 
  concat('permission', generate_series),
  'description'
FROM generate_series(1, 1000);

-- テスト用ランダムデータを生成して、rolesテーブルにINSERTする

INSERT INTO roles (role_name, description)
SELECT 
  concat('role', generate_series),
  'description'
FROM generate_series(1, 1000);

-- テスト用ランダムデータを生成して、role_permissionsテーブルにINSERTする

INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (random() * 1000)::integer,
  (random() * 1000)::integer
FROM generate_series(1, 1000);

-- テスト