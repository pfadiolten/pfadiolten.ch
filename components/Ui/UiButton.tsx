import { ColorName } from '@/theme'
import theme from '@/theme-utils'
import React, { ReactNode } from 'react'
import styled, { css } from 'styled-components'

interface Props {
  color?: ColorName
  isFull?: boolean
  isDisabled?: boolean
  children: ReactNode
  onClick?: (e: React.MouseEvent) => void
}

const UiButton: React.FC<Props> = ({
  color = 'primary',
  isDisabled,
  isFull = false,
  ...props
}) => {
  return (
    <Button
      {...props}
      type="button"
      color={color}
      isFull={isFull}
      disabled={isDisabled}
    />
  )
}
export default UiButton

const Button = styled.button<{ color: ColorName, isFull: boolean }>`
  font-family: ${theme.fonts.sans};
  font-size: 1em;
  color: ${theme.color.contrast};
  background-color: ${theme.color};
  padding: ${theme.spacing(1)};
  cursor: pointer;
  border: none;

  transition: ${theme.transitions.fade};
  transition-property: transform, filter, color, background-color, opacity;
  
  :active {
    filter: brightness(0.75);
  }

  :hover:not([disabled]):not(:active) {
    filter: brightness(0.9);
  }

  &[disabled] {
    cursor: not-allowed;
    color: rgb(0, 0, 0, 0.35);
    background: rgb(0, 0, 0, 0.12);
  }
  
  ${({ isFull }) => isFull && css`
    width: 100%;
  `}
`
