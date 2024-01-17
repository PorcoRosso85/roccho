### 企業内に経済圏を実装するアプリのモデル

企業内に経済圏を作る場合の基本的なアプリケーションモデルを実装します

経済圏を作るひとつの目的は、企業という一種のコミュニティの価値交換機能を実装し、活性化を図ることが挙げられます

企業内は一つのコミュニティの例であり,
各種SNSにも適応可能です

#### 画面推移

![view transition](<docs/images/README/Screenshot 2024-01-17 072921.png>)

#### データモデル

※RDBMSの場合

![data model](<docs/images/README/Screenshot 2024-01-17 073533.png>)

#### 技術
- typescript
- hono 3.12.5
- postgres 16.1
- vitest

#### 開発環境
- windows 11
- wsl2 / ubuntu22.04
- nodejs 21.5.0
- pnpm 8.10.5
- devbox 0.8.2
- biome 1.5.1
- testcontainer 10.4.0