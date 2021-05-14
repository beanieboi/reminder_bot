const db = require('./postgres')
import { Message } from "discord.js"
import Reminder from './reminder'
import { Task, Status } from './types'

const handleResponse = async (botId: string, message: Message) => {
  if (message.author.id === botId) {
    return
  }

  const query = 'SELECT * FROM tasks'
  let response

  try {
    response = await db.query(query)
  } catch(error) {
    message.reply(`Error ${error}`)
    response = []
  }

  let tasks = <Array<Task>>response.rows
  tasks.forEach((task) => {
    checkSnooze(message, task)
    checkDone(message, task)
  })
}

async function checkDone(message: Message, task: Task) {
  if (message.content.toLowerCase().includes("done") ||
      message.content.toLowerCase().includes("erledigt") ||
      message.content.toLowerCase().includes("passt") ||
      message.content.toLowerCase().includes("✅")) {
    if (message.content.toLowerCase().includes(task.keyword.toLowerCase())) {

      try {
        await Reminder.changeStatus(task, Status.COMPLETED, message.author.username)
        Reminder.addNewReminder(task, task.interval_minutes)
        message.reply(`Check, ${task.keyword} erledigt!`)
      } catch (error) {
        message.reply(error)
      }
    }
  }
}

async function checkSnooze(message: Message, task: Task) {
  if (message.content.toLowerCase().includes("snooze") ||
    message.content.toLowerCase().includes("später")) {

    if (message.content.toLowerCase().includes(task.keyword.toLowerCase())) {

      try {
        await Reminder.changeStatus(task, Status.SNOOZED, message.author.username)
        await Reminder.addNewReminder(task, task.snooze_default_minutes)
        message.reply(`Check, ${task.keyword} verschoben!`)
      } catch (error) {
        message.reply(error)
      }
    }
  }
}

const Handler = { handleResponse }

export default Handler
