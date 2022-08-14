import NoticeForm from '@/components/Notice/NoticeForm'
import Page from '@/components/Page/Page'
import UiDrawer from '@/components/Ui/UiDrawer'
import UiButton from '@/components/Ui/UiButton'
import UiTitle from '@/components/Ui/UiTitle'
import useUser from '@/hooks/useUser'
import Notice from '@/models/Notice'
import logo from '@/public/logo/pfadi_olten-textless.svg'
import FetchService from '@/services/FetchService'
import theme from '@/theme-utils'
import { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image'
import { useState } from 'react'
import styled from 'styled-components'

interface Props {
  notices: Notice[]
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const [notices, error] = await FetchService.get<Notice[]>('notices')
  if (error !== null) {
    throw error
  }
  return {
    props: {
      notices,
    },
  }
}

const Home: NextPage<Props> = ({ notices: noticesData }) => {
  const [isNoticeFormOpen, setNoticeFormOpen] = useState(false)

  const [notices, setNotices] = useState(noticesData)

  const user = useUser()
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

        {JSON.stringify(notices)}

        {user !== null && (
          <>
            <UiButton onClick={() => setNoticeFormOpen(!isNoticeFormOpen)}>Open Form!</UiButton>

            <UiDrawer size="auto" isOpen={isNoticeFormOpen} onClose={() => setNoticeFormOpen(false)}>
              <UiTitle level={2}>
                Neue Aktivität erfassen
              </UiTitle>
              <NoticeForm onSave={(notice) => setNotices((notices) => [...notices, notice])} onClose={() => setNoticeFormOpen(false)} />
            </UiDrawer>
          </>
        )}
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
