import { configureStore } from '@reduxjs/toolkit'
import usersReducer from '@/store/users/users.slice'
import noticesReducer from '@/store/notices/notices.slice'
import calendarEventsReducer from '@/store/calendar/events/calendarEvents.slice'

const store = configureStore({
  reducer: {
    users: usersReducer,
    notices: noticesReducer,
    calendarEvents: calendarEventsReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    // TODO check if there's a way to store dates in the store.
    serializableCheck: false,
  }),
})
export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
