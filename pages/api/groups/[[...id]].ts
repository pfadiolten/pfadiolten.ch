import GroupPolicy from '@/policies/GroupPolicy'
import GroupRepo from '@/repos/GroupRepo'
import ApiService from '@/services/ApiService'

export default ApiService.handleResource(GroupRepo, {
  policy: GroupPolicy,
})
