import {ContextMessageUpdate} from "telegraf"
import moment from "moment"
const db = require('./postgres')
import { Task, Status } from './types'
import Logger from './logger'
import Bot from './bot'


const intervalInMs = 6000
let intervalId: NodeJS.Timeout

interface OpenReminder {
  status: string,
  message: string,
  interval_minutes: number,
  chat_id: number,
  keyword: string
}

const findReminder: () => Promise<OpenReminder[]> = async () => {
  const query = `SELECT status, message, interval_minutes, chat_id, keyword
    FROM reminders
    LEFT JOIN tasks ON reminders.task_id = tasks.id
    LEFT JOIN installations ON tasks.installation_id = installations.id
    WHERE reminders.status = $? AND due_at < NOW()::time;`

  try {
    const response = await db.query(query, Status.OPEN)
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
  SET status = $1, finished_at = NOW(), finished_by = $2
  WHERE task_id = $3 AND reminders.status = $4 AND due_at < NOW()::time`

  try {
    db.query(query, [status, ctx.message.from.username, task.id, Status.OPEN])
  } catch (error) {
    ctx.reply(`Error ${error}`)
  }
}

const addNewReminder = async (task: Task, nextReminderInMinutes: number) => {
  const getLastReminder = `SELECT due_at FROM reminders WHERE task_id = $1 ORDER BY id DESC LIMIT 1`
  const insertNewReminder = `INSERT INTO reminders (task_id, status, start_time)
  VALUES ($1, $2, $3)`

  try {
    const due_at = await db.query(getLastReminder, [task.id])
    const new_due_at = moment(due_at).add(nextReminderInMinutes, "m")
    await db.query(insertNewReminder, [task.id, Status.OPEN, new_due_at])
  } catch(err) {
    Logger.error(err)
  }
}

const Reminder = {start, stop, findReminder, changeStatus, addNewReminder}

export default Reminder
