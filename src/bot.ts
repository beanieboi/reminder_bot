import { config } from "dotenv"
import { resolve } from "path"
import Logger from './logger'
import Telegraf from "telegraf"

if (process.env.DYNO == undefined) {
  config({ path: resolve(__dirname, "../.env") })
}

import Handler from './handler'

const bot = new Telegraf(process.env.BOT_TOKEN)

const launch = async () => {
  const botInfo = await bot.telegram.getMe()
  bot.options.username = botInfo.username

  bot.start(Handler.handleInstallation)
  bot.on('text', Handler.handleHelpMessage, Handler.handleResponse)

  return bot.launch()
}

const sendMessage = (chatId: number, message: string) => {
  return bot.telegram.sendMessage(chatId, message)
}

const Bot = {launch, sendMessage}

export default Bot
