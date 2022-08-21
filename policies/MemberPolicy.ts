import Member from '@/models/Member'
import { BasePolicy, ReadPolicy, EditPolicy, ListPolicy } from '@/policies/Policy'

export default class MemberPolicy extends BasePolicy<Member> implements ListPolicy<Member>, ReadPolicy<Member>, EditPolicy<Member> {
  canList(): boolean {
    return true
  }

  canRead(_record: Member): boolean {
    return true
  }

  canEdit(record: Member): boolean {
    return this.isAdmin || this.withUser((user) => user.id === record.id)
  }
}
