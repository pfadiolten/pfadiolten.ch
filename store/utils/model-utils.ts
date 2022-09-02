import Id from '@/models/base/Id'
import { RootState } from '@/store'

export const createModelSelectors = <K extends keyof ModelSelectorKeys>(key: K) => {
  const selectAll = (state: RootState): ModelSelectorKeys[K][] => Object.values(state[key] as Record<Id<ModelSelectorKeys[K]>, ModelSelectorKeys[K]>)
  const selectOne = (id: Id<ModelSelectorKeys[K]> | null) => (state: RootState) => (id === null ? null : (state.users[id] ?? null)) as ModelSelectorKeys[K] | null
  return [selectAll, selectOne] as const
}

type ModelSelectorKeys = {
  [K in keyof RootState]:
    RootState[K] extends Record<Id<infer TModel>, infer TModel>
      ? TModel
      : never
}
