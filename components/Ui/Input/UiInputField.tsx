import theme from '@/theme-utils'
import React, { ChangeEvent, useEffect, useRef } from 'react'
import styled, { css } from 'styled-components'

interface Props extends MappedInputProps, LookAndFeelProps, BehaviourProps {}

/**
 * Properties which look like {@link InputProps}, but are actually usable by native `input` elements.
 */
interface MappedInputProps {
  value: string | number | null | undefined
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  errors?: string[]
}

/**
 * Properties which affect the look and feel of a {@link UiInputField}.
 */
export interface LookAndFeelProps {
  label?: string
  placeholder?: string
  isDisabled?: boolean
  hasAutoFocus?: boolean
}

/**
 * Properties which affect the general behaviour of a {@link UiInputField}.
 */
export interface BehaviourProps {
  type: string
}

const UiInputField: React.FC<Props> = ({
  value,
  onChange: handleChange,
  errors,
  label = null,
  placeholder,
  type = 'text',
  isDisabled = false,
  hasAutoFocus = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  // The tag for the element wrapping all the components elements.
  const wrapperTag = label === null ? 'div' : 'label'

  // "Lazy" autofocus.
  useEffect(function takeFocus() {
    const { current: input } = inputRef
    if (hasAutoFocus) {
      input?.focus()
    }
  }, [hasAutoFocus])

  return (
    <Wrapper as={wrapperTag}>
      {label && (
        <Label>{label}</Label>
      )}
      <Input
        ref={inputRef}
        type={type}
        placeholder={placeholder}
        value={value ?? undefined}
        onChange={handleChange}
        disabled={isDisabled}
        autoFocus={hasAutoFocus}
        isInvalid={errors !== undefined && errors.length !== 0}
      />
      {errors !== undefined && (
        <Error>
          &nbsp;
          {errors[0]}
        </Error>
      )}
    </Wrapper>
  )
}
export default UiInputField

export const Wrapper = styled.div`
  display: block;
`

const Input = styled.input<{ isInvalid: boolean }>`
  width: 100%;
  padding: ${theme.spacing(1)};
  font-family: ${theme.fonts.sans};
  font-size: 1rem;
  color: ${theme.colors.tertiary.contrast};
  background-color: ${theme.colors.tertiary};
  outline: none;
  border: 1px solid ${theme.colors.tertiary.contrast};
  
  transition: ${theme.transitions.fade};
  transition-property: border-color;
  
  :active, :focus {
    border-color: ${theme.colors.primary};
  }
  ${({ isInvalid }) => isInvalid && css`
    border-color: ${theme.colors.error};
  `}
`

export const Label = styled.span`
  display: block;
  font-size: 0.9em;
  font-weight: bold;
`

export const Error = styled.div`
  min-height: 0.75em;
  font-size: 0.75em;
  width: 100%;
  text-align: end;
  color: ${theme.colors.error};
`
