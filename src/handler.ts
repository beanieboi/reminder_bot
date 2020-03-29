import Bot from './bot'
import Logger from './logger'
const db = require('./postgres')

interface Keyword {
  task_id: string,
  keyword: string
}

const handleListReminder = (ctx: ContextMessageUpdate) => {
  reminderData.forEach(reminder => {
    // todo: format messages
    ctx.reply(reminder.task.text)
  })
}

const handleInstallation = async (ctx: ContextMessageUpdate) => {
  const query = `INSERT INTO
    installations (chat_id, chat_type)
    VALUES($1, $2)
    ON CONFLICT (chat_id)
    DO NOTHING;`
  const res = await db.query(query, [ctx.chat.id, ctx.chat.type])
  ctx.reply('Welcome')
}

const handleResponse = async (ctx: ContextMessageUpdate) => {
  query = 'SELECT id as task_id, keyword FROM tasks'
  const response = await db.query(query)

  let keywords = <Array<Keyword>>response.rows
  keywords.forEach((word) => {


  })
  ctx.reply('Welcome')
}

const Handler = { handleResponse, handleInstallation, handleListReminder }

export default Handler