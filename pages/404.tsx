import Page from '@/components/Page/Page'
import UiTitle from '@/components/Ui/UiTitle'
import theme from '@/theme-utils'
import { NextPage } from 'next'
import styled from 'styled-components'

const NotFound: NextPage = () => {
  return (
    <Page title="404">
      <Center>
        <UiTitle level={1}>
          404
        </UiTitle>
        <Subtitle>
          Diesen Pfad haben wir noch nicht gefunden.
        </Subtitle>
      </Center>
    </Page>
  )
}
export default NotFound

const Center = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(var(--main-height) - ${theme.spacing(32)});
  
  ${UiTitle} {
    font-size: ${theme.spacing(16)};
    line-height: ${theme.spacing(16)};
  }
`
const Subtitle = styled.em`
  font-family: ${theme.fonts.serif};
  font-size: 1.5rem;
`
