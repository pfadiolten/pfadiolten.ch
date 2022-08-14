import UiDate from '@/components/Ui/UiDate'
import UiIcon from '@/components/Ui/UiIcon'
import UiTitle from '@/components/Ui/UiTitle'
import Notice from '@/models/Notice'
import theme from '@/theme-utils'
import React from 'react'
import styled from 'styled-components'

interface Props {
  notice: Notice
}

const NoticeCard: React.FC<Props> = ({ notice }) => {
  return (
    <Box>
      <UiTitle level={4}>
        {notice.title}
      </UiTitle>
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
        {notice.description}
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
const Divider = styled.div`
  background-color: ${theme.colors.secondary.contrast};
  width: 100%;
  height: 1px;
  margin-block: ${theme.spacing(1.5)};
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

