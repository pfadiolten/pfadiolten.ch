import Model from '@/models/base/Model'

export default interface User extends Model {
  email: string
  name: string
}
