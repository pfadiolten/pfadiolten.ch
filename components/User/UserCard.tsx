import UserAvatar from '@/components/User/UserAvatar'
import UserAvatarForm from '@/components/User/UserAvatarForm'
import usePolicy from '@/hooks/usePolicy'
import UploadedImage from '@/models/base/UploadedImage'
import { GroupId } from '@/models/Group'
import User from '@/models/User'
import UserPolicy from '@/policies/UserPolicy'
import { ColorName, KitDrawer, KitHeading, KitIcon, KitIconComponent, theme } from '@pfadiolten/react-kit'
import React, { ReactNode, useCallback, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'

interface Props {
  user: User
  group?: GroupId,
  title?: ReactNode
  avatar?: UploadedImage | null
  onChange?: (user: User) => void
  onRemoveAvatar?: () => void
  onResetAvatar?: () => void
  children?: ReactNode
}

const UserCard: React.FC<Props> = ({
  user,
  group = null,
  avatar,
  title = null,
  onChange: pushChange,
  onRemoveAvatar: pushRemoveAvatar,
  onResetAvatar: pushResetAvatar,
  children,
}) => {
  const policy = usePolicy(UserPolicy)
  const canEdit = policy.canEdit(user)

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

  const avatarOverlay = useMemo<{ color: ColorName, Icon: KitIconComponent } | null>(() => {
    if (!canEdit) {
      return null
    }
    switch (handleAvatarClick) {
    case undefined:
      return null
    case pushResetAvatar:
      return { color: 'success', Icon: KitIcon.Reset }
    case pushRemoveAvatar:
      return { color: 'error', Icon: KitIcon.Cancel }
    case openAvatarForm:
      return { color: 'secondary', Icon: KitIcon.Edit }
    default:
      throw new Error(`unexpected callback: ${handleAvatarClick}`)
    }
  }, [canEdit, handleAvatarClick, openAvatarForm, pushRemoveAvatar, pushResetAvatar])

  return (
    <Box>
      <Avatar
        user={user}
        avatar={avatar}
        onClick={handleAvatarClick}
      >
        {avatarOverlay !== null && (
          <AvatarOverlay color={avatarOverlay.color}>
            <avatarOverlay.Icon size={2} />
          </AvatarOverlay>
        )}
      </Avatar>
      <div>
        <KitHeading level={5}>
          {title ?? user.name}
        </KitHeading>
        <Roles>
          {group === null ? (
            user.roles.map((role) => (
              <RoleItem key={`${role.groupId} ${role.name}`}>
                {/* TODO Link to group */}
                {role.name}
              </RoleItem>
            ))
          ) : (
            user.roles.filter((role) => role.groupId === group).map((role) => (
              <RoleItem key={`${role.groupId} ${role.name}`}>
                {role.name}
              </RoleItem>
            ))
          )}
        </Roles>
        {children && (
          <CustomContent>
            {children}
          </CustomContent>
        )}
      </div>

      {(pushChange && canEdit) && (
        <KitDrawer size="fixed" isOpen={isAvatarFormVisible} onClose={() => setIsAvatarFormVisible(false)}>
          <AvatarFormBox>
            <KitHeading level={2}>
              Avatar ändern
            </KitHeading>
            <UserAvatarForm
              user={user}
              onChange={pushChange}
              onClose={() => setIsAvatarFormVisible(false)}
            />
          </AvatarFormBox>
        </KitDrawer>
      )}
    </Box>
  )
}
export default UserCard

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
const Avatar = styled(UserAvatar)`
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
const Roles = styled.ul`
  
`
const RoleItem = styled.li`
  font-family: ${theme.fonts.serif};
  font-size: 1.1rem;
`
const CustomContent = styled.div`
  margin-top: ${theme.spacing(1)};
`
