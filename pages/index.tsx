import NoticeCard from '@/components/Notice/NoticeCard'
import NoticeCardList from '@/components/Notice/NoticeCardList'
import NoticeForm from '@/components/Notice/NoticeForm'
import Page from '@/components/Page/Page'
import UiButton from '@/components/Ui/Button/UiButton'
import UiDrawer from '@/components/Ui/UiDrawer'
import UiIcon from '@/components/Ui/UiIcon'
import UiTitle from '@/components/Ui/UiTitle'
import useUser from '@/hooks/useUser'
import Group, { parseGroup } from '@/models/Group'
import Notice, { parseNotice } from '@/models/Notice'
import logo from '@/public/logo/pfadi_olten-textless.svg'
import FetchService from '@/services/FetchService'
import theme from '@/theme-utils'
import { noop } from '@/utils/fns'
import { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import styled from 'styled-components'

interface Props {
  data: {
    notices: Notice[]
    groups: Group[]
  }
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const [notices, noticesError] = await FetchService.get<Notice[]>('notices')
  if (noticesError !== null) {
    throw noticesError
  }
  const [groups, groupsError] = await FetchService.get<Group[]>('groups')
  if (groupsError !== null) {
    throw groupsError
  }
  return {
    props: {
      data: {
        notices,
        groups,
      },
    },
  }
}

const Home: NextPage<Props> = ({ data }) => {
  const [isNoticeCreationOpen, setNoticeCreationOpen] = useState(false)
  const [editNotice, setEditNotice] = useState(null as Notice | null)

  const [notices, setNotices] = typeof window === 'undefined'
    ? [data.notices.map(parseNotice), noop]
    : useState(data.notices.map(parseNotice))
  const groups = useMemo(() => data.groups.map(parseGroup), [data.groups])

  const user = useUser()
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
          {user !== null && (
            <NoticeCreateButton color="secondary" onClick={() => setNoticeCreationOpen(true)} title="Neue Aktivität erfassen">
              <UiIcon name="recordAdd" size={1.5} />
            </NoticeCreateButton>
          )}
          {notices.map((notice) => (
            <NoticeCard
              key={notice.id}
              notice={notice}
              allGroups={groups}
              onEdit={setEditNotice}
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
                  groups={groups}
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
                groups={groups}
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
  min-height: calc(100vh - ${theme.spacing(16)});
  margin-top: ${theme.spacing(-8)};
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
