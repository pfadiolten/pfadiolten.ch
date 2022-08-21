import { parseGroup } from '@/models/Group'
import GroupPolicy from '@/policies/GroupPolicy'
import GroupRepo from '@/repos/GroupRepo'
import ApiService from '@/services/ApiService'

export default ApiService.handleResource(GroupRepo, {
  parse: parseGroup,
  policy: GroupPolicy,
})
