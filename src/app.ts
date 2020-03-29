const { Client } = require('pg')
import Bot from './bot'
import Logger from './logger'
import reminder from './reminder'

async function start() {
  const client = new Client()
  await client.connect()

  const res = await client.query('SELECT NOW() as message')
  Logger.debug(res.rows[0].message)
  await client.end()

  try {
    await Bot.launch()
    Bot.sendMessage("I just hatched! hello world!")
    reminder.start()
  } catch (error) {
    reminder.stop()
    Logger.error(error)
  }
}

start()
