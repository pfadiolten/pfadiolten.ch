import Page from '@/components/Page/Page'
import UiButton from '@/components/Ui/UiButton'
import UiContainer from '@/components/Ui/UiContainer'
import UiTitle from '@/components/Ui/UiTitle'
import useUser from '@/hooks/useUser'
import theme from '@/theme-utils'
import { NextPage } from 'next'
import { signIn, signOut } from 'next-auth/react'
import Image from 'next/image'
import styled from 'styled-components'
import logo from '@/public/logo/pfadi_olten-textless.svg'

const Home: NextPage = () => {
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
  color: ${theme.colors.primary.contrast};
  z-index: 5;
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
