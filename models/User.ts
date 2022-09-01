import Id from '@/models/base/Id'
import Model from '@/models/base/Model'
import UploadedImage  from '@/models/base/UploadedImage'
import { Role } from '@/models/Group'

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

