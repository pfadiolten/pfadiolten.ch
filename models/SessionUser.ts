import Model from '@/models/base/Model'

export default interface SessionUser extends Model {
  email: string
  name: string
  isAdmin: boolean
}
