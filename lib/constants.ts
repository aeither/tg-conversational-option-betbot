import { load } from '../src/deps.ts'

// export dotenv to Deno.env
await load({ export: true })

/**
 * Deno env
 */
export const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN') as string
if (!TELEGRAM_BOT_TOKEN) throw new Error('TELEGRAM_BOT_TOKEN not found')

export const TELEGRAM_BOT_TOKEN_LIVE = Deno.env.get('TELEGRAM_BOT_TOKEN_LIVE') as string
if (!TELEGRAM_BOT_TOKEN_LIVE) throw new Error('TELEGRAM_BOT_TOKEN_LIVE not found')

export const OPEN_API_KEY = Deno.env.get('OPEN_API_KEY') as string
if (!OPEN_API_KEY) throw new Error('OPEN_API_KEY not found')
