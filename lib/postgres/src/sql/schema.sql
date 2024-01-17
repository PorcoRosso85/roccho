
CREATE TABLE groups
(
  group_id   INT         ,
  group_name VARCHAR(255),
  PRIMARY KEY (group_id)
);

CREATE TABLE items
(
  item_id   INT         NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  balance   DECIMAL     NOT NULL DEFAULT 0, -- 勘定科目のバランス
  owner_user_id  INT         NOT NULL, -- 勘定科目のオーナー
  last_updated TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- 最後に更新された日時
  PRIMARY KEY (item_id)
);

CREATE TABLE roles
(
  role_id   INT         ,
  role_name VARCHAR(255),
  PRIMARY KEY (role_id)
);

CREATE TABLE transactions
(
  transaction_id   INT      ,
  user_id          INT      ,
  transaction_date TIMESTAMP,
  amount           DECIMAL  ,
  PRIMARY KEY (transaction_id)
);

CREATE TABLE users
(
  user_id  INT         ,
  user_name VARCHAR(255),
  email    VARCHAR(255),
  registered_at TIMESTAMP,
  PRIMARY KEY (user_id)
);

CREATE TABLE users_groups
(
  user_id  INT,
  group_id INT,
  PRIMARY KEY (user_id, group_id)
);

CREATE TABLE users_roles
(
  user_id INT,
  role_id INT,
  PRIMARY KEY (user_id, role_id)
);

ALTER TABLE users_roles
  ADD CONSTRAINT FK_users_TO_users_roles
    FOREIGN KEY (user_id)
    REFERENCES users (user_id);

ALTER TABLE users_roles
  ADD CONSTRAINT FK_roles_TO_users_roles
    FOREIGN KEY (role_id)
    REFERENCES roles (role_id);

ALTER TABLE transactions
  ADD CONSTRAINT FK_users_TO_transactions
    FOREIGN KEY (user_id)
    REFERENCES users (user_id);

ALTER TABLE items
  ADD CONSTRAINT FK_users_TO_items
    FOREIGN KEY (owner_user_id)
    REFERENCES users (user_id);

ALTER TABLE users_groups
  ADD CONSTRAINT FK_users_TO_users_groups
    FOREIGN KEY (user_id)
    REFERENCES users (user_id);

ALTER TABLE users_groups
  ADD CONSTRAINT FK_groups_TO_users_groups
    FOREIGN KEY (group_id)
    REFERENCES groups (group_id);
