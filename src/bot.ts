import { ChatCompletionMessageParam } from 'https://deno.land/x/openai@v4.33.0/resources/chat/mod.ts'
import { FunctionCallMessage, callFunction, chatGPTFunctions } from '../lib/chatgpt.ts'
import { OPEN_API_KEY, TELEGRAM_BOT_TOKEN } from '../lib/constants.ts'
import { Bot, OpenAI } from './deps.ts'

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

/**
 * Bot Commands
 */
bot.command('test', async (ctx) => {
  const openai = new OpenAI({
    apiKey: OPEN_API_KEY,
  })
  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content:
        'Please use our book database, which you can access using functions to answer the following questions.',
    },
    {
      role: 'user',
      content: 'I want the title of the book of ID a3',
      // 'I really enjoyed reading To Kill a Mockingbird, could you recommend me a book that is similar and tell me why?',
    },
  ]
  console.log(messages[0]) // system
  console.log(messages[1]) // user

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
  messages.push(newMessage)

  console.log(newMessage)

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
