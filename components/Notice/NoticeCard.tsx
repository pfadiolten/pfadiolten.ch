import UiActionButton from '@/components/Ui/Button/UiActionButton'
import UiDropdown from '@/components/Ui/Dropdown/UiDropdown'
import UiDate from '@/components/Ui/UiDate'
import UiIcon from '@/components/Ui/UiIcon'
import UiRichText from '@/components/Ui/UiRichText'
import UiTitle from '@/components/Ui/UiTitle'
import useUser from '@/hooks/useUser'
import Group from '@/models/Group'
import Notice from '@/models/Notice'
import theme from '@/theme-utils'
import Link from 'next/link'
import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'

interface Props {
  notice: Notice
  allGroups: Group[]
  onEdit: (notice: Notice) => void
  onDelete: (notice: Notice) => void
}

const NoticeCard: React.FC<Props> = ({ notice, allGroups, onEdit: pushEdit, onDelete: pushDelete }) => {
  const groups = useMemo(() => (
    allGroups.filter((group) => notice.groupIds.includes(group.id))
  ), [allGroups, notice.groupIds])

  const user = useUser()

  const handleDelete = useCallback(() => {
    if (confirm(`Willst du die Aktivität "${notice.title}" wirklich löschen?`)) {
      pushDelete(notice)
    }
  }, [notice, pushDelete])

  return (
    <Box>
      <TitleRow>
        <UiTitle level={4}>
          {notice.title}
        </UiTitle>
        {user !== null && (
          <ActionButtons>
            <UiDropdown>
              <UiDropdown.Activator>{({ toggle }) => (
                <UiActionButton title="Mehr" color="secondary" onClick={toggle}>
                  <UiIcon name="more" />
                </UiActionButton>
              )}</UiDropdown.Activator>
              <UiDropdown.Menu label="Mehr zu dieser Aktivität">
                <UiDropdown.Item onClick={() => pushEdit(notice)}>
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
          <Link key={group.id} href={`/stufen/${group.id}`} passHref>
            <GroupName>
              {group.shortName}
            </GroupName>
          </Link>
        ))}
      </GroupRow>
      <Divider />
      <InfoBox>
        <InfoRow>
          <UiTitle level={5}>
            Beginn
          </UiTitle>
          <UiTitle level={5}>
            Ende
          </UiTitle>
        </InfoRow>
        <InfoRow>
          <UiDate value={notice.startsAt} format="datetime" />
          <UiIcon name="clock" />
          <UiDate value={notice.endsAt} format="datetime" />
        </InfoRow>
        <InfoRow>
          <span>
            {notice.startLocation}
          </span>
          <UiIcon name="location" />
          <span>
            {notice.endLocation ?? notice.startLocation}
          </span>
        </InfoRow>
      </InfoBox>
      <Divider />
      <Description>
        <UiRichText value={notice.description} />
      </Description>
      <Divider />
      <a href={`mailto:${notice.authorId}@pfadiolten.ch`}>
        Abmelden bei
      </a>
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
const GroupRow = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: ${theme.spacing(1)};
  margin-block: ${theme.spacing(0.75)};
`
const GroupName = styled.a`
  padding: ${theme.spacing(0.25)} ${theme.spacing(0.5)};
  text-decoration: none;
  color: ${theme.colors.primary.contrast};
  background-color: ${theme.colors.primary};
  
  transition: ${theme.transitions.fade};
  transition-property: filter;
  :hover {
    filter: brightness(0.75);
  }
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

