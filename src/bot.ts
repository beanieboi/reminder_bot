import { config } from "dotenv"
import { resolve } from "path"
import Discord, { TextChannel } from "discord.js"

if (process.env.DYNO == undefined) {
  config({ path: resolve(__dirname, "../.env") })
}

import Handler from './handler'

const client = new Discord.Client();

const launch = async () => {
  client.on('message', (message) => { Handler.handleResponse(client.user.id, message) })

  // uses env var DISCORD_TOKEN by default
  return client.login()
}

const sendMessage = async (chatId: number, message: string) => {
  const channel = await client.channels.fetch(chatId.toString()) as TextChannel
  channel.send(message)
}

const Bot = {launch, sendMessage}

export default Bot
