import { resolve } from "path"
import { config } from "dotenv"
import logger from './logger'
import Telegraf from "telegraf"


config({ path: resolve(__dirname, "../.env") })

const bot = new Telegraf(process.env.BOT_TOKEN)

const handleHi = (ctx) => ctx.reply('Hey there')

let chatId: number = -434661783

const launch = async () => {
  const botInfo = await bot.telegram.getMe()
  bot.options.username = botInfo.username

  logger.debug(bot.options)

  bot.start((ctx) => {
    // save chat id for all open chats
    logger.debug(ctx.chat)
    chatId = ctx.chat.id
    ctx.reply('Welcome')
  })

  bot.hears('hi', handleHi)

  bot.on('message', (ctx) => {
    logger.debug(ctx.message)
  })

  return bot.launch()
}

const sendMessage = (message) => {
  logger.debug(chatId)
  if (chatId) {
    return bot.telegram.sendMessage(chatId, message)
  }
  return Promise.resolve("Done")
}

const Bot = {launch, sendMessage}

export default Bot
