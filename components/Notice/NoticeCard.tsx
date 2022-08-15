import UiActionButton from '@/components/Ui/Button/UiActionButton'
import UiDate from '@/components/Ui/UiDate'
import UiIcon from '@/components/Ui/UiIcon'
import UiRichText from '@/components/Ui/UiRichText'
import UiTitle from '@/components/Ui/UiTitle'
import useUser from '@/hooks/useUser'
import Group from '@/models/Group'
import Notice from '@/models/Notice'
import { Color } from '@/theme'
import theme, { createColorAccess } from '@/theme-utils'
import React, { useMemo } from 'react'
import styled, { css } from 'styled-components'

interface Props {
  notice: Notice
  allGroups: Group[]
  onEdit: (notice: Notice) => void
}

const NoticeCard: React.FC<Props> = ({ notice, allGroups, onEdit: pushEdit }) => {
  const groups = useMemo(() => (
    allGroups.filter((group) => notice.groupIds.includes(group.id))
  ), [allGroups, notice.groupIds])

  const user = useUser()

  return (
    <Box>
      <TitleRow>
        <UiTitle level={4}>
          {notice.title}
        </UiTitle>
        {user !== null && (
          <ActionButtons>
            <UiActionButton title="Bearbeiten" onClick={() => pushEdit(notice)}>
              <UiIcon name="recordEdit" />
            </UiActionButton>
          </ActionButtons>
        )}
      </TitleRow>
      <GroupRow>
        {groups.map((group) => (
          <GroupName key={group.id} groupColor={group.color}>
            {group.shortName}
          </GroupName>
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
const GroupName = styled.span<{ groupColor: Color }>`
  padding: ${theme.spacing(0.25)} ${theme.spacing(0.5)};
  ${({ groupColor }) => {
    const color = createColorAccess(groupColor)
    return css`
      color: ${color.contrast};
      background-color: ${color};
    `
  }}
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

