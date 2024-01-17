## 企業内に経済圏を実装するアプリのモデル

企業内に経済圏を作る場合の基本的なアプリケーションモデルを実装します

経済圏を作るひとつの目的は、企業という一種のコミュニティの価値交換機能を実装し、活性化を図ることが挙げられます

企業内は一つのコミュニティの例であり,
各種SNSにも適応可能です

### 画面推移

![view transition](<docs/images/README/Screenshot 2024-01-17 072921.png>)

### データモデル

※RDBMSの場合

![data model](<docs/images/README/Screenshot 2024-01-17 073533.png>)


## Env

- windows 11
- wsl2 / ubuntu22.04
- nodejs 21.5.0
- pnpm 8.10.5
- devbox 0.8.2
- biome 1.5.1
- testcontainer 10.4.0

## Stack

- typescript
- hono / jsx
- postgres 
- vitest
- cloudflare workers / d1
- htmx

## Usage

Install:

```
npm install
```

Setup:

```
wrangler d1 create todo
wrangler d1 execute todo --local --file=todo.sql
```

Dev:

```
npm run dev
```

Deploy:

```
npm run deploy
```

## Author

Tetsuya Takasawa

## License

MIT

## Directory
- src
- packages
    - domain
      - core
    - infra
      - d1
      - postgres
      - worker
      - hono
    - app
      - features
    - view
      - components

## Dependency
- core / domain
    - infra
      - app
        - view