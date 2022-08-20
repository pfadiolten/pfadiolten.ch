import MemberAvatar from '@/components/Member/MemberAvatar'
import MemberAvatarForm from '@/components/Member/MemberAvatarForm'
import UiDrawer from '@/components/Ui/UiDrawer'
import UiIcon, { UiIconName } from '@/components/Ui/UiIcon'
import UiTitle from '@/components/Ui/UiTitle'
import usePolicy from '@/hooks/usePolicy'
import useUser from '@/hooks/useUser'
import UploadedImage from '@/models/base/UploadedImage'
import { Role } from '@/models/Group'
import Member from '@/models/Member'
import MemberPolicy from '@/policies/MemberPolicy'
import { ColorName } from '@/theme'
import theme from '@/theme-utils'
import React, { ReactNode, useCallback, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'

interface Props {
  member: Member
  title?: ReactNode
  avatar?: UploadedImage | null
  role?: Role | null
  onChange?: (member: Member) => void
  onRemoveAvatar?: () => void
  onResetAvatar?: () => void
  children?: ReactNode
}

const MemberCard: React.FC<Props> = ({
  member, avatar,
  title = null,
  role = null,
  onChange: pushChange,
  onRemoveAvatar: pushRemoveAvatar,
  onResetAvatar: pushResetAvatar,
  children,
}) => {
  const policy = usePolicy(MemberPolicy)
  const canEdit = policy.canEdit(member)

  const [isAvatarFormVisible, setIsAvatarFormVisible] = useState(false)

  const openAvatarForm = useCallback(() => setIsAvatarFormVisible(true), [])
  const handleAvatarClick = useMemo(() => {
    if (pushResetAvatar) {
      return pushResetAvatar
    }
    if (pushRemoveAvatar) {
      return pushRemoveAvatar
    }
    return canEdit && pushChange
      ? openAvatarForm
      : undefined
  }, [pushResetAvatar, pushRemoveAvatar, canEdit, pushChange, openAvatarForm])

  const avatarOverlay: { color: ColorName, icon: UiIconName } | null = useMemo(() => {
    if (!canEdit) {
      return null
    }
    switch (handleAvatarClick) {
    case undefined:
      return null
    case pushResetAvatar:
      return { color: 'success', icon: 'reset' }
    case pushRemoveAvatar:
      return { color: 'error', icon: 'cancel' }
    case openAvatarForm:
      return { color: 'secondary', icon: 'recordEdit' }
    default:
      throw new Error(`unexpected callback: ${handleAvatarClick}`)
    }
  }, [canEdit, handleAvatarClick, openAvatarForm, pushRemoveAvatar, pushResetAvatar])

  return (
    <Box>
      <Avatar
        member={member}
        avatar={avatar}
        onClick={handleAvatarClick}
      >
        {avatarOverlay !== null && (
          <AvatarOverlay color={avatarOverlay.color}>
            <UiIcon name={avatarOverlay.icon} size={2} />
          </AvatarOverlay>
        )}
      </Avatar>
      <div>
        <UiTitle level={5}>
          {title ?? member.name}
        </UiTitle>
        {role && (
          <Role>
            {role.name}
          </Role>
        )}
        {children && (
          <CustomContent>
            {children}
          </CustomContent>
        )}
      </div>

      {(pushChange && canEdit) && (
        <UiDrawer size="fixed" isOpen={isAvatarFormVisible} onClose={() => setIsAvatarFormVisible(false)}>
          <AvatarFormBox>
            <UiTitle level={2}>
              Avatar ändern
            </UiTitle>
            <MemberAvatarForm
              member={member}
              role={role}
              onChange={pushChange}
              onClose={() => setIsAvatarFormVisible(false)}
            />
          </AvatarFormBox>
        </UiDrawer>
      )}
    </Box>
  )
}
export default MemberCard

const Box = styled.li`
  position: relative;
  display: flex;
  gap: ${theme.spacing(2)};
`

const AvatarOverlay = styled.div<{ color: ColorName }>`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  color: ${theme.color.contrast};
  background-color: ${theme.color.a(0.75)};
  z-index: 5;
  
  display: flex;
  justify-content: center;
  align-items: center;
  
  opacity: 0;
  transition: ${theme.transitions.fade};
  transition-property: opacity, color, background-color;
`
const Avatar = styled(MemberAvatar)`
  ${({ onClick }) => onClick && css`
    cursor: pointer;
  `}
  
  :hover > ${AvatarOverlay} {
    opacity: 1;
  }
`
const AvatarFormBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(2)};
`
const Role = styled.em`
  font-family: ${theme.fonts.serif};
  font-size: 1.1rem;
`
const CustomContent = styled.div`
  margin-top: ${theme.spacing(1)};
`
