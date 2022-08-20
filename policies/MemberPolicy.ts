import Member from '@/models/Member'
import { BasePolicy, ReadPolicy, EditPolicy } from '@/policies/Policy'

export default class MemberPolicy extends BasePolicy<Member> implements ReadPolicy<Member>, EditPolicy<Member> {
  canRead(_record: Member): boolean {
    return true
  }

  canEdit(record: Member): boolean {
    return this.isAdmin || this.withUser((user) => user.id === record.id)
  }
}
