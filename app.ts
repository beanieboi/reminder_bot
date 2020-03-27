import { resolve } from "path"
import { config } from "dotenv"

import Telegraf from "telegraf"

config({ path: resolve(__dirname, "../.env") })

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply('Welcome'))
bot.hears('hi', (ctx) => ctx.reply('Hey there'))
bot.launch()
