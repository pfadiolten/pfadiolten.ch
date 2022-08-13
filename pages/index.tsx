import Page from '@/components/Page/Page'
import UiButton from '@/components/Ui/UiButton'
import UiDrawer from '@/components/Ui/UiDrawer'
import UiTitle from '@/components/Ui/UiTitle'
import logo from '@/public/logo/pfadi_olten-textless.svg'
import theme from '@/theme-utils'
import { NextPage } from 'next'
import Image from 'next/image'
import { useState } from 'react'
import styled from 'styled-components'

const Home: NextPage = () => {
  const [isNoticeFormOpen, setNoticeFormOpen] = useState(false)

  return (
    <Page title="Home" noBackground>
      <Background>
        <Image src="/images/front.png" alt="" layout="fill" objectFit="cover" quality={100} priority />
        <BackgroundOverlay />
      </Background>
      <Content>
        <HeadingArticle>
          <Image src={logo} alt="Logo der Pfadi Olten" width={128} height={128} />
          <UiTitle level={1}>
            Willkommen bei der <span>Pfadi Olten!</span>
          </UiTitle>
          <Subtitle>
            Hier entsteht unsere neue Homepage.
          </Subtitle>
          <MainText>
            Während wir uns noch im Aufbau befinden, werden die Funktionen der Website stark eingeschränkt sein.
            <br />
            Die nächsten Aktivitäten werden aber wie immer hier zu finden sein!.
          </MainText>
        </HeadingArticle>

        <UiButton onClick={() => setNoticeFormOpen(!isNoticeFormOpen)}>Open Form!</UiButton>

        <UiDrawer size="auto" isOpen={isNoticeFormOpen} onClose={() => setNoticeFormOpen(false)}>
          Hello!
        </UiDrawer>
      </Content>
    </Page>
  )
}
export default Home

const Background = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;

  overflow: hidden;

  img {
    filter: grayscale(90%);
    z-index: -1;
  }
`
const BackgroundOverlay = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;

  background-color: ${theme.colors.primary};
  opacity: 0.6;

  z-index: -1;
`
const Content = styled.div`
  position: relative;
  color: ${theme.colors.secondary.contrast};
  background-color: ${theme.colors.secondary};
  z-index: 5;
  padding: ${theme.spacing(4)};
  min-height: calc(100vh - ${theme.spacing(16)});
  margin-top: ${theme.spacing(-8)};
`
const HeadingArticle = styled.article`
  margin-bottom: ${theme.spacing(2)};
  text-align: center;
`
const Subtitle = styled.em`
  display: block;
  font-family: ${theme.fonts.serif};
  font-size: 1.5rem;
  margin-top: ${theme.spacing(-1)};
`
const MainText = styled.p`
  font-family: ${theme.fonts.serif};
  margin-top: ${theme.spacing(0.5)};
`
