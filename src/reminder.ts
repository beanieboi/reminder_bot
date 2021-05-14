import moment from "moment"
const db = require('./postgres')
import { Task, Status } from './types'
import Logger from './logger'
import Bot from './bot'


const intervalInMs = 60000
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
    WHERE reminders.status = $1 AND reminders.due_at < NOW();`

  try {
    const response = await db.query(query, [Status.OPEN])
    return response.rows
  } catch(err) {
    Logger.debug(err)
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

const changeStatus = (task: Task, status: Status, username: string) => {
  const query = `UPDATE reminders
  SET status = $1, finished_at = NOW(), finished_by = $2
  WHERE task_id = $3 AND reminders.status = $4`

  return db.query(query, [status, username, task.id, Status.OPEN])
}

const addNewReminder = async (task: Task, nextReminderInMinutes: number) => {
  const getLastReminder = `SELECT due_at FROM reminders WHERE task_id = $1 ORDER BY id DESC LIMIT 1`
  const insertNewReminder = `INSERT INTO reminders (task_id, status, due_at)
  VALUES ($1, $2, to_timestamp($3))`

  try {
    const response = await db.query(getLastReminder, [task.id])
    const new_due_at = moment(response.rows[0].due_at).add(nextReminderInMinutes, "m")

    return db.query(insertNewReminder, [task.id, Status.OPEN, new_due_at.format('X')])
  } catch (error) {
    return new Error(error)
  }
}

const Reminder = {start, stop, findReminder, changeStatus, addNewReminder}

export default Reminder
