# TG BetBot

Conversational Live Telegram Betting Game Options

# Overview

You can chat with the TG Bot to place quick bets on whether the price will go up or down in the next 15 seconds. It's a simple way to try predicting those tiny price swings. Just message the bot, tell it which way you think the price is headed, and see if you were right after 15 ticks. Quick and easy gambling on them market moves.
Orderly Network API is used to get market data such as pair price and last trades volume to show to the user the betting status.

# Demo

https://github.com/aeither/tg-conversational-option-betbot/assets/36173828/f43e1ceb-24cc-42ad-95c9-c52fa3adf7fe

# Features

- bet on price going up or down
- live update

# Techstack

- deno
- orderly
- grammyjs

## Setup

```bash
brew install deno
```

```bash
cp .env.example .env
```

Go to Telegram Bot Father and create a new bot to get the env Token.

## Run

with tasks `deno task task-name [additional args]`

- dev:reload allows update conserving state while dev restart the states. dev:reload offers better UX

```bash
deno task dev:reload
```

## Run Webhook locally

```bash
deno task start:bot
```

```bash
ngrok http 8000
```

Update PROJECT_URL in `scripts/index.ts` and run `deno task commands`

## Deployment

Publish repository to Github. Connect the repo to Deno deploy.

Setup with webhook to listen Telegram.

Go to `scripts/index.ts`. Update commands and PROJECT_URL.

Make sure to not add `/` at the and of url.
`const PROJECT_URL = 'https://projectname.deno.dev'`

```bash
deno task commands
```

## Add environment variables

```bash
cp .env.example .env.local
```

and then go to `lib/constants.ts`

## Screenshot

![s](https://github.com/aeither/tg-conversational-option-betbot/assets/36173828/c1bd56f4-ca23-47af-baa7-66dabe359956)

