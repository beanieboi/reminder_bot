interface Task {
  id: number,
  text: string,
  start_time: number,
  interval_hours: number,
  skipable: boolean,
  snooze_default_minutes: number
}

const tasks: Task[] = [
  {
    id: 1,
    text: "Time to take your meds",
    start_time: Date.now(),
    interval_hours: 12,
    skipable: false,
    snooze_default_minutes: 10
  },
  {
    id: 2,
    text: "Time to take water the plants",
    start_time: Date.now(),
    interval_hours: 24,
    skipable: true,
    snooze_default_minutes: 12
  }
]
