## Run a file without deno.json task

```
deno run --allow-net --allow-env bot.ts
```

## Send message to a Telegram chat

```
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage?chat_id=<USER_CHAT_ID>&text=<MESSAGE_TEXT>
```

## On Orderly

The documentation cover the usage. I difficult part was lack of examples and how to get the parameters for calling the functions. Also more detailed explanation about what those arguments are used for can be helpful

## Pending to Template

Return the user message back `ctx.message.text`

## Test infos

symbol `PERP_ETH_USDC`

market trades
https://orderly.network/docs/build-on-evm/evm-api/restful-api/public/get-market-trades

trading pair info
https://orderly.network/docs/build-on-evm/evm-api/restful-api/public/get-futures-info-for-one-market

funding rates
https://orderly.network/docs/build-on-evm/evm-api/restful-api/public/get-predicted-funding-rate-for-one-market

leaderboard
https://orderly.network/docs/build-on-evm/evm-api/restful-api/public/get-points-leaderboard

## Requires further research

```js
import { Composer } from 'grammy'

import { MenuTemplate } from 'grammy-inline-menu'
```
