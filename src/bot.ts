import { ChatCompletionMessageParam } from 'https://deno.land/x/openai@v4.33.0/resources/chat/mod.ts'
import { FunctionCallMessage, callFunction, chatGPTFunctions } from '../lib/chatgpt.ts'
import { OPEN_API_KEY, TELEGRAM_BOT_TOKEN } from '../lib/constants.ts'
import { Bot, CommandContext, Context, InlineKeyboard, Keyboard, OpenAI } from './deps.ts'
import { Message } from 'https://deno.land/x/grammy@v1.21.2/types.deno.ts'

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

const MENU_BUTTON_BUY = 'BUY 📈'
const MENU_BUTTON_SELL = 'SELL 📉'
const placeholderKeyboard = new Keyboard()
  .text(MENU_BUTTON_BUY)
  .row()
  .text(MENU_BUTTON_SELL)
// .placeholder('Decide now!')

const inlineKeyboard = new InlineKeyboard().webApp('Simple App', WEBAPP_URL)

/**
 * Bot Commands
 */
bot.command('play', (ctx) =>
  ctx.reply('Bet if price is higher or lower than current price after 15 seconds', {
    reply_markup: placeholderKeyboard,
  }),
)
bot.command('stop', (ctx) =>
  ctx.reply('Thanks for playing. Use /play to start again', {
    reply_markup: { remove_keyboard: true },
  }),
)

bot.command('bet', (ctx) => {
  const fetchMarketTrades = async (): Promise<{
    totalBuyQuantity: number
    totalSellQuantity: number
    lastExecutedPrice: number
  }> => {
    try {
      const options = { method: 'GET' }
      const response = await fetch(
        'https://api-evm.orderly.network/v1/public/market_trades?symbol=PERP_ETH_USDC',
        options,
      )
      const data: MarketTradesResponse = await response.json()

      let totalBuyQuantity = 0
      let totalSellQuantity = 0
      let lastExecutedPrice = 0

      for (const trade of data.data.rows) {
        if (trade.side === 'BUY') {
          totalBuyQuantity += trade.executed_quantity
        } else {
          totalSellQuantity += trade.executed_quantity
        }
        lastExecutedPrice = trade.executed_price
      }

      return { totalBuyQuantity, totalSellQuantity, lastExecutedPrice }
    } catch (err) {
      console.error(err)
      return { totalBuyQuantity: 0, totalSellQuantity: 0, lastExecutedPrice: 0 }
    }
  }

  const updateMessage = async (
    ctx: CommandContext<Context>,
    textMessage: Message.TextMessage,
  ) => {
    try {
      const delays = [3000, 8000, 13000] // Delays in milliseconds

      for (let i = 0; i < delays.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, delays[i]))

        const trades = await fetchMarketTrades()
        ctx.api.editMessageText(
          ctx.chat.id,
          textMessage.message_id,
          `${delays[i] / 1000}s. buy ${trades.totalBuyQuantity.toFixed(
            4,
          )}, sell ${trades.totalSellQuantity.toFixed(4)}, \n price ${
            trades.lastExecutedPrice
          }`,
        )
      }
    } catch (err) {
      console.error(err)
    }
  }

  ctx.reply('Betting on BUY or SELL...').then((textMessage) => {
    updateMessage(ctx, textMessage)
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
 * On Specific Message
 */

bot.hears(MENU_BUTTON_BUY, async (ctx) => {
  if (ctx.chat.type == 'private') {
    // do something
    ctx.reply(MENU_BUTTON_BUY)
  }
})

bot.hears(MENU_BUTTON_SELL, async (ctx) => {
  if (ctx.chat.type == 'private') {
    // do something
    ctx.reply(MENU_BUTTON_SELL)
  }
})

/**
 * Other Messages
 */

bot.on('message', (ctx) => {
  const chatId = ctx.message.chat.id
  console.log(`Message received from chat ID: ${chatId}`)
  ctx.reply('Got another message!')
})
