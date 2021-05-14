import { config } from "dotenv"
import { resolve } from "path"
import Discord, { TextChannel } from "discord.js"
import Handler from './handler'
import Logger from "./logger"

if (process.env.DYNO == undefined) {
  config({ path: resolve(__dirname, "../.env") })
}

const client = new Discord.Client();
client.on('message', Handler.handleResponse)

const sendMessage = async (chatId: number, message: string) => {
  try {
    const channel = await client.channels.fetch(chatId.toString()) as TextChannel
    channel.send(message)
  } catch (error) {
    Logger.error(error)
  }
}

// uses env var DISCORD_TOKEN by default
const launch = client.login

const Bot = {launch, sendMessage}

export default Bot
