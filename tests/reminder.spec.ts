import moment from 'moment'
import Reminder from './../src/reminder'
import reminderFactory from './reminderFactory'
import {Reminder as ReminderType, Status} from './../src/data'

describe('FindReminder', function() {
  it('returns empty array if no reminder was found', function() {
    const foundReminder = Reminder.findReminder([])
    expect(foundReminder).toEqual([]);
  });

  it('returns reminders', function() {
    const reminderData: ReminderType[] = [
      reminderFactory({
        start_time: moment().add(7, 'd').valueOf(),
        status: Status.OPEN,
      }),
      reminderFactory({
        start_time: moment().subtract(2, 'm').valueOf(),
        status: Status.OPEN,
      }),
      reminderFactory({
        start_time: moment().subtract(1, 'd').valueOf(),
        status: Status.COMPLETED
      })
    ]
    const foundReminder = Reminder.findReminder(reminderData)
    expect(foundReminder).toContain(reminderData[1]);
  });
});
