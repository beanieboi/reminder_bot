const db = require('./postgres')
import bot from './bot'
import Telegraf, {ContextMessageUpdate} from "telegraf"
import Logger from './logger'
import Reminder from './reminder'
import { Task, Status } from './types'

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
  const query = 'SELECT * FROM tasks'
  let response

  try {
    response = await db.query(query)
  } catch(error) {
    ctx.reply(`Error ${error}`)
    response = []
  }

  let tasks = <Array<Task>>response.rows
  tasks.forEach((task) => {
    checkSnooze(ctx, task)
    checkDone(ctx, task)
  })

  next()
}

async function checkDone(ctx: ContextMessageUpdate, task: Task) {
  if (ctx.message.text.toLowerCase().includes("done") ||
      ctx.message.text.toLowerCase().includes("erledigt") ||
      ctx.message.text.toLowerCase().includes("passt") ||
      ctx.message.text.toLowerCase().includes("✅")) {
    if (ctx.message.text.toLowerCase().includes(task.keyword.toLowerCase())) {

      try {
        await Reminder.changeStatus(task, Status.COMPLETED, ctx.message.from.username)
        Reminder.addNewReminder(task, task.interval_minutes)
        ctx.reply(`Check, ${task.keyword} erledigt!`)
      } catch (error) {
        ctx.reply(error)
      }
    }
  }
}

async function checkSnooze(ctx :ContextMessageUpdate, task: Task) {
  if (ctx.message.text.toLowerCase().includes("snooze") ||
    ctx.message.text.toLowerCase().includes("später")) {

    if (ctx.message.text.toLowerCase().includes(task.keyword.toLowerCase())) {

      try {
        await Reminder.changeStatus(task, Status.SNOOZED, ctx.message.from.username)
        await Reminder.addNewReminder(task, task.snooze_default_minutes)
        ctx.reply(`Check, ${task.keyword} verschoben!`)
      } catch (error) {
        ctx.reply(error)
      }
    }
  }
}

const Handler = { handleResponse, handleInstallation, handleHelpMessage }

export default Handler
