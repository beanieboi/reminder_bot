import moment from 'moment'
import { Status } from './../src/data'

const reminder = {
  id: 1,
  task: {
    id: 1,
    channel_id: 123,
    text: "Example text",
    start_time: moment().unix(),
    interval_hours: 24,
    skipable: true,
    snooze_default_minutes: 12
  },
  status: Status.OPEN
}

const reminderFactory = (properties: object) => {
  return Object.assign({}, reminder, properties)
}

export default reminderFactory
