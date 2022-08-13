import Notice from '@/models/Notice'
import MongoRepo from '@/repos/base/MongoRepo'

class NoticeRepo extends MongoRepo<Notice> {
  get collection(): string {
    return 'notices'
  }
}
export default new NoticeRepo()
