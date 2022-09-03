import UiInputField, { LookAndFeelProps } from '@/components/Ui/Input/UiInputField'
import LocalDate from '@/models/base/LocalDate'
import { noop } from '@/utils/fns'
import { InputProps } from '@daniel-va/react-form'
import React, { ChangeEvent, useCallback, useMemo } from 'react'

interface Props extends InputProps<LocalDate | null>, LookAndFeelProps {
}

const UiLocalDateInput: React.FC<Props> = ({
  value,
  onChange: pushValue = noop,
  ...otherProps
}) => {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const date = e.target.valueAsDate
    pushValue(date && LocalDate.fromDate(date))
  }, [pushValue])

  const inputValue = useMemo(() => value === null ? '' : LocalDate.toString(value), [value])

  return (
    <UiInputField
      {...otherProps}
      value={inputValue}
      type="date"
      onChange={handleChange}
    />
  )
}
export default UiLocalDateInput
