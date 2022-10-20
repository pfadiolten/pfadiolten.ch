import UploadedImage  from '@/models/base/UploadedImage'
import { Role } from '@/models/Group'
import { Id, Model } from '@pfadiolten/react-kit'

export default interface User extends UserData {
  name: string
  roles: Role[]
}

/**
 * `UserData` contains locally stored data of a user.
 * Unlike other aspects of a user, this data can be edited.
 */
export interface UserData extends Model {
  avatar: UploadedImage | null
}

export const createDefaultUserData = (id: Id<UserData>): UserData => ({
  id,
  avatar: null,
})

