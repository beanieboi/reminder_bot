import { resolve } from "path"
import { config } from "dotenv"
import Logger from './logger'
import { reminderData } from './data'
import Telegraf, {ContextMessageUpdate} from "telegraf"
import Handler from './handler'

const db = require('./postgres')

config({ path: resolve(__dirname, "../.env") })

const bot = new Telegraf(process.env.BOT_TOKEN)

const launch = async () => {
  const botInfo = await bot.telegram.getMe()
  bot.options.username = botInfo.username

  Logger.debug(bot.options)

  bot.start(Handler.handleInstallation)
  bot.hears('/list', Handler.handleListReminder)
  bot.on('text', Handler.handleResponse)

  return bot.launch()
}

const sendMessage = (chatId: number, message: string) => {
  return bot.telegram.sendMessage(chatId, message)
}

const Bot = {launch, sendMessage}

export default Bot
