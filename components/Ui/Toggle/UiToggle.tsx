import { ColorName } from '@/theme'
import theme from '@/theme-utils'
import * as React from 'react'
import { useCallback } from 'react'
import styled, { css } from 'styled-components'

interface Props {
  value: boolean
  color?: ColorName
  isDisabled?: boolean
  onChange: (value: boolean) => void
}

const UiToggle: React.FC<Props> = ({
  value,
  color = 'success',
  isDisabled = false,
  onChange: pushChange,
}) => {
  const handleToggle = useCallback(() => {
    pushChange(!value)
  }, [pushChange, value])

  const handleKeyPress: React.KeyboardEventHandler = useCallback((e) => {
    if (e.code === 'Space') {
      handleToggle()
    }
  }, [handleToggle])

  return (
    <Box
      role="checkbox"
      aria-checked={value}
      aria-disabled={isDisabled ? true : undefined}
      tabIndex={0}
      color={color}
      isActive={value}
      onClick={handleToggle}
      onKeyDown={handleKeyPress}
    >
      <Slider color={color} isActive={value} />
    </Box>
  )
}
export default UiToggle

const Box = styled.div<{ color: ColorName, isActive: boolean }>`
  --height: calc(1rem + ${theme.spacing(1)});
  --offset: 2px;

  display: inline-block;
  position: relative;
  background-color: ${theme.color};

  height: var(--height);
  width: ${theme.spacing(5)};
  border-radius: calc(var(--height) * 1.33);
  padding: var(--offset);

  transition: ${theme.transitions.fade};
  transition-property: color, background-color;
  cursor: pointer;

  &[aria-disabled] {
    cursor: not-allowed;
    background-color: rgb(0, 0, 0, 0.12);
  }

  ${({ isActive }) => !isActive && css`
    background-color: rgb(0, 0, 0, 0.25);
  `}
`
const Slider = styled.div<{ color: ColorName, isActive: boolean }>`
  --size: calc(var(--height) - var(--offset) * 2);
  background-color: ${theme.color.contrast};
  width: var(--size);
  height: var(--size);
  border-radius: 100%;

  transition: ${theme.transitions.slideIn};
  transition-property: transform;

  ${({ isActive }) => isActive && css`
    transform: translateX(calc(100% - var(--offset) * 2));
  `}
`
