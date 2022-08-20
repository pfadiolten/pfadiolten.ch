import theme from '@/theme-utils'
import React, { ReactNode, useRef } from 'react'
import { useEffectOnce, useIsomorphicLayoutEffect } from 'react-use'
import styled, { css } from 'styled-components'

interface Props {
  isOpen: boolean
  children: ReactNode
}

const UiScreenOverlay: React.FC<Props> = ({ isOpen, children }) => {
  const elementRef = useRef<HTMLDivElement | null>(null)
  useEffectOnce(() => {
    const { current: element } = elementRef
    if (element === null) {
      return
    }
    if (!isOpen) {
      element.style.zIndex = '-1'
      element.style.opacity = '0'
    }
  })
  useIsomorphicLayoutEffect(() => {
    const { current: element } = elementRef
    if (element === null) {
      return
    }

    if (isOpen) {
      element.style.zIndex = ''
      element.style.opacity = ''
    } else {
      setTimeout(() => {
        element.style.zIndex = '-1'
        element.style.opacity = '0'
      })
    }
  }, [isOpen])

  return (
    <Box ref={elementRef} isOpen={isOpen} children={children} />
  )
}
export default UiScreenOverlay

const Box = styled.div<Props>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;

  display: flex;
  justify-content: center;
  align-items: center;
  
  background: rgba(25, 25, 25, 0.4);
  transition: ${theme.transitions.slideIn};
  transition-property: background-color, opacity, display;

  ${({ isOpen }) => !isOpen && css`
    transition: ${theme.transitions.slideOut};
    background: transparent;
  `}
`

