import SessionUser from '@/models/SessionUser'
import { CreateRepo, DeleteRepo, FindRepo, ListRepo, ReadRepo, UpdateRepo } from '@/repos/Repo'

export class BasePolicy<_T> {
  constructor(protected readonly user: SessionUser | null) {
  }

  protected get isAdmin(): boolean {
    return this.user?.isAdmin ?? false
  }

  protected get hasUser(): boolean {
    return this.user !== null
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

export interface ListPolicy<_T> {
  canList(): boolean
}

export interface ReadPolicy<T> {
  canRead(record: T): boolean
}

export interface WritePolicy<T> extends CreatePolicy<T>, EditPolicy<T>, DeletePolicy<T> {}

export interface CreatePolicy<_T> {
  canCreate(): boolean
}

export interface EditPolicy<T> {
  canEdit(record: T): boolean
}

export interface DeletePolicy<T> {
  canDelete(record: T): boolean
}

export type InferPolicy<R> =
  & (R extends ListRepo<infer T>   ? ListPolicy<T>   : unknown)
  & (R extends FindRepo<infer T>   ? ReadPolicy<T>   : unknown)
  & (R extends CreateRepo<infer T> ? CreatePolicy<T> : unknown)
  & (R extends UpdateRepo<infer T> ? EditPolicy<T>   : unknown)
  & (R extends DeleteRepo<infer T> ? DeletePolicy<T> : unknown)

export const isListPolicy = <T>(policy: unknown): policy is ListPolicy<T> => (
  policy != null && (policy as ListPolicy<T>).canList !== undefined
)

export const isReadPolicy = <T>(policy: unknown): policy is ReadPolicy<T> => (
  policy != null && (policy as ReadPolicy<T>).canRead !== undefined
)

export const isCreatePolicy = <T>(policy: unknown): policy is CreatePolicy<T> => (
  policy != null && (policy as CreatePolicy<T>).canCreate !== undefined
)

export const isEditPolicy = <T>(policy: unknown): policy is EditPolicy<T> => (
  policy != null && (policy as EditPolicy<T>).canEdit !== undefined
)

export const isDeletePolicy = <T>(policy: unknown): policy is DeletePolicy<T> => (
  policy != null && (policy as DeletePolicy<T>).canDelete !== undefined
)
