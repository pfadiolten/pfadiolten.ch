import Id from '@/models/base/Id'
import Model from '@/models/base/Model'
import UploadedImage from '@/models/base/UploadedImage'

export default interface UserData extends Model {
  avatar: UploadedImage | null
}

export const createDefaultUserData = (id: Id<UserData>): UserData => ({
  id,
  avatar: null,
})
