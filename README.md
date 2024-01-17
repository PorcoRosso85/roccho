## Stack

* Cloudflare Workers / D1 / Hono
* JSX (Hono middleware) / htmx

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