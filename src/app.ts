import Bot from './bot'
import Logger from './logger'
import reminder from './reminder'

async function start() {
  try {
    await Bot.launch()
    reminder.start()
  } catch (error) {
    reminder.stop()
    Bot.destroy();
    Logger.error(error)
  }
}

start()
