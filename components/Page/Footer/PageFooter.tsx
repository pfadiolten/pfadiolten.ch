import { PageState } from '@/components/Page/Context/PageContext'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { KitGrid } from '@pfadiolten/react-kit'
import { KitIcon } from '@pfadiolten/react-kit'
import { KitContainer } from '@pfadiolten/react-kit'
import { theme } from '@pfadiolten/react-kit'
import React from 'react'
import styled, { css } from 'styled-components'

interface Props {
  state: PageState
}

const PageFooter: React.FC<Props> = ({ state }) => {
  return (
    <Footer noBackground={state.noBackground}>
      <KitContainer>
        <KitGrid>
          <KitGrid.Col>
            &copy; Pfadi Olten, {year}
          </KitGrid.Col>
          <KitGrid.Col size="auto">
            Source Code @&nbsp;
            <KitIcon icon={faGithub} />
          </KitGrid.Col>
        </KitGrid>
      </KitContainer>
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
