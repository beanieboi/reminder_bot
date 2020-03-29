import moment, { Moment } from 'moment'

const channel_id: number = 1234

export enum Status {
  SNOOZED = 'snoozed',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
  OPEN = "open"
}

export interface Task {
  id: number,
  channel_id: number,
  text: string,
  start_time: number,
  interval_hours: number,
  skipable: boolean,
  snooze_default_minutes: number
}

export interface Reminder {
  id: number,
  task: Task,
  status: Status
}

const tasksData: Task[] = [
  {
    id: 1,
    channel_id: channel_id,
    text: "Time to take your meds",
    start_time: moment().subtract(10, 'm').valueOf(),
    interval_hours: 12,
    skipable: false,
    snooze_default_minutes: 10
  },
  {
    id: 2,
    channel_id: channel_id,
    text: "Time to take water the plants",
    start_time: moment().add(7, 'd').valueOf(),
    interval_hours: 24,
    skipable: true,
    snooze_default_minutes: 12
  }
]

const reminderData: Reminder[] = [
  {
    id: 1,
    task: tasksData[0],
    status: Status.OPEN
  },
  {
    id: 2,
    task: tasksData[1],
    status: Status.OPEN
  }
]

export {tasksData, reminderData}
