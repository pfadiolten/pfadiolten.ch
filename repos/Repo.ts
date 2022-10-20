import { Id, Model, ModelData } from '@pfadiolten/react-kit'

export type Repo<T> =
  | ReadRepo<T>
  | CreateRepo<T>
  | UpdateRepo<T>
  | DeleteRepo<T>

export interface ReadRepo<T> extends ListRepo<T>, FindRepo<T> {}

export interface ListRepo<T> {
  list(options?: ListOptions<T>): Promise<T[]>
}

export interface FindRepo<T> {
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

export const isListRepo = <T extends Model>(repo: unknown): repo is ListRepo<T> => {
  return repo != null
    && (repo as ListRepo<T>).list !== undefined
}

export const isFindRepo = <T extends Model>(repo: unknown): repo is FindRepo<T> => {
  return repo != null
    && (repo as FindRepo<T>).find !== undefined
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
