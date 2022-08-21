import { parseUser } from '@/models/User'
import UserPolicy from '@/policies/UserPolicy'
import UserRepo from '@/repos/UserRepo'
import ApiService from '@/services/ApiService'

export default ApiService.handleResource(UserRepo, {
  parse: parseUser,
  policy: UserPolicy,
})
