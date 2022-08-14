import { parseNotice } from '@/models/Notice'
import NoticeRepo from '@/repos/NoticeRepo'
import ApiService from '@/services/ApiService'

export default ApiService.handleResource(NoticeRepo, {
  parse: parseNotice,
})
