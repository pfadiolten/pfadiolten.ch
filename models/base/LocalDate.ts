import StringHelper from '@/utils/helpers/StringHelper'

type LocalDate = number

const LocalDate = {
  from(year: number, month: number, day: number): LocalDate {
    return Math.floor(Date.UTC(year, month - 1, day) / MILLIS_PER_DAY)
  },
  fromDate(value: Date): LocalDate {
    return LocalDate.fromTimestamp(value.getTime())
  },
  fromTimestamp(value: number): LocalDate {
    return Math.floor(value / MILLIS_PER_DAY)
  },
  toDate(date: LocalDate): Date {
    return new Date(date * MILLIS_PER_DAY)
  },
  toString(date: LocalDate): string {
    const value = LocalDate.toDate(date)
    const year = value.getUTCFullYear()
    const month = value.getUTCMonth() + 1
    const day = value.getUTCDate()
    return `${year}-${StringHelper.pad2Zero(month)}-${StringHelper.pad2Zero(day)}`
  },
}

export default LocalDate

const MILLIS_PER_DAY = 1000 * 60 * 60 * 24
