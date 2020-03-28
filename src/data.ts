const channel_id: number = 1234

enum Status {
  SNOOZED = 'snoozed',
  COMPLETED = 'completed',
  CANCELED = 'canceled'
}

interface Task {
  id: number,
  channel_id: number,
  text: string,
  start_time: number,
  interval_hours: number,
  skipable: boolean,
  snooze_default_minutes: number
}

interface Reminder {
  id: number,
  task_id: number,
  status: Status | null
}

const tasksData: Task[] = [
  {
    id: 1,
    channel_id: channel_id,
    text: "Time to take your meds",
    start_time: Date.now(),
    interval_hours: 12,
    skipable: false,
    snooze_default_minutes: 10
  },
  {
    id: 2,
    channel_id: channel_id,
    text: "Time to take water the plants",
    start_time: Date.now(),
    interval_hours: 24,
    skipable: true,
    snooze_default_minutes: 12
  }
]

const reminderData: Reminder[] = [
  {
    id: 1,
    task_id: tasksData[0].id,
    status: null
  },
  {
    id: 2,
    task_id: tasksData[1].id,
    status: null
  }
]

export {Status, tasksData, reminderData}
