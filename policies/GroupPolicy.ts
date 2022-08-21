import Group from '@/models/Group'
import { BasePolicy, InferPolicy } from '@/policies/Policy'
import type GroupRepo from '@/repos/GroupRepo'

export default class GroupPolicy extends BasePolicy<Group> implements InferPolicy<typeof GroupRepo> {
  canList(): boolean {
    return true
  }

  canRead(_record: Group): boolean {
    return true
  }
}
