import UiInputField, { LookAndFeelProps } from '@/components/Ui/Input/UiInputField'
import { noop } from '@/utils/fns'
import { InputProps } from '@daniel-va/react-form'
import React, { ChangeEvent, useCallback, useMemo } from 'react'

interface Props extends InputProps<Date | null>, LookAndFeelProps {
}

const UiDateInput: React.FC<Props> = ({
  value,
  onChange: pushValue = noop,
  ...otherProps
}) => {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    pushValue(e.target.valueAsDate)
  }, [pushValue])

  const inputValue = useMemo(() => {
    if (value === null) {
      return ''
    }
    return (new Date(value.getTime() - value.getTimezoneOffset() * 60_000).toISOString()).slice(0, -1)
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
