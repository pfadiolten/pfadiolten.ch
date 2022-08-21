import UiIcon from '@/components/Ui/UiIcon'
import UiSubmit from '@/components/Ui/UiSubmit'
import UserCard from '@/components/User/UserCard'
import UploadedImage, { allowedImageTypes } from '@/models/base/UploadedImage'
import { Role } from '@/models/Group'
import User from '@/models/User'
import FetchService from '@/services/FetchService'
import theme from '@/theme-utils'
import { also } from '@/utils/control-flow'
import React, { EventHandler, useCallback, useState } from 'react'
import styled, { css } from 'styled-components'

interface Props {
  user: User
  role?: Role | null
  onChange: (user: User) => void
  onClose: () => void
}

const UserAvatarForm: React.FC<Props> = ({
  user,
  role,
  onChange: pushChange,
  onClose: pushClose,
}) => {
  const [avatar, setAvatar] = useState(null as File | null)
  const [avatarImage, setAvatarImage] = useState(user.avatar)

  const updateAvatar = useCallback((file: File | null) => {
    if (file !== null) {
      setAvatar(file)
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        const img = new Image()
        img.addEventListener('load', async () => {
          setAvatarImage({
            path: reader.result as string,
            dimensions: {
              width: img.width,
              height: img.height,
            },
            mimeType: file.type,
          })
        })
        img.src = reader.result as string
      })
      reader.readAsDataURL(file)
    }
  }, [])

  const handleSubmit = useCallback(async () => {
    if (avatar === null) {
      const error = await FetchService.delete(`users/${user.id}/avatar`)
      if (error !== null) {
        throw error
      }
      pushChange({
        ...user,
        avatar: null,
      })
      pushClose()
      return
    }

    const [avatarUpload, error] = await FetchService.post<UploadedImage>(`users/${user.id}/avatar`, also(new FormData(), (fields) => {
      fields.append('file', avatar)
    }))
    if (error !== null) {
      throw error
    }
    pushChange({
      ...user,
      avatar: avatarUpload,
    })
    pushClose()
  }, [avatar, user, pushChange, pushClose])

  const handleChange: EventHandler<React.ChangeEvent<HTMLInputElement>> = useCallback((e) => {
    updateAvatar(e.target.files?.[0] ?? null)
  }, [updateAvatar])

  const handleRemoveAvatar = useCallback(() => {
    setAvatar(null)
    setAvatarImage(null)
  }, [])

  const handleResetAvatar = useCallback(() => {
    setAvatar(null)
    setAvatarImage(user.avatar)
  }, [user.avatar])

  const [isDropReady, setDropReady] = useState(false)

  const handleDrop: EventHandler<React.DragEvent> = useCallback((e) => {
    e.stopPropagation()
    e.preventDefault()
    const file = e.dataTransfer?.files?.[0]
    if (file != undefined) {
      updateAvatar(file)
    }
  }, [updateAvatar])

  const activateDrop: EventHandler<React.DragEvent> = useCallback((e) => {
    e.stopPropagation()
    e.preventDefault()
    setDropReady(true)
  }, [])

  const deactivateDrop: EventHandler<React.DragEvent> = useCallback((e) => {
    e.stopPropagation()
    e.preventDefault()
    setDropReady(false)
  }, [])

  return (
    <div>
      <InputRow>
        <FileInputLabel
          onDrop={handleDrop}
          onDragStart={activateDrop}
          onDragOver={activateDrop}
          onDragEnter={activateDrop}
          onDragEnd={deactivateDrop}
          onDragLeave={deactivateDrop}
          isDropReady={isDropReady}
        >
          <UiIcon name="upload" size={4} />
          <input type="file" accept={allowedImageTypes.join(',')} onChange={handleChange} />
        </FileInputLabel>
        <PreviewBox>
          <UserCard
            user={user}
            avatar={avatarImage}
            role={role}
            onResetAvatar={avatarImage === null && user.avatar !== null ? handleResetAvatar : undefined}
            onRemoveAvatar={avatarImage !== null ? handleRemoveAvatar : undefined}
          />
        </PreviewBox>
      </InputRow>
      <UiSubmit.Custom
        isValid={avatar !== null || avatarImage === null}
        onSubmit={handleSubmit}
        onCancel={pushClose}
      />
    </div>
  )
}
export default UserAvatarForm

const InputRow = styled.div`
  display: flex;
  column-gap: ${theme.spacing(4)};
  row-gap: ${theme.spacing(2)};
  
  ${theme.media.sm.max} {
    flex-wrap: wrap;
  }
`

const readyState = css`
  background-color: unset;
  outline-offset: -1rem;

  ${UiIcon} {
    transform: scale(1.1);
  }
`
const FileInputLabel = styled.label<{ isDropReady: boolean }>`
  width: 100%;
  padding-block: ${theme.spacing(4)};
  padding-inline: ${theme.spacing(4)};
  cursor: pointer;

  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(2)};
  justify-content: center;
  align-items: center;
  border-radius: ${theme.spacing(1)};

  color: ${theme.colors.secondary.contrast};
  background-color: ${theme.colors.secondary};
  outline: 2px dashed ${theme.colors.secondary.contrast};
  outline-offset: ${theme.spacing(-1)};

  transition: ${theme.transitions.slideIn};
  transition-property: background-color, outline-offset;
  
  input {
    display: none;
  }

  ${UiIcon} {
    transition: 150ms ease-out;
    transition-property: transform;
    will-change: transform;
  }

  ${({ isDropReady }) => isDropReady && readyState}
  :hover {
    ${readyState}
  }
  
  ${theme.media.sm.max} {
    order: 1;
    flex: 0 0 100%;
    width: 100%;
  }
`
const PreviewBox = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

  ${theme.media.md.min} {
    display: block;
    flex: 0 0 auto;
    width: auto;
    max-width: 100%;
  }
`
