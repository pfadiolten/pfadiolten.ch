import NoticeCard from '@/components/Notice/NoticeCard'
import NoticeCardList from '@/components/Notice/NoticeCardList'
import NoticeForm from '@/components/Notice/NoticeForm'
import Page from '@/components/Page/Page'
import UiButton from '@/components/Ui/Button/UiButton'
import UiDrawer from '@/components/Ui/UiDrawer'
import UiIcon from '@/components/Ui/UiIcon'
import UiTitle from '@/components/Ui/UiTitle'
import useCurrentUser from '@/hooks/useCurrentUser'
import useSsrEffect from '@/hooks/useSsrEffect'
import Notice from '@/models/Notice'
import User from '@/models/User'
import logo from '@/public/logo/pfadi_olten-textless.svg'
import NoticeRepo from '@/repos/NoticeRepo'
import UserRepo from '@/repos/UserRepo'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { saveNotices, selectActiveNotices } from '@/store/notices/notices.slice'
import { saveUsers } from '@/store/users/users.slice'
import theme from '@/theme-utils'
import { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image'
import { useState } from 'react'
import { batch } from 'react-redux'
import styled from 'styled-components'

interface Props {
  data: {
    notices: Notice[]
    users: User[]
  }
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const notices = await NoticeRepo.list()
  const users = await UserRepo.list()
  return {
    props: {
      data: {
        notices,
        users,
      },
    },
  }
}

const Home: NextPage<Props> = ({ data }) => {
  const dispatch = useAppDispatch()
  useSsrEffect(() => batch(() => {
    dispatch(saveUsers(data.users))
    dispatch(saveNotices(data.notices))
  }))

  const currentUser = useCurrentUser()
  const activeNotices = useAppSelector(selectActiveNotices)

  const [isNoticeCreationOpen, setNoticeCreationOpen] = useState(false)

  return (
    <Page title="Home" noBackground>
      <Background>
        <Image src="/images/front.png" alt="" layout="fill" objectFit="cover" quality={100} priority />
        <BackgroundOverlay />
      </Background>
      <Content>
        <ContentCard>
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
        </ContentCard>

        <NoticeCardList>
          {activeNotices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
            />
          ))}
          {currentUser !== null && (
            <CreateNoticeButton color="secondary" onClick={() => setNoticeCreationOpen(true)} title="Neue Aktivität erfassen">
              <UiIcon name="recordAdd" size={1.5} />
            </CreateNoticeButton>
          )}
        </NoticeCardList>

        {currentUser !== null && (
          <>
            <UiDrawer
              isOpen={isNoticeCreationOpen}
              onClose={() => { setNoticeCreationOpen(false) }}
            >
              <UiTitle level={2}>
                Neue Aktivität erfassen
              </UiTitle>
              <NoticeForm onClose={() => setNoticeCreationOpen(false)} />
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
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(2)};
  position: relative;
  z-index: 5;
`
const ContentCard = styled.div`
  color: ${theme.colors.secondary.contrast};
  background-color: ${theme.colors.secondary};
  padding: ${theme.spacing(4)};
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
const CreateNoticeButton = styled(UiButton)`
  border: 2px solid ${theme.colors.secondary.contrast};
  min-height: ${theme.spacing(24)};
`
