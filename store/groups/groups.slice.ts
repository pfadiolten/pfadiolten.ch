import Group, { GroupId } from '@/models/Group'
import { allGroups } from '@/repos/GroupRepo'
import { createModelSelectors } from '@/store/utils/model-utils'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type GroupsSlice = Record<GroupId, Group>

export const groupsSlice = createSlice({
  name: 'users',
  initialState: (): GroupsSlice => {
    const state = {} as GroupsSlice
    for (const group of allGroups) {
      state[group.id] = group
    }
    return state
  },
  reducers: {
  },
})
export default groupsSlice.reducer

export const [selectGroups, selectGroup] = createModelSelectors('groups')
