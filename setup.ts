/**
 * This file is used for setup the vitest environment
 */

/**
 * crypto is required for using jwt in vitest
 * @quantic/config/src/cryptoからのインポートにより、cryptoモジュールがグローバルスコープに追加されます。これはglobal.d.tsで定義したglobal.cryptoの型と一致するはずです。
 * この設定により、cryptoモジュールを直接インポートすることなく、プロジェクト全体でcryptoを使用することができます。これは、vitestでjwtを使用するために必要なcryptoモジュールを提供します。
 * ただし、@quantic/config/src/cryptoが実際にcryptoモジュールをグローバルスコープに追加すること、そしてそのモジュールがglobal.d.tsで定義したcryptoの型と一致することを確認する必要があります。
 */
import '@quantic/config/src/crypto'
