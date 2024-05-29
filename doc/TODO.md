# TODO

## 考察

- [ ] マイグレーション後にSQLの更新を忘れないよう強制できる仕組み
- [ ] vitest x SQL完成の単体テスト
- [ ] FSM設計と状態設計をStatelyで行えるか考察
- [ ] Nixを使用してLocalCIを検討
- [ ] テストデータの作成を自動化
- [ ] Dockerレイヤーを徐々にNixへ移行 ＝ ローカル開発を単純化する
- [ ] SQL超大作に注力する
  - [ ] 中間テーブルさえあれば、どんなに大きなモデルでの接続できる
- [ ] 単体テスト・負荷テスト -> CI/CDを自動化
- [x] wokersランタイムに依存するかを考察
  - [x] denoのコードを、デプロイ先workers
  - [x] D1以外のデータベース候補
    - [x] HyperDrive + Postgres ()
- [ ] pnpm依存はしないように注意
- [x] JSRベースにする
  - [x] denoコード
    - [x] というものが存在しない
  - [x] workerdランタイム
- [x] workerdランタイムにjsrコードで
  - [ ] ただjsrの対応がまだまだ過ぎる

## 結果

- [x] 結局wrangler + bunx/jsr package management
  - [ ] nodejs一択の実際, not deno
  - [ ] ただしTypescript前提, deno or bun
  - [ ] bun shellの存在
  - [ ]  
