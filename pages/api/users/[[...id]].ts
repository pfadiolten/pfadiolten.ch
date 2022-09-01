import UserPolicy from '@/policies/UserPolicy'
import UserRepo from '@/repos/UserRepo'
import ApiService from '@/services/ApiService'

export default ApiService.handleResource(UserRepo, {
  policy: UserPolicy,
})
