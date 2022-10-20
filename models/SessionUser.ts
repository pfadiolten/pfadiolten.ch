import { Model } from '@pfadiolten/react-kit'

export default interface SessionUser extends Model {
  email: string
  name: string
  isAdmin: boolean
}
