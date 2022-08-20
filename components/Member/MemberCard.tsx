import UiTitle from '@/components/Ui/UiTitle'
import UploadedImage from '@/models/base/UploadedImage'
import { Role } from '@/models/Group'
import Member, { getMemberName } from '@/models/Member'
import { Theme } from '@/theme'
import theme from '@/theme-utils'
import { run } from '@/utils/control-flow'
import Image from 'next/image'
import React from 'react'
import styled, { useTheme, css } from 'styled-components'

interface Props {
  member: Member
  role?: Role
}

const MemberCard: React.FC<Props> = ({ member, role = null }) => {
  const name = getMemberName(member)

  return (
    <Box>
      {member.userData.avatar === null ? (
        <Avatar isSvg>
          <Image src="/avatar/avatar.svg" alt={`Avatar von ${name}`} width={500} height={500} layout="responsive" priority unoptimized />
        </Avatar>
      ) : (
        <MemberAvatar member={member} avatar={member.userData.avatar} />
      )}
      <div>
        <UiTitle level={3}>
          {name}
        </UiTitle>
        {role?.name}
      </div>
    </Box>
  )
}
export default MemberCard

const MemberAvatar: React.FC<{ member: Member, avatar: UploadedImage }> = ({ member, avatar }) => {
  const theme: Theme = useTheme()
  const [width, height] = run(() => {
    if (avatar.dimensions.width >= avatar.dimensions.height) {
      const height = theme.spacing * 16
      const width = (avatar.dimensions.width / avatar.dimensions.height) * height
      return [width, height]
    }
    const width = theme.spacing * 16
    const height = (avatar.dimensions.height / avatar.dimensions.width) * width
    return [width, height]
  })
  console.log({ width, height })
  return (
    <Avatar>
      <Image src={avatar.path} alt={`Avatar von ${getMemberName(member)}`} width={width} height={height} layout="fixed" />
    </Avatar>
  )
}

const Box = styled.li`
  position: relative;
  display: flex;
  gap: ${theme.spacing(2)};
`

const Avatar = styled.div<{ isSvg?: boolean }>`
  position: relative;
  width: ${theme.spacing(16)};
  height: ${theme.spacing(16)};
  border-radius: 100%;
  overflow: hidden;
`
