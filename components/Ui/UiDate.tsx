import UiClientOnly from '@/components/Ui/UiClientOnly'
import LocalDate from '@/models/base/LocalDate'
import { run } from '@/utils/control-flow'
import React, { useMemo } from 'react'

interface Props {
  value: LocalDate | Date
  format: 'date' | 'time' | 'datetime'
}

const UiDate: React.FC<Props> = ({ value, format }) => {
  const date = useMemo(() => (
    value instanceof Date
      ? value
      : value.toDate()
  ), [value])
  return useMemo(() => {
    const day = pad(date.getDate())
    const month = pad(date.getMonth())
    const hours = pad(date.getHours())
    const minutes = pad(date.getMinutes())

    const children = run(() => {
      switch (format) {
      case 'date':
        return `${day}.${month}.${date.getFullYear()}`
      case 'time':
        return `${hours}:${minutes}`
      case 'datetime':
        return `${day}.${month}.${date.getFullYear()} ${hours}:${minutes}`
      }
    })
    return (
      // Timezone differences between server and client may cause hydration errors,
      // so we render the dates only on the client side.
      <UiClientOnly>{() => (
        <span>
          {children}
        </span>
      )}</UiClientOnly>
    )
  }, [date, format])
}
export default UiDate

const pad = (value: number): string => (
  value >= 10
    ? `${value}`
    : `0${value}`
)
