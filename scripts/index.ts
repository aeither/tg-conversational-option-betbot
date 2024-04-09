import { TELEGRAM_BOT_TOKEN, TELEGRAM_BOT_TOKEN_LIVE } from '../lib/constants.ts'
import { bot } from '../src/bot.ts'
import { Bot, BotCommand } from '../src/deps.ts'

const commands: BotCommand[] = [{ command: 'hi', description: 'Hi!!!' }]

/**
 * Update commands
 * Test and Live Bot
 */
// Local Bot Commands
await bot.api.setMyCommands(commands)

// Live Bot Commands
const liveBot = new Bot(TELEGRAM_BOT_TOKEN_LIVE)
await liveBot.api.setMyCommands(commands)

/**
 * Update Webhook
 */

// Update Local Webhook
// const PROJECT_URL = 'https://0d3b-188-119-60-248.ngrok-free.app'
// await bot.api.setWebhook(`${PROJECT_URL}/${TELEGRAM_BOT_TOKEN}`)

// Update Live Webhook
const PROJECT_URL = 'https://projectname.deno.dev'
await liveBot.api.setWebhook(`${PROJECT_URL}/${TELEGRAM_BOT_TOKEN_LIVE}`)
// or
// https://api.telegram.org/bot{my_bot_token}/setWebhook?url={url_to_send_updates_to}
