import Id from '@/models/base/Id'
import { ModelData } from '@/models/base/Model'
import CalendarEvent from '@/models/CalendarEvent'
import FetchService from '@/services/FetchService'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { WritableDraft } from 'immer/src/types/types-external'

type CalendarEventState = CalendarEvent[]

export const calendarEventsSlice = createSlice({
  name: 'users',
  initialState: (): CalendarEventState => [],
  reducers: {
    saveCalendarEvents(state, action: PayloadAction<Iterable<CalendarEvent>>): void {
      for (const event of action.payload) {
        calendarEventsSlice.caseReducers.saveCalendarEvent(state, { ...action, payload: event })
      }
    },
    saveCalendarEvent(state, action: PayloadAction<CalendarEvent>): void {
      const oldIndex = state.findIndex(({ id }) => id === action.payload.id)
      const newIndex = findInsertionIndex(state, action.payload)
      if (oldIndex === newIndex) {
        state[newIndex] = action.payload
        return
      }
      if (oldIndex !== -1) {
        state.splice(oldIndex, 1)
      }
      state.splice(newIndex, 0, action.payload)
    },
  },
  extraReducers(builder) {
    builder.addCase(createCalendarEvent.fulfilled, (state, action) => {
      calendarEventsSlice.caseReducers.saveCalendarEvent(state, action)
    })
    builder.addCase(updateCalendarEvent.fulfilled, (state, action) => {
      calendarEventsSlice.caseReducers.saveCalendarEvent(state, action)
    })
    builder.addCase(deleteCalendarEvent.fulfilled, (state, action) => {
      const deleteIndex = state.findIndex(({ id }) => id === action.payload)
      if (deleteIndex !== -1) {
        state.splice(deleteIndex, 1)
      }
    })
  },
})

export const { saveCalendarEvents, saveCalendarEvent } = calendarEventsSlice.actions
export default calendarEventsSlice.reducer

const findInsertionIndex = (state: WritableDraft<CalendarEvent>[], event: CalendarEvent): number => {
  const i = state.findIndex(({ startsAt, endsAt }) => (
    startsAt.isLessThanOrEqualTo(event.startsAt) && endsAt.isGreaterThanOrEqualTo(event.endsAt)
  ))
  return Math.max(i, 0)
}

export const createCalendarEvent = createAsyncThunk('calendarEvents/createCalendarEvent', async (data: ModelData<CalendarEvent>): Promise<CalendarEvent> => {
  const [event, error] = await FetchService.post<CalendarEvent>('calendar/events', data)
  if (error !== null) {
    throw error
  }
  return event
})

export const updateCalendarEvent = createAsyncThunk('calendarEvents/updateCalendarEvent', async (payload: { id: Id<CalendarEvent>, data: ModelData<CalendarEvent> }): Promise<CalendarEvent> => {
  const [event, error] = await FetchService.put<CalendarEvent>(`calendar/events/${payload.id}`, payload.data)
  if (error !== null) {
    throw error
  }
  return event
})

export const deleteCalendarEvent = createAsyncThunk('calendarEvents/deleteCalendarEvent', async (id: Id<CalendarEvent>): Promise<Id<CalendarEvent>> => {
  const error = await FetchService.delete(`calendar/events/${id}`)
  if (error !== null) {
    throw error
  }
  return id
})
