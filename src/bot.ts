import { ChatCompletionMessageParam } from 'https://deno.land/x/openai@v4.33.0/resources/chat/mod.ts'
import { FunctionCallMessage, callFunction, chatGPTFunctions } from '../lib/chatgpt.ts'
import { OPEN_API_KEY, TELEGRAM_BOT_TOKEN } from '../lib/constants.ts'
import { Bot, Keyboard, OpenAI } from './deps.ts'

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

/**
 * Bot Commands
 */

bot.command('app', (ctx) => ctx.reply('Use app!!!', { reply_markup: keyboard }))

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
