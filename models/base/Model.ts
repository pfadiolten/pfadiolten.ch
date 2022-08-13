import Id, { isId } from './Id'

export default interface Model {
  id: Id<this>
}

export type ModelData<M> = Omit<M, 'id'>

export const isModel = (value: unknown): value is Model => {
  const model = value as Model
  return model != null && isId(model.id)
}
