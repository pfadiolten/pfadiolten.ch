import StringHelper from '@/utils/helpers/StringHelper'

export default class LocalDate {
  private constructor(
    readonly days: number,
  ) {
    this.date = new Date(days * MILLIS_PER_DAY)
  }

  private readonly date: Date

  static from(year: number, month: number, day: number): LocalDate {
    const days = Math.floor(Date.UTC(year, month + 1, day) / MILLIS_PER_DAY)
    return new LocalDate(days)
  }

  static fromDays(value: number): LocalDate {
    return new LocalDate(value)
  }

  static fromDate(value: Date): LocalDate {
    return LocalDate.fromTimestamp(value.getTime())
  }

  static fromTimestamp(value: number): LocalDate {
    const days = Math.floor(value / MILLIS_PER_DAY)
    return new LocalDate(days)
  }

  next(): LocalDate {
    return new LocalDate(this.days + 1)
  }

  compareTo(other: LocalDate): number {
    return this.days - other.days
  }

  equals(other: LocalDate): boolean {
    return this.days === other.days
  }

  toDate(): Date {
    return new Date(this.date)
  }

  toTimestamp(): number {
    return this.date.getTime()
  }

  toString(): string {
    const year = this.date.getUTCFullYear()
    const month = this.date.getUTCMonth() + 1
    const day = this.date.getUTCDate()
    return `${year}-${StringHelper.pad2Zero(month)}-${StringHelper.pad2Zero(day)}`
  }
}

const MILLIS_PER_DAY = 1000 * 60 * 60 * 24
