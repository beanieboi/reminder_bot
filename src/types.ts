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
  interval_minutes: number,
  due_at: number,
  skipable: boolean,
  snooze_default_minutes: number,
  keyword: string
}

export interface Reminder {
  id: number,
  task: Task,
  status: Status
}
