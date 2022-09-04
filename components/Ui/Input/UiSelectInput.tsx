import { Error, Label, LookAndFeelProps, Wrapper } from '@/components/Ui/Input/UiInputField'
import { KitIcon } from '@pfadiolten/react-kit'
import { theme } from '@pfadiolten/react-kit'
import { noop } from '@/utils/fns'
import { InputProps } from '@daniel-va/react-form'
import React, { useCallback, useMemo } from 'react'
import Select from 'react-select'
import styled from 'styled-components'

interface Props<T, TOption, TMultiple extends boolean> extends InputProps<Value<T, TMultiple>>, LookAndFeelProps {
  options: TOption[]
  optionName: (option: TOption) => string
  optionValue: (option: TOption) => T
  hasMultiple?: TMultiple
}

const UiSelectInput = <T, TOption, TMultiple extends boolean = false>({
  value,
  onChange: pushChange = noop,
  errors,
  label,
  placeholder = '',
  options,
  optionName,
  optionValue,
  hasMultiple,
}: Props<T, TOption, TMultiple>): JSX.Element => {
  const selectOptions = useMemo(() => options.reduce((selectOptions, option) => {
    selectOptions.push({
      value: optionValue(option),
      label: optionName(option),
    })
    return selectOptions
  }, [] as SelectOption<T>[]), [options, optionName, optionValue])

  const selectedOption = useMemo(() => {
    if (Array.isArray(value)) {
      return value.map((it) => selectOptions.find((selectOption) => selectOption.value === it)!)
    }
    return selectOptions.find((selectOption) => selectOption.value === value)!
  }, [selectOptions, value])

  // The tag for the element wrapping all the components elements.
  const wrapperTag = label === null ? 'div' : 'label'

  const handleChange = useCallback((value: SelectOption<T> | SelectOption<T>[]) => {
    if (Array.isArray(value)) {
      pushChange(value.map((option) => option.value) as Value<T, TMultiple>)
    } else {
      pushChange(value.value as Value<T, TMultiple>)
    }
  }, [pushChange])

  return (
    <SelectWrapper as={wrapperTag}>
      {label && (
        <Label>{label}</Label>
      )}
      <Select
        isMulti={!!hasMultiple}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        options={selectOptions as any}
        value={selectedOption}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={handleChange as any}
        placeholder={placeholder}
        className="select"
        classNamePrefix="select"
        components={{
          ClearIndicator: ({ innerProps }) => {
            const { onMouseDown: pushMouseDown = noop, onTouchEnd: pushTouchEnd = noop } = innerProps
            const handleMouseDown: React.MouseEventHandler<HTMLDivElement> = useCallback((e) => {
              e.stopPropagation()
              pushMouseDown(e)
            }, [pushMouseDown])

            const handleTouchEnd: React.TouchEventHandler<HTMLDivElement> = useCallback((e) => {
              e.stopPropagation()
              pushTouchEnd(e)
            }, [pushTouchEnd])

            return (
              <span {...innerProps} onMouseDown={handleMouseDown} onTouchEnd={handleTouchEnd} className="select__indicator">
                <KitIcon.Cancel />
              </span>
            )
          },
          DropdownIndicator: ({ innerProps }) => {
            return (
              <span {...innerProps} className="select__indicator">
                <KitIcon.PullDown />
              </span>
            )
          },
        }}
      />
      {errors !== undefined && (
        <Error>
          &nbsp;
          {errors[0]}
        </Error>
      )}
    </SelectWrapper>
  )
}
export default UiSelectInput

type Value<T, TMultiple> = TMultiple extends true ? T[] : T

interface SelectOption<T> {
  value: T
  label: string
}

const SelectWrapper = styled(Wrapper)`
  .select {
    .select__control {
      border-radius: 0;
      font-family: ${theme.fonts.sans};
      font-size: 1rem;
      color: ${theme.colors.tertiary.contrast};
      background-color: ${theme.colors.tertiary};
      border: 1px solid ${theme.colors.tertiary.contrast};
      
      .select__value-container {
        padding: ${theme.spacing(1)};
        
        &.select__value-container--has-value {
          padding: calc(${theme.spacing(1)} - 5px);
        }
      }
      
      .select__input-container {
        margin: 0;
        padding: 0;
      }
      
      .select__indicator {
        padding: ${theme.spacing(1)};
        cursor: pointer;
        color: ${theme.colors.tertiary.contrast.a(0.5)};
        width: 36px;
        text-align: center;
        
        transition: ${theme.transitions.fade};
        transition-property: color;
        
        :hover {
          color: ${theme.colors.tertiary.contrast};
        }
      }
      
      .select__indicator-separator {
        background-color: ${theme.colors.tertiary.contrast.a(0.5)};
      }

      .select__multi-value {
        border: 1px solid ${theme.colors.tertiary.contrast};
        
        &, .select__multi-value__label {
          color: ${theme.colors.tertiary.contrast};
          background-color: ${theme.colors.tertiary};
        }
        
        .select__multi-value__remove {
          border-radius: 0;
          cursor: pointer;

          transition: ${theme.transitions.fade};
          transition-property: color, background-color;
          
          :hover {
            color: ${theme.colors.error.contrast};
            background-color: ${theme.colors.error};
          }
        }
      }
    }
  }
`
