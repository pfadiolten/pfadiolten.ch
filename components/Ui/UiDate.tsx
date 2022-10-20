import { KitClientOnly, LocalDateTime, LocalTime } from '@pfadiolten/react-kit'
import { LocalDate } from '@pfadiolten/react-kit'
import { run } from '@/utils/control-flow'
import DateHelper from '@/utils/helpers/DateHelper'
import { ElementProps } from '@/utils/props'
import React, { useMemo } from 'react'

interface Props extends ElementProps<HTMLSpanElement> {
  value: LocalDate | LocalTime | LocalDateTime | Date
  format: 'date' | { date: DateFormat } | 'time' | 'datetime'
}

type DateFormat = { year?: boolean, month?: 'long' | 'short' | boolean }

const UiDate: React.FC<Props> = ({
  value,
  format,
  ...props
}) => {
  const date = useMemo(() => {
    if (value instanceof Date) {
      return value
    }
    switch (format) {
    case 'date':
      return LocalDate.toDate(LocalDate.from(value))
    case 'time':
      return LocalDateTime.toDate(LocalDateTime.fromLocal(LocalDate.today, LocalTime.from(value)))
    case 'datetime':
      return LocalDateTime.toDate(LocalDateTime.from(value))
    default:
      throw new Error(`unknown format: ${format}`)
    }
  }, [format, value])
  const children = useMemo(() => {
    const hours = pad(date.getHours())
    const minutes = pad(date.getMinutes())

    const [formatName, dateFormat] = typeof format === 'object'
      ? [Object.keys(format)[0], format.date]
      : [format, {}]

    const formatDate = () => {
      const day = pad(date.getDate())
      const year = dateFormat.year !== false
        ? date.getFullYear()
        : null
      const month = run(() => {
        switch (dateFormat.month ?? true) {
        case 'long':
          return ` ${DateHelper.getNameOfMonth(date)}${year === null ? '' : ` ${year}`}`
        case 'short':
          return ` ${DateHelper.getNameOfMonth(date).slice(0, 3)}${year === null ? '' : ` ${year}`}`
        case true:
          return `${pad(date.getMonth())}${year === null ? '' : `.${year}`}`
        case false:
          return null
        }
      })
      let result = `${day}.`
      if (month !== null) {
        result += month
      }
      return result
    }

    switch (formatName) {
    case 'date':
      return formatDate()
    case 'time':
      return `${hours}:${minutes}`
    case 'datetime':
      return `${formatDate()} ${hours}:${minutes}`
    }
  }, [date, format])
  return (
    // Timezone differences between server and client may cause hydration errors,
    // so we render the dates only on the client side.
    <KitClientOnly>{() => (
      <span {...props}>
        {children}
      </span>
    )}</KitClientOnly>
  )
}
export default UiDate

const pad = (value: number): string => (
  value >= 10
    ? `${value}`
    : `0${value}`
)
