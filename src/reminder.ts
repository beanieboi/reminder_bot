import moment from 'moment'
import Bot from './bot'
import { reminderData, Reminder, Task, Status } from './data'

const intervalInMs = 60000
let intervalId: NodeJS.Timeout

const isPastTask = (task: Task) => {
  return moment().isAfter(task.start_time, 'minute')
}

const isOpenReminder = (reminder: Reminder) => {
  return reminder.status === Status.OPEN
}

const findReminder = (reminders: Reminder[]) => {
  return reminders.filter((reminder) => {
    return isOpenReminder(reminder) && isPastTask(reminder.task)
  })
}

const messageAboutReminder = (reminders: Reminder[]) => {
  const notifyReminder = findReminder(reminders)
  notifyReminder.forEach((reminder) => {
    Bot.sendMessage(`${reminder.task.text} at ${moment(reminder.task.start_time).format("dddd, MMMM Do YYYY, H:mm")}`)
  })
}

const start = async () => {
  intervalId = setInterval(() => {
    messageAboutReminder(reminderData)
  }, intervalInMs)
}

const stop = () => {
  clearInterval(intervalId)
}

const Reminder = {start, stop, findReminder}

export default Reminder
