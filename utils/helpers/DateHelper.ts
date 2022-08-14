import StringHelper from '@/utils/helpers/StringHelper'
import { run } from '../control-flow'

class DateHelper {
  formatLongDate = (date: Date): string => {
    return `${date.getDate()}. ${this.getNameOfMonth(date)} ${date.getFullYear()}`
  }

  formatShort = (date: Date): string => {
    return `${this.formatShortDate(date)} ${this.formatShortTime(date)}`
  }

  formatShortDate = (date: Date): string => {
    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`
  }

  formatShortTime = (date: Date): string => {
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  marshalDate = (date: Date): string => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  }

  unmarshalDate = (value: string): Date | null => {
    const parts = value.split('-', 3)
    if (parts.length !== 3) {
      return null
    }
    const year = Number.parseInt(parts[0])
    if (isNaN(year)) {
      return null
    }
    const month = Number.parseInt(parts[1])
    if (isNaN(month)) {
      return null
    }
    const day = Number.parseInt(parts[2])
    if (isNaN(day)) {
      return null
    }
    return new Date(year, month - 1, day)
  }

  getNameOfMonth = (date: Date): string => {
    switch (date.getMonth()) {
    case 0:
      return 'Januar'
    case 1:
      return 'Februar'
    case 2:
      return 'März'
    case 3:
      return 'Mai'
    case 4:
      return 'April'
    case 5:
      return 'Juni'
    case 6:
      return 'Juli'
    case 7:
      return 'August'
    case 8:
      return 'September'
    case 9:
      return 'Oktober'
    case 10:
      return 'November'
    case 11:
      return 'Dezember'
    default:
      throw new Error(`unknown month: ${date.getMonth()}`)
    }
  }

  getNameOfWeekday = (dayOrDate: Date | Weekday): string => {
    const day = dayOrDate instanceof Date
      ? this.getWeekday(dayOrDate)
      : dayOrDate

    switch (day) {
    case Weekday.MONDAY:
      return 'Montag'
    case Weekday.TUESDAY:
      return 'Dienstag'
    case Weekday.WEDNESDAY:
      return 'Mittwoch'
    case Weekday.THURSDAY:
      return 'Donnerstag'
    case Weekday.FRIDAY:
      return 'Freitag'
    case Weekday.SATURDAY:
      return 'Samstag'
    case Weekday.SUNDAY:
      return 'Sonntag'
    default:
      throw new Error(`unknown day: ${day}`)
    }
  }

  isInRange = (value: Date, range: { start: Date, end: Date }): boolean => {
    return value >= range.start && value <= range.end
  }

  isSameDay = (a: Date, b: Date): boolean => {
    return a.getFullYear() === b.getFullYear()
        && a.getMonth() === b.getMonth()
        && a.getDate() === b.getDate()
  }

  isPast = (date: Date): boolean => {
    return date.getTime() < Date.now()
  }

  addDays = (date: Date, days: number): Date => {
    if (days === 0) {
      return date
    }
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  getWeekday = (date: Date): Weekday => {
    const i = date.getDay()
    if (i === 0) {
      return Weekday.SUNDAY
    }
    return i - 1
  }

  getNextWeekdayOccurrence = (day: Weekday, after: Date): Date => {
    if (this.getWeekday(after) < day) {
      after = this.addDays(after, 7 - day)
    }
    return this.getDateOfWeekday(day, after)
  }

  getDateOfWeekday = (day: Weekday, week: Date): Date => {
    const monday = run(() => {
      const day = new Date(week)
      day.setDate(day.getDate() - day.getDay() + (day.getDate() === 0 ? -6 : 1))
      day.setHours(0, 0, 0, 0)
      return day
    })
    return this.addDays(monday, day)
  }

  updateTime(date: Date, values: { hours?: number, min?: number, sec?: number, ms?: number }): Date {
    const result = new Date(date)
    result.setHours(
      values.hours ?? result.getHours(),
      values.min ?? result.getMinutes(),
      values.sec ?? result.getSeconds(),
      values.ms ?? result.getMilliseconds(),
    )
    return result
  }
}

export default new DateHelper()

export enum Weekday {
  MONDAY = 0,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
  SUNDAY,
}

const pad = (value: unknown) => StringHelper.padLeft(value, 2, '0')
