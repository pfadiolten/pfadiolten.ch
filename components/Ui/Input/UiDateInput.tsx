import UiInputField, { LookAndFeelProps } from '@/components/Ui/Input/UiInputField'
import { noop } from '@/utils/fns'
import { InputProps } from '@daniel-va/react-form'
import { LocalDateTime } from '@pfadiolten/react-kit'
import React, { ChangeEvent, useCallback, useMemo } from 'react'

interface Props extends InputProps<LocalDateTime | null>, LookAndFeelProps {
}

const UiDateInput: React.FC<Props> = ({
  value,
  onChange: pushValue = noop,
  ...otherProps
}) => {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const date = e.target.valueAsDate
    pushValue(date === null ? null : LocalDateTime.fromDate(date))
  }, [pushValue])

  const inputValue = useMemo(() => {
    if (value === null) {
      return ''
    }
    const date = LocalDateTime.toDate(value)
    return (new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString()).slice(0, -1)
  }, [value])

  return (
    <UiInputField
      {...otherProps}
      value={inputValue}
      type="datetime-local"
      onChange={handleChange}
    />
  )
}
export default UiDateInput
