# Docs App

This is a simple Next.js application hosting the GritQL docs.

## Dev

```shell
pnpm dev
```

## Test

Install Playwright if you haven't already:

```shell
pnpm playwright install
```

Run the tests using Playwright against your local instance:

```shell
NEXT_PUBLIC_DOCS_URL=http://localhost:3200 pnpm test
```
