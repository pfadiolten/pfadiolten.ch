import Notice from '@/models/Notice'
import { BasePolicy, InferPolicy } from '@/policies/Policy'
import type NoticeRepo from '@/repos/NoticeRepo'

export default class NoticePolicy extends BasePolicy<Notice> implements InferPolicy<typeof NoticeRepo> {
  canList(): boolean {
    return true
  }

  canRead(_record: Notice): boolean {
    return true
  }

  canCreate(): boolean {
    return this.hasUser
  }

  canEdit(_record: Notice): boolean {
    return this.hasUser
  }

  canDelete(_record: Notice): boolean {
    return this.hasUser
  }
}
