import UiInputField, { LookAndFeelProps } from '@/components/Ui/Input/UiInputField'
import { noop } from '@/utils/fns'
import { InputProps } from '@daniel-va/react-form'
import React, { ChangeEvent, useCallback } from 'react'

interface Props<T extends string | null> extends InputProps<T>, LookAndFeelProps {
  type?: 'text' | 'password'
}

type NullProps<T extends string | null> = null extends Extract<T, null>
  ? { allowNull: true }
  : { allowNull?: false }

const UiTextInput = <T extends string | null>({
  value,
  onChange: pushValue = noop,
  type = 'text',
  allowNull = false,
  ...otherProps
}: Props<T> & NullProps<T>) => {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    const newValueOrNull = newValue.length === 0
      ? (allowNull ? null : '')
      : newValue
    pushValue(newValueOrNull as T)
  }, [pushValue, allowNull])

  return (
    <UiInputField
      {...otherProps}
      value={value ?? ''}
      type={type}
      onChange={handleChange}
    />
  )
}
export default UiTextInput
