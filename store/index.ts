import { configureStore } from '@reduxjs/toolkit'
import groupsReducer from '@/store/groups/groups.slice'
import usersReducer from '@/store/users/users.slice'

const store = configureStore({
  reducer: {
    users: usersReducer,
    groups: groupsReducer,
  },
})
export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
