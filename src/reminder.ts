import Bot from './bot'
const db = require('./postgres')

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
    LEFT JOIN installations ON tasks.installation_id = installations.id`

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

const changeStatus = (task, status) => {

}

const addNewReminder = (task) => {

}


const Reminder = {start, stop, findReminder, changeStatus, addNewReminder}

export default Reminder
