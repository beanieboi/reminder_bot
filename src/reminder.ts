import Bot from './bot'
const db = require('./postgres')
import { Task, Status } from './types'
import Logger from './logger'
import {ContextMessageUpdate} from "telegraf"

const intervalInMs = 6000
let intervalId: NodeJS.Timeout

interface OpenReminder {
  status: string,
  message: string,
  interval_hours: number,
  chat_id: number,
  keyword: string
}

const findReminder: () => Promise<OpenReminder[]> = async () => {
  const query = `SELECT status, message, interval_hours, chat_id, keyword
    FROM reminders
    LEFT JOIN tasks ON reminders.task_id = tasks.id
    LEFT JOIN installations ON tasks.installation_id = installations.id
    WHERE reminders.status = 'OPEN' AND start_time < NOW()::time;`

  try {
    const response = await db.query(query)
    return response.rows
  } catch(err) {
    return []
  }
}

const start = () => {
  intervalId = setInterval( async() => {
    const notifyReminder = await findReminder()
    notifyReminder.forEach((reminder) => {
      Bot.sendMessage(reminder.chat_id, `${reminder.message}`)
    })
  }, intervalInMs)
}

const stop = () => {
  clearInterval(intervalId)
}

const changeStatus = (ctx: ContextMessageUpdate, task: Task, status: Status) => {
  const query = `UPDATE reminders
  SET status = $1
  WHERE task_id = $2 AND reminders.status = 'OPEN' AND start_time < NOW()::time`

  try {
    db.query(query, [status, task.id])
  } catch (error) {
    ctx.reply(`Error ${error}`)
  }
}

const addNewReminder = (task: Task) => {

}


const Reminder = {start, stop, findReminder, changeStatus, addNewReminder}

export default Reminder
