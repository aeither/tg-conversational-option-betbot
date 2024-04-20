import { ChatCompletionMessageParam } from 'https://deno.land/x/openai@v4.33.0/resources/chat/mod.ts'
import { FunctionCallMessage, callFunction, chatGPTFunctions } from '../lib/chatgpt.ts'
import { OPEN_API_KEY, TELEGRAM_BOT_TOKEN } from '../lib/constants.ts'
import { Bot, InlineKeyboard, Keyboard, OpenAI } from './deps.ts'

/**
 * Types
 */

interface TradeData {
  symbol: string
  side: 'BUY' | 'SELL'
  executed_price: number
  executed_quantity: number
  executed_timestamp: number
}

interface ResponseData {
  rows: TradeData[]
}

interface MarketTradesResponse {
  success: boolean
  data: ResponseData
  timestamp: number
}

/**
 * Bot Definition
 */

export const bot = new Bot(TELEGRAM_BOT_TOKEN, {
  client: {
    timeoutSeconds: 60,
    canUseWebhookReply: (method) => {
      console.log('botConfig :', method)
      return true
    },
  },
})

const openai = new OpenAI({
  apiKey: OPEN_API_KEY,
})

const WEBAPP_URL =
  Deno.env.get('NODE_ENV') === 'development'
    ? 'https://ba0a-2409-8928-a224-be6-387b-1896-7806-5dc9.ngrok-free.app'
    : 'https://PRODUCTIONAPPURL.vercel.app'
console.log('WEBAPP_URL using: ', WEBAPP_URL)

const keyboard = new Keyboard()
keyboard.webApp('Web App', WEBAPP_URL)

const placeholderKeyboard = new Keyboard().text('Yes').row().text('No')
// .placeholder('Decide now!')

const inlineKeyboard = new InlineKeyboard().webApp('Simple App', WEBAPP_URL)

/**
 * Bot Commands
 */

bot.command('bet', (ctx) => {
  const fetchMarketTrades = async () => {
    try {
      const options = { method: 'GET' }
      const response = await fetch(
        'https://api-evm.orderly.network/v1/public/market_trades?symbol=PERP_ETH_USDC',
        options,
      )
      const data: MarketTradesResponse = await response.json()
      const trades = data.data.rows[0].executed_price.toString()
      return trades
    } catch (err) {
      console.error(err)
      return ''
    }
  }

  ctx.reply('starting...').then((textMessage) => {
    setTimeout(async () => {
      const trades = await fetchMarketTrades()
      ctx.api.editMessageText(ctx.chat.id, textMessage.message_id, `msg1 ${trades}`)
    }, 2000)

    setTimeout(() => {
      ctx.api.editMessageText(ctx.chat.id, textMessage.message_id, 'msg2')
    }, 5000)

    setTimeout(() => {
      ctx.api.editMessageText(ctx.chat.id, textMessage.message_id, 'msg3')
    }, 10000)

    setTimeout(() => {
      ctx.api.editMessageText(ctx.chat.id, textMessage.message_id, 'msg4')
    }, 15000)
  })
})

bot.command('app', (ctx) => ctx.reply('Use app!!!', { reply_markup: inlineKeyboard }))

bot.command('test', async (ctx) => {
  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content:
        'You are a trading agent, you are going to help the user do onchain actions with the functions',
    },
    {
      role: 'user',
      content: 'I want to buy 10 apples', // ctx.message?.text
      // 'I really enjoyed reading To Kill a Mockingbird, could you recommend me a book that is similar and tell me why?',
    },
  ]

  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages,
    functions: chatGPTFunctions,
  })

  const message = completion.choices[0]!.message as FunctionCallMessage
  messages.push(message)

  // If there is a function call, we generate a new message with the role 'function'.
  const result = await callFunction(message.function_call)
  const newMessage = {
    role: 'function' as const,
    name: message.function_call.name!,
    content: JSON.stringify(result),
  }

  // Save it to cache for context in following messages
  // messages.push(newMessage)

  console.log(newMessage)
  ctx.reply('Welcome! Up and running.')
})

bot.command('latency', async (ctx) => {
  await ctx.replyWithChatAction('typing')

  function callback(...args: any[]): void {
    console.log('hello')
  }
  await setTimeout(callback, 5000)

  ctx.reply('Welcome! Up and running.')
})

bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'))

bot.command('ping', (ctx) => ctx.reply(`Pong! ${new Date()} ${Date.now()}`))

/**
 * Other Messages
 */
bot.on('message', (ctx) => {
  const chatId = ctx.message.chat.id
  console.log(`Message received from chat ID: ${chatId}`)
  ctx.reply('Got another message!')
})
