import UiClientOnly from '@/components/Ui/UiClientOnly'
import UiContainer from '@/components/Ui/UiContainer'
import UiScreenOverlay from '@/components/Ui/UiScreenOverlay'
import useLockedBody from '@/hooks/useLockedBody'
import theme from '@/theme-utils'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { useClickAway, useUpdateEffect } from 'react-use'
import styled, { css, useTheme } from 'styled-components'

interface Props {
  isOpen: boolean
  size?: Size
  position?: Position
  children: ReactNode
  onClose: () => void
}

const UiDrawer: React.FC<Props> = ({ isOpen, size = 'auto', position = 'left', children, onClose: pushClose }) => {
  const elementRef = useRef<HTMLDivElement | null>(null)
  useClickAway(elementRef, (e) => {
    pushClose()
  })

  const [_isLockedBody, setLockedBody] = useLockedBody()
  useEffect(() => {
    setLockedBody(isOpen)
  }, [setLockedBody, isOpen])

  const [isHidden, setHidden] = useState(!isOpen)
  const theme = useTheme()
  useUpdateEffect(() => {
    if (isOpen) {
      setHidden(false)
    } else {
      setTimeout(() => {
        setHidden(true)
      }, theme.transitions.slideOut.duration)
    }
  }, [isOpen])

  return (
    <UiScreenOverlay isOpen={isOpen}>
      <UiClientOnly>{() => (
        ReactDOM.createPortal((
          <Box ref={elementRef} role="dialog" isOpen={isOpen} size={size} position={position}>
            <UiContainer>
              {(isOpen || !isHidden) && children}
            </UiContainer>
          </Box>
        ), document.body)
      )}</UiClientOnly>
    </UiScreenOverlay>
  )
}
export default UiDrawer

export type Size = 'auto' | 'full'
export type Position = 'left' | 'right'

const Box = styled.aside<{ isOpen: boolean, size: Size, position: Position }>`
  position: fixed;
  ${({ position }) => position}: 0;
  width: ${({ size }) => size === 'auto' ? 'auto' : '100%'};
  height: 100vh;
  padding-top: 3rem;
  padding-bottom: 5rem;
  overflow-y: auto;
  top: 0;
  z-index: 100;

  background: ${theme.colors.secondary};
  color: ${theme.colors.secondary.contrast};
  
  box-shadow:
    0 8px 17px 2px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12),
    5px 5px -3px rgba(0, 0, 0, 0.2);
  
  ${theme.media.xs.only} {
    max-width: 100%;
    width: 100%;
    height: calc(100vh - ${theme.spacing(4)});
    top: unset;
    bottom: 0;
  }
  ${theme.media.sm.min} {
    --breakpoint-min: ${({ theme }) => theme.breakpoints.sm.min}px;
    max-width: calc(var(--breakpoint-min) - 2.5rem);
  }
  ${theme.media.md.min} {
    --breakpoint-min: ${({ theme }) => theme.breakpoints.md.min}px;
  }
  ${theme.media.lg.min} {
    --breakpoint-min: ${({ theme }) => theme.breakpoints.lg.min}px;
  }
  ${theme.media.xl.min} {
    --breakpoint-min: ${({ theme }) => theme.breakpoints.xl.min}px;
  }

  transition: ${theme.transitions.slideIn};
  transition-property: transform;
  ${({ isOpen, position }) => !isOpen && css`
    transition: ${theme.transitions.slideOut};
    transform: translateX(${position === 'left' ? 'calc(-100% - 20px)' : 'calc(100% + 20px)'});
    ${theme.media.xs.only} {
      transform: translateY(calc(100% + 20px));
    }
  `}
`
