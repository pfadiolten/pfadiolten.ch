import { parsePerson } from '@/models/Person'
import NoticeRepo from '@/repos/NoticeRepo'
import ApiService from '@/services/ApiService'

export default ApiService.handleResource(NoticeRepo, {
  parse: parsePerson,
})
