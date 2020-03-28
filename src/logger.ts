import { resolve } from "path"
import { config } from "dotenv"
import consola from 'consola'

config({ path: resolve(__dirname, "../.env") })

const logLevel = process.env.LOG_LEVEL ? Number(process.env.LOG_LEVEL) : Infinity
const Logger = consola.create({level:logLevel})

export default Logger
