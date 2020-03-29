import { resolve } from "path"
import { config } from "dotenv"
import Logger from './logger'
import Telegraf, {ContextMessageUpdate} from "telegraf"
import Handler from './handler'

const db = require('./postgres')

config({ path: resolve(__dirname, "../.env") })

const bot = new Telegraf(process.env.BOT_TOKEN)

const handleInstallation = async (ctx: ContextMessageUpdate) => {
  const query = `INSERT INTO
    installations (chat_id, chat_type)
    VALUES($1, $2)
    ON CONFLICT (chat_id)
    DO NOTHING;`

  try {
    await db.query(query, [ctx.chat.id, ctx.chat.type])
    ctx.reply('Welcome')
  } catch (error) {
    ctx.reply(`Error ${error}`)
  }
}

const launch = async () => {
  const botInfo = await bot.telegram.getMe()
  bot.options.username = botInfo.username

  Logger.debug(bot.options)

  bot.start(Handler.handleInstallation)
  bot.on('text', Handler.handleResponse)

  return bot.launch()
}

const sendMessage = (chatId: number, message: string) => {
  return bot.telegram.sendMessage(chatId, message)
}

const Bot = {launch, sendMessage}

export default Bot
