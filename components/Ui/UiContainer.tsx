import theme from '@/theme-utils'
import { ReactNode } from 'react'
import styled, { css } from 'styled-components'

interface Props {
  isFluid?: boolean
  children?: ReactNode
}

const UiContainer = styled.div<Props>`
  width: 100%;
  margin-inline: auto;
  ${({ isFluid }) => !isFluid && css`
    padding: 0 0.5rem;
    ${theme.media.sm.min} {
      max-width: ${theme.breakpoints.sm.min};
    }
    ${theme.media.md.min} {
      max-width: ${theme.breakpoints.md.min};
    }
    ${theme.media.lg.min} {
      padding: 0 4rem;
      max-width: ${theme.breakpoints.lg.min};
    }
    ${theme.media.xl.min} {
      max-width: ${theme.breakpoints.xl.min};
    }
  `}
`
export default UiContainer
