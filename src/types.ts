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
