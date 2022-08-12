import { PageState } from '@/components/Page/Context/PageContext'
import UiGrid from '@/components/Ui/UiGrid'
import UiIcon from '@/components/Ui/UiIcon'
import UiContainer from '@/components/Ui/UiContainer'
import theme from '@/theme-utils'
import React from 'react'
import styled, { css } from 'styled-components'

interface Props {
  state: PageState
}

const PageFooter: React.FC<Props> = ({ state }) => {
  return (
    <Footer noBackground={state.noBackground}>
      <UiContainer>
        <UiGrid>
          <UiGrid.Col>
            &copy; Pfadi Olten, {year}
          </UiGrid.Col>
          <UiGrid.Col size="auto">
            Source Code @&nbsp;
            <UiIcon name="logoGithub" />
          </UiGrid.Col>
        </UiGrid>
      </UiContainer>
    </Footer>
  )
}
export default PageFooter

const year = new Date().getFullYear()

const Footer = styled.footer<{ noBackground: boolean }>`
  position: absolute;
  width: 100vw;
  overflow: hidden;
  bottom: 0;
  padding-block: 2rem;

  color: ${theme.colors.secondary.contrast.a(0.6)};
  ${({ noBackground }) => noBackground && css`
    color: ${theme.colors.primary.contrast.a(0.6)};
  `}
`
