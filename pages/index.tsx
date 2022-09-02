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
import FetchService from '@/services/FetchService'
import { useAppDispatch } from '@/store/hooks'
import { saveUsers } from '@/store/users/users.slice'
import theme from '@/theme-utils'
import { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image'
import { useCallback, useState } from 'react'
import styled from 'styled-components'

interface Props {
  notices: Notice[]
  users: User[]
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const notices = await NoticeRepo.list()
  const users = await UserRepo.list()
  return {
    props: {
      notices,
      users,
    },
  }
}

const Home: NextPage<Props> = ({ notices: initialNotices, users }) => {
  const dispatch = useAppDispatch()
  useSsrEffect(() => {
    dispatch(saveUsers(users))
  })

  const [isNoticeCreationOpen, setNoticeCreationOpen] = useState(false)
  const [editNotice, setEditNotice] = useState(null as Notice | null)

  const [notices, setNotices] = useState(initialNotices)

  const user = useCurrentUser()

  const deleteNotice = useCallback(async (notice: Notice) => {
    const error = await FetchService.delete(`notices/${notice.id}`)
    if (error !== null) {
      throw error
    }
    setNotices((notices) => {
      notices = [...notices]
      notices.splice(notices.indexOf(notice), 1)
      return notices
    })
  }, [setNotices])

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
          {notices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              onEdit={setEditNotice}
              onDelete={deleteNotice}
            />
          ))}
          {user !== null && (
            <>
              <UiDrawer
                isOpen={editNotice !== null}
                onClose={() => { setEditNotice(null) }}
              >
                <UiTitle level={2}>
                  Aktivität bearbeiten
                </UiTitle>
                <NoticeForm
                  notice={editNotice}
                  onSave={(notice) => {
                    setNotices((notices) => {
                      notices = [...notices]
                      notices[notices.indexOf(editNotice!)!] = notice
                      return notices
                    })
                  }}
                  onClose={() => setEditNotice(null)}
                />
              </UiDrawer>
            </>
          )}
          {user !== null && (
            <NoticeCreateButton color="secondary" onClick={() => setNoticeCreationOpen(true)} title="Neue Aktivität erfassen">
              <UiIcon name="recordAdd" size={1.5} />
            </NoticeCreateButton>
          )}
        </NoticeCardList>

        {user !== null && (
          <>
            <UiDrawer
              isOpen={isNoticeCreationOpen}
              onClose={() => { setNoticeCreationOpen(false) }}
            >
              <UiTitle level={2}>
                Neue Aktivität erfassen
              </UiTitle>
              <NoticeForm
                onSave={(notice) => setNotices((notices) => [...notices, notice])}
                onClose={() => setNoticeCreationOpen(false)}
              />
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
const NoticeCreateButton = styled(UiButton)`
  border: 2px solid ${theme.colors.secondary.contrast};
  min-height: ${theme.spacing(24)};
`
