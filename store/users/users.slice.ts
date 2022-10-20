import User from '@/models/User'
import { createModelSelectors } from '@/store/utils/model-utils'
import { Id } from '@pfadiolten/react-kit'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type UsersState = Record<Id<User>, User>

export const usersSlice = createSlice({
  name: 'users',
  initialState: (): UsersState => ({}),
  reducers: {
    saveUser(state, action: PayloadAction<User>) {
      state[action.payload.id] = action.payload
    },
    saveUsers(state, action: PayloadAction<Iterable<User>>) {
      for (const user of action.payload) {
        usersSlice.caseReducers.saveUser(state, { ...action, payload: user })
      }
    },
  },
})

export const { saveUser, saveUsers } = usersSlice.actions
export default usersSlice.reducer

export const [selectUsers, selectUser] = createModelSelectors('users')
