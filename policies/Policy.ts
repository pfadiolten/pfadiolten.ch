import SessionUser from '@/models/SessionUser'
import { CreateRepo, DeleteRepo, FindRepo, ListRepo, UpdateRepo } from '@/repos/Repo'

export class BasePolicy<_T> {
  constructor(protected readonly user: SessionUser | null) {
  }

  protected get isAdmin(): boolean {
    return this.user?.isAdmin ?? false
  }

  protected withUser(action: (user: SessionUser) => boolean): boolean {
    if (this.user === null) {
      return false
    }
    return action(this.user)
  }
}

export interface PolicyConstructor<P> {
  new(user: SessionUser | null): P
}

export interface ReadPolicy<T> {
  canRead(record: T): boolean
}

export interface WritePolicy<T> extends CreatePolicy<T>, EditPolicy<T>, DeletePolicy<T> {}

export interface CreatePolicy<T> {
  canCreate(record: T): boolean
}

export interface EditPolicy<T> {
  canEdit(record: T): boolean
}

export interface DeletePolicy<T> {
  canDelete(record: T): boolean
}

type InferPolicy<R> =
  & R extends ListRepo<R>     ? ReadPolicy<R>   : never
  & R extends FindRepo<R>     ? ReadPolicy<R>   : never
  & R extends CreateRepo<R>   ? CreatePolicy<R> : never
  & R extends UpdateRepo<R>   ? EditPolicy<R> : never
  & R extends DeletePolicy<R> ? DeleteRepo<R>   : never
