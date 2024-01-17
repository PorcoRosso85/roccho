-- drop if EXISTs
-- -- user table
-- CREATE TABLE users (
--   id   INTEGER PRIMARY KEY,
--   name text    NOT NULL
-- );

-- -- account table
-- CREATE TABLE accounts (
--   id      INTEGER PRIMARY KEY,
--   name    text    NOT NULL,
--   balance integer NOT NULL
-- );

-- -- reason table
-- CREATE TABLE reasons (
--   id      INTEGER PRIMARY KEY,
--   name    text    NOT NULL,
--   account_id integer NOT NULL,
--   ammount integer NOT NULL
-- );

-- -- transaction table
-- CREATE TABLE transactions (
--   id      INTEGER PRIMARY KEY,
--   reason_id integer NOT NULL,
--   debit_credit boolean NOT NULL,
--   ammount integer NOT NULL
-- );

-- -- user_account table
-- CREATE TABLE user_account (
--     user_id      INTEGER NOT NULL,
--     account_id   INTEGER NOT NULL,
--     PRIMARY KEY (user_id, account_id)
-- );

-- -- account_reason table
-- CREATE TABLE account_reason (
--     account_id      INTEGER NOT NULL,
--     reason_id   INTEGER NOT NULL,
--     PRIMARY KEY (account_id, reason_id)
-- );

-- -- Add foreign key constraints to user_account
-- ALTER TABLE user_account
--     ADD FOREIGN KEY (user_id) REFERENCES users (id),
--     ADD FOREIGN KEY (account_id) REFERENCES accounts (id);

-- -- Add foreign key constraints to account_reason
-- ALTER TABLE account_reason
--     ADD FOREIGN KEY (account_id) REFERENCES accounts (id),
--     ADD FOREIGN KEY (reason_id) REFERENCES reasons (id);


-- drop if EXISTs
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS accounts;
DROP TABLE IF EXISTS reasons;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS user_account;
DROP TABLE IF EXISTS account_reason;

