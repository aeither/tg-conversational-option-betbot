# Telegram Bot

Deno Deploy + Grammyjs

# Setup

```bash
brew install deno
```

```bash
cp .env.example .env
```

Go to Telegram Bot Father and create a new bot to get the env Token.

# Run

with tasks `deno task task-name [additional args]`

- dev:reload allows update conserving state while dev restart the states. dev:reload offers better UX

```bash
deno task dev:reload
```

# Run Webhook locally

```bash
deno task start:bot
```

```bash
ngrok http 8000
```

Update PROJECT_URL in `scripts/index.ts` and run `deno task commands`

# Deployment

Publish repository to Github. Connect the repo to Deno deploy.

Setup with webhook to listen Telegram.

Go to `scripts/index.ts`. Update commands and PROJECT_URL.

Make sure to not add `/` at the and of url.
`const PROJECT_URL = 'https://projectname.deno.dev'`

```bash
deno task commands
```

# Add environment variables

```bash
cp .env.example .env.local
```

and then go to `lib/constants.ts`
