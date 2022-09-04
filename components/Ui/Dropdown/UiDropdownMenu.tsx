import UiDropdownContext from '@/components/Ui/Dropdown/UiDropdownContext'
import { ColorName, theme } from '@pfadiolten/react-kit'
import { labelFrom, LabelledProps } from '@/utils/props'
import React, { ReactNode, useContext, useRef } from 'react'
import { useEffectOnce, useIsomorphicLayoutEffect } from 'react-use'
import styled, { css, useTheme } from 'styled-components'

interface Props extends LabelledProps {
  color?: ColorName
  children: ReactNode
}

const UiDropdownMenu: React.FC<Props> = ({
  color = 'secondary',
  label,
  children,
}) => {
  const elementRef = useRef<HTMLUListElement | null>(null)
  const context = useContext(UiDropdownContext)

  const theme = useTheme()
  useEffectOnce(() => {
    const { current: element } = elementRef
    if (element === null) {
      return
    }
    if (!context.isOpen) {
      element.style.zIndex = '-1'
      element.style.opacity = '0'
    }
  })
  useIsomorphicLayoutEffect(() => {
    const { current: element } = elementRef
    if (element === null) {
      return
    }

    if (context.isOpen) {
      element.style.zIndex = ''
      element.style.opacity = ''
    } else {
      setTimeout(() => {
        element.style.zIndex = '-1'
        element.style.opacity = '0'
      }, theme.transitions.slideOut.duration)
    }
  }, [context.isOpen])

  return (
    <Box {...labelFrom(label)} isOpen={context.isOpen} color={color} role="menu">
      {children}
    </Box>
  )
}
export default UiDropdownMenu

const Box = styled.ul<{ isOpen: boolean, color: ColorName }>`
  --color: ${theme.color.contrast};
  --background-color: ${theme.color};
  box-shadow:
      0 8px 17px 2px rgba(0, 0, 0, 0.14),
      0 3px 14px 2px rgba(0, 0, 0, 0.12),
      0 5px 5px -3px rgba(0, 0, 0, 0.2);
  
  position: absolute;
  top: calc(100% + ${theme.spacing(0.5)});
  left: 50%;
  z-index: 50;
  transform: translateX(-50%);
  transform-origin: top center;
  transition: ${theme.transitions.slideIn};
  transition-property: transform, opacity;

  ${({ isOpen }) => !isOpen && css`
    transition: ${theme.transitions.slideOut};
    transform: translateX(-50%) scaleY(0);
  `}
  
  border: 1px solid var(--color);
`
