import moment from 'moment'
import Bot from './bot'
import { reminderData, Reminder, Task, Status } from './data'
import Logger from './logger'
const db = require('./postgres')

const intervalInMs = 60000
let intervalId: NodeJS.Timeout


interface OpenReminder {
  status: string,
  message: string,
  interval_hours: number,
  chat_id: number
}

const findReminder = async () => {
  const query = `SELECT status, message, interval_hours, chat_id FROM reminders
    LEFT JOIN tasks ON reminders.task_id = tasks.id
    LEFT JOIN installations ON tasks.installation_id = installations.id`

  try {
    const response = await db.query(query)
    const rows: OpenReminder[] = response.rows
    return rows
  } catch(err) {
    return []
  }
}

const start = () => {
  intervalId = setInterval( async() => {
    const notifyReminder = await findReminder()
    Logger.debug(notifyReminder)
    // notifyReminder.forEach((reminder) => {
    //   Bot.sendMessage(`${reminder.task.text} at ${moment(reminder.task.start_time).format("dddd, MMMM Do YYYY, H:mm")}`)
    // })
  }, intervalInMs)
}

const stop = () => {
  clearInterval(intervalId)
}

const Reminder = {start, stop, findReminder}

export default Reminder
