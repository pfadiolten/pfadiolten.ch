import Id from '@/models/base/Id'
import LocalDate from '@/models/base/LocalDate'
import { ModelData } from '@/models/base/Model'
import CalendarEvent from '@/models/CalendarEvent'
import FetchService from '@/services/FetchService'
import { RootState } from '@/store'
import { run } from '@/utils/control-flow'
import { createKeyedInMemoryCache } from '@/utils/InMemoryCache'
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
    builder.addCase(fetchCalendarEvents.fulfilled, (state, action) => {
      if (action.payload === null) {
        return
      }
      calendarEventsSlice.caseReducers.saveCalendarEvents(state, { ...action, payload: action.payload })
    })
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

interface SelectCalendarEventsPayload {
  startsAt?: LocalDate
  endsAt?: LocalDate
}

const findInsertionIndex = (state: WritableDraft<CalendarEvent>[], event: CalendarEvent): number => {
  for (let i = state.length - 1; i >= 0; i--) {
    const { id, startsAt } = state[i]
    if (id !== event.id && startsAt <= event.startsAt) {
      return i + 1
    }
  }
  return 0
}

export const selectCalendarEvents = ({ startsAt, endsAt }: SelectCalendarEventsPayload = {}) => (state: RootState): CalendarEvent[] => {
  if (startsAt === undefined && endsAt === undefined) {
    return state.calendarEvents
  }
  console.log('')
  console.log({ startsAt: startsAt === undefined ? undefined : LocalDate.toDate(startsAt), endsAt: endsAt === undefined ? undefined : LocalDate.toDate(endsAt) })
  return state.calendarEvents.filter((event) => {
    const isStartValid = startsAt === undefined || (event.startsAt >= startsAt && (endsAt === undefined || event.startsAt <= endsAt))
    const isEndValid = endsAt === undefined || (event.endsAt <= endsAt && (startsAt === undefined || event.endsAt >= startsAt))
    console.log(event.name, { isStartValid, isEndValid })
    return isStartValid || isEndValid
  })
}


export const fetchCalendarEvents = createAsyncThunk('calendarEvents/fetchCalendarEvents', async (payload: SelectCalendarEventsPayload = {}): Promise<CalendarEvent[] | null> => {
  const rangeKey = `${payload.startsAt}-${payload.endsAt}`
  if (fetchedRanges.has(rangeKey)) {
    return null
  }
  fetchedRanges.add(rangeKey)

  const [events, error] = await FetchService.get<CalendarEvent[]>('calendar/events', {
    params: {
      startsAt: payload.startsAt?.toString(),
      endsAt: payload.endsAt?.toString(),
    },
  })
  if (error !== null) {
    throw error
  }
  return events
})

const fetchedRanges = new Set<string>()

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
