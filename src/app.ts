const { Client } = require('pg')
import Bot from './bot'
import logger from './logger'

async function start() {
  const client = new Client()
  await client.connect()

  const res = await client.query('SELECT NOW() as message')
  logger.debug(res.rows[0].message)
  await client.end()

  try {
    await Bot.launch()
    // Bot.sendMessage("good morning")
  } catch (error) {
    logger.error(error)
  }
}

start()
