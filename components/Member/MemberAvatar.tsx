import UploadedImage from '@/models/base/UploadedImage'
import Member, { getMemberName } from '@/models/Member'
import { Theme } from '@/theme'
import theme from '@/theme-utils'
import { StyleProps } from '@/utils/props'
import Image from 'next/image'
import React, { EventHandler, ReactNode, useMemo } from 'react'
import styled, { useTheme } from 'styled-components'

interface Props extends StyleProps {
  member: Member
  onClick?: EventHandler<React.MouseEvent>
  avatar?: UploadedImage | null
  children?: ReactNode
}

const MemberAvatar: React.FC<Props> = ({
  member,
  avatar = member.userData.avatar,
  children,
  onClick: pushClick,
  className,
  style,
}) => {
  const alt = `Avatar von ${getMemberName(member)}`
  return (
    <Box onClick={pushClick} className={className} style={style}>
      {avatar === null ? (
        <Image src="/avatar/avatar.svg" alt={alt} width={500} height={500} layout="responsive" priority unoptimized />
      ) : (
        <UploadedAvatar avatar={avatar} alt={alt} />
      )}
      {children}
    </Box>
  )
}
export default styled(MemberAvatar)``

interface UploadedAvatarProps {
  avatar: UploadedImage
  alt: string
}

const UploadedAvatar: React.FC<UploadedAvatarProps> = ({ avatar, alt }) => {
  const theme: Theme = useTheme()

  const [width, height] = useMemo(() => {
    if (avatar.dimensions.width >= avatar.dimensions.height) {
      const height = theme.spacing * 16
      const width = (avatar.dimensions.width / avatar.dimensions.height) * height
      return [width, height]
    }
    const width = theme.spacing * 16
    const height = (avatar.dimensions.height / avatar.dimensions.width) * width
    return [width, height]
  }, [avatar.dimensions.height, avatar.dimensions.width, theme.spacing])
  return (
    <Image src={avatar.path} alt={alt} width={width} height={height} layout="fixed" />
  )
}

const Box = styled.div<{ isSvg?: boolean }>`
  position: relative;
  width: ${theme.spacing(16)};
  height: ${theme.spacing(16)};
  border-radius: 100%;
  overflow: hidden;
`
