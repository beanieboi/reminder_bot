const db = require('./postgres')
import bot from './bot'
import Telegraf, {ContextMessageUpdate} from "telegraf"
import Logger from './logger'

interface Keyword {
  task_id: string,
  keyword: string
}

const handleHelpMessage = (ctx: ContextMessageUpdate, next) => {
  const mess = ctx.message.text
  if (ctx.message.text.includes("help")) {
    bot.sendMessage(ctx.chat.id, `
To list all reminders say: reminderlist\n
To cancel a reminder say: cancel [keyword]\n
To snooze a reminder say: snooze [keyword]
`)
  }
  next()
}

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

const handleResponse = async (ctx: ContextMessageUpdate, next) => {
  Logger.debug("dd")
  const query = 'SELECT id as task_id, keyword FROM tasks'
  const response = await db.query(query)

  let keywords = <Array<Keyword>>response.rows
  keywords.forEach((word) => {


  })
  ctx.reply('Welcome')
  next()
}

const Handler = { handleResponse, handleInstallation, handleHelpMessage }

export default Handler
