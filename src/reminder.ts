import Bot from './bot'
const db = require('./postgres')

const intervalInMs = 60000
let intervalId: NodeJS.Timeout

interface OpenReminder {
  status: string,
  message: string,
  interval_hours: number,
  chat_id: number
}

const findReminder: () => Promise<OpenReminder[]> = async () => {
  const query = `SELECT status, message, interval_hours, chat_id FROM reminders
    LEFT JOIN tasks ON reminders.task_id = tasks.id
    LEFT JOIN installations ON tasks.installation_id = installations.id`

  try {
    const response = await db.query(query)
    return response.rows
  } catch(err) {
    return Promise.resolve([])
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

const Reminder = {start, stop, findReminder}

export default Reminder
