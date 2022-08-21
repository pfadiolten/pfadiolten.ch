import User from '@/models/User'
import { BasePolicy, ReadPolicy, EditPolicy, ListPolicy } from '@/policies/Policy'

export default class UserPolicy extends BasePolicy<User> implements ListPolicy<User>, ReadPolicy<User>, EditPolicy<User> {
  canList(): boolean {
    return true
  }

  canRead(_record: User): boolean {
    return true
  }

  canEdit(record: User): boolean {
    return this.isAdmin || this.withUser((user) => user.id === record.id)
  }
}
