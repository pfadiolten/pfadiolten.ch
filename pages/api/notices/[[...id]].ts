import NoticePolicy from '@/policies/NoticePolicy'
import NoticeRepo from '@/repos/NoticeRepo'
import ApiService from '@/services/ApiService'

export default ApiService.handleResource(NoticeRepo, {
  policy: NoticePolicy,
})
