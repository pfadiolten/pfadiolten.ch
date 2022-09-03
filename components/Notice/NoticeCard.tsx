import GroupLabel from '@/components/Group/GroupLabel'
import GroupLabelList from '@/components/Group/GroupLabelList'
import NoticeForm from '@/components/Notice/NoticeForm'
import UiActionButton from '@/components/Ui/Button/UiActionButton'
import UiDropdown from '@/components/Ui/Dropdown/UiDropdown'
import UiDate from '@/components/Ui/UiDate'
import UiDrawer from '@/components/Ui/UiDrawer'
import UiIcon from '@/components/Ui/UiIcon'
import UiRichText from '@/components/Ui/UiRichText'
import UiTitle from '@/components/Ui/UiTitle'
import useBool from '@/hooks/useBool'
import useCurrentUser from '@/hooks/useCurrentUser'
import { isEmptyRichText } from '@/models/base/RichText'
import { allGroups } from '@/models/Group'
import Notice from '@/models/Notice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { deleteNotice } from '@/store/notices/notices.slice'
import { selectUser } from '@/store/users/users.slice'
import theme from '@/theme-utils'
import Link from 'next/link'
import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'

interface Props {
  notice: Notice
}

const NoticeCard: React.FC<Props> = ({ notice }) => {
  const currentUser = useCurrentUser()

  const groups = useMemo(() => (
    allGroups.filter((group) => notice.groupIds.includes(group.id))
  ), [notice.groupIds])

  const [isEditing, setEditing] = useBool()

  const dispatch = useAppDispatch()
  const handleDelete = useCallback(() => {
    if (confirm(`Willst du die Aktivität "${notice.title}" wirklich löschen?`)) {
      dispatch(deleteNotice(notice.id))
    }
  }, [notice, dispatch])

  const author = useAppSelector(selectUser(notice.authorId))

  return (
    <Box>
      <TitleRow>
        <UiTitle level={4}>
          {notice.title}
        </UiTitle>
        {currentUser !== null && (
          <ActionButtons>
            <UiDropdown>
              <UiDropdown.Activator>{({ toggle }) => (
                <UiActionButton title="Mehr" color="secondary" onClick={toggle}>
                  <UiIcon name="more" />
                </UiActionButton>
              )}</UiDropdown.Activator>
              <UiDropdown.Menu label="Mehr zu dieser Aktivität">
                <UiDropdown.Item onClick={setEditing.on}>
                  Bearbeiten
                </UiDropdown.Item>
                <UiDropdown.Item onClick={handleDelete}>
                  Löschen
                </UiDropdown.Item>
              </UiDropdown.Menu>
            </UiDropdown>
          </ActionButtons>
        )}
      </TitleRow>
      <GroupRow>
        {groups.map((group) => (
          <GroupLabel key={group.id} group={group} />
        ))}
      </GroupRow>
      <Divider />
      <InfoBox aria-label="Zeit und Ort">
        <InfoRow>
          <UiTitle level={5}>
            Beginn
          </UiTitle>
          <UiTitle level={5}>
            Ende
          </UiTitle>
        </InfoRow>
        <InfoRow>
          <UiDate value={notice.startsAt} format="datetime" aria-label="Startzeit" />
          <UiIcon name="clock" />
          <UiDate value={notice.endsAt} format="datetime" aria-label="Schlusszeit" />
        </InfoRow>
        <InfoRow>
          <span aria-label="Startort">
            {notice.startLocation}
          </span>
          <UiIcon name="location" />
          <span aria-label="Schlussort">
            {notice.endLocation ?? notice.startLocation}
          </span>
        </InfoRow>
      </InfoBox>
      {!isEmptyRichText(notice.description) && (
        <React.Fragment>
          <Divider />
          <Description aria-label="Beschreibung">
            <UiRichText value={notice.description} />
          </Description>
        </React.Fragment>
      )}
      {author !== null && (
        <React.Fragment>
          <Divider />
          <a href={`mailto:${author.name.toLocaleLowerCase()}@pfadiolten.ch`}>
            Abmelden bei {author.name}
          </a>
        </React.Fragment>
      )}
      {currentUser !== null && (
        <UiDrawer isOpen={isEditing} onClose={setEditing.off}>{({ close }) => (
          <React.Fragment>
            <UiTitle level={2}>
              Aktivität bearbeiten
            </UiTitle>
            <NoticeForm
              notice={notice}
              onClose={close}
            />
          </React.Fragment>
        )}</UiDrawer>
      )}
    </Box>
  )
}
export default NoticeCard

const Box = styled.li`
  position: relative;
  text-align: center;
  background-color: ${theme.colors.secondary};
  color: ${theme.colors.secondary.contrast};
  padding: ${theme.spacing(1)};
  justify-content: center;
  align-content: center;
`
const Divider = styled.hr`
  background-color: ${theme.colors.secondary.contrast};
  width: 100%;
  height: 1px;
  margin-block: ${theme.spacing(1.5)};
  border: none;
`
const TitleRow = styled.div`
  display: flex;
  justify-content: center;
  gap: ${theme.spacing(2)};
`
const ActionButtons = styled.div`
  position: relative;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: ${theme.spacing(1)};
`
const GroupRow = styled(GroupLabelList)`
  margin-block: ${theme.spacing(0.75)};
  justify-content: center;
`
const InfoBox = styled.div`
`
const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  > :first-child {
    width: calc(50% - 8px);
    text-align: left;
  }
  > :nth-child(2) {
    width: 16px;
    text-align: center;
  }
  > :last-child {
    width: calc(50% - 8px);
    text-align: right;
  }
`
const Description = styled.p`
  text-align: left;
`

