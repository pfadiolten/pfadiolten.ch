import Id from '@/models/base/Id'
import Model, { ModelData } from '@/models/base/Model'

export type Repo<T> =
  | ReadRepo<T>
  | CreateRepo<T>
  | UpdateRepo<T>
  | DeleteRepo<T>

export interface ReadRepo<T> {
  list(options?: ListOptions<T>): Promise<T[]>
  find(id: Id<T>): Promise<T | null>
}

export interface CreateRepo<T> {
  create(data: ModelData<T>): Promise<T>
}

export interface UpdateRepo<T> {
  update(id: Id<T>, data: ModelData<T>): Promise<T | null>
}

export interface DeleteRepo<T> {
  delete(id: Id<T>): Promise<boolean>
}

export interface ListOptions<_T> {
  limit?: number | null
}


export const isReadRepo = <T extends Model>(repo: unknown): repo is ReadRepo<T> => {
  return repo != null
    && (repo as ReadRepo<T>).list !== undefined
    && (repo as ReadRepo<T>).find !== undefined
}

export const isCreateRepo = <T extends Model>(repo: unknown): repo is CreateRepo<T> => {
  return repo != null
    && (repo as CreateRepo<T>).create !== undefined
}

export const isUpdateRepo = <T extends Model>(repo: unknown): repo is UpdateRepo<T> => {
  return repo != null
    && (repo as UpdateRepo<T>).update !== undefined
}

export const isDeleteRepo = <T extends Model>(repo: unknown): repo is DeleteRepo<T> => {
  return repo != null
    && (repo as DeleteRepo<T>).delete !== undefined
}
