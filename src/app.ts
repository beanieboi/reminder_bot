import { resolve } from "path"
import { config } from "dotenv"
const { Client } = require('pg')

import Telegraf from "telegraf"

const client = new Client()


async function start() {
  await client.connect()

  config({ path: resolve(__dirname, "../.env") })

  const bot = new Telegraf(process.env.BOT_TOKEN)

  const res = await client.query('SELECT NOW() as message')
  console.log(res.rows[0].message)
  await client.end()


  bot.start((ctx) => ctx.reply('Welcome'))
  bot.hears('hi', (ctx) => ctx.reply('Hey there'))
  bot.launch()

}

start()