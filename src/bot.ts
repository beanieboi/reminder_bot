import { resolve } from "path"
import { config } from "dotenv"
import Logger from './logger'
import { reminderData } from './data'
import Telegraf, {ContextMessageUpdate} from "telegraf"

config({ path: resolve(__dirname, "../.env") })

const bot = new Telegraf(process.env.BOT_TOKEN)

let chatId: number = 67731373

const handleListReminder = (ctx: ContextMessageUpdate) => {
  reminderData.forEach(reminder => {
    // todo: format messages
    ctx.reply(reminder.task.text)
  })
}

const launch = async () => {
  const botInfo = await bot.telegram.getMe()
  bot.options.username = botInfo.username

  Logger.debug(bot.options)

  bot.start((ctx: ContextMessageUpdate) => {
    // todo: save chat id
    chatId = ctx.chat.id
    ctx.reply('Welcome')
  })

  bot.hears('/list', handleListReminder)

  // bot.on('message', (ctx) => {
  //   Logger.debug(ctx.message)
  // })

  return bot.launch()
}

const sendMessage = (message: string) => {
  if (chatId) {
    return bot.telegram.sendMessage(chatId, message)
  }
  return Promise.resolve("Done")
}

const Bot = {launch, sendMessage}

export default Bot
