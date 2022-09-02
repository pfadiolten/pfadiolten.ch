import Id from '@/models/base/Id'
import Model from '@/models/base/Model'
import User from '@/models/User'
import { RootState } from '@/store'
import { Reducer } from 'react'
import { AnyAction } from 'redux'

export const createModelSelectors = <K extends keyof ModelSelectorKeys>(key: K) => {
  const selectAll = (state: RootState) => Object.values(state[key]) as ModelSelectorKeys[K][]
  const selectOne = (id: Id<ModelSelectorKeys[K]> | null) => (state: RootState) => (id === null ? null : (state.users[id] ?? null)) as ModelSelectorKeys[K] | null
  return [selectAll, selectOne] as const
}

type ModelSelectorKeys = {
  [K in keyof RootState]:
    RootState[K] extends Record<Id<infer TModel>, infer TModel>
      ? TModel
      : never
}
