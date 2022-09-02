import Id from '@/models/base/Id'
import { ModelData } from '@/models/base/Model'
import Notice from '@/models/Notice'
import FetchService from '@/services/FetchService'
import { RootState } from '@/store'
import { createModelSelectors } from '@/store/utils/model-utils'
import DateHelper from '@/utils/helpers/DateHelper'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

type NoticesState = Record<Id<Notice>, Notice>

export const noticesSlice = createSlice({
  name: 'users',
  initialState: (): NoticesState => ({}),
  reducers: {
    saveNotice(state, action: PayloadAction<Notice>) {
      state[action.payload.id] = action.payload
    },
    saveNotices(state, action: PayloadAction<Iterable<Notice>>) {
      for (const notice of action.payload) {
        state[notice.id] = notice
      }
    },
  },
  extraReducers(builder) {
    builder.addCase(createNotice.fulfilled, (state, action) => {
      state[action.payload.id] = action.payload
    })
    builder.addCase(updateNotice.fulfilled, (state, action) => {
      state[action.payload.id] = action.payload
    })
    builder.addCase(deleteNotice.fulfilled, (state, action) => {
      delete state[action.payload]
    })
  },
})

export const { saveNotice, saveNotices } = noticesSlice.actions
export default noticesSlice.reducer

export const [selectNotices, selectNotice] = createModelSelectors('notices')

export const selectActiveNotices = (state: RootState): Notice[] => {
  const today = DateHelper.getToday()
  return selectNotices(state).filter((notice) => {
    const endsAtDay = DateHelper.getToday(notice.endsAt)
    return endsAtDay >= today
  })
}

export const createNotice = createAsyncThunk('notices/createNotice', async (data: ModelData<Notice>): Promise<Notice> => {
  const [notice, error] = await FetchService.post<Notice>('notices', data)
  if (error !== null) {
    throw error
  }
  return notice
})

export const updateNotice = createAsyncThunk('notices/updateNotice', async (payload: { id: Id<Notice>, data: ModelData<Notice> }): Promise<Notice> => {
  const [notice, error] = await FetchService.put<Notice>(`notices/${payload.id}`, payload.data)
  if (error !== null) {
    throw error
  }
  return notice
})

export const deleteNotice = createAsyncThunk('notices/deleteNotice', async (id: Id<Notice>): Promise<Id<Notice>> => {
  const error = await FetchService.delete(`notices/${id}`)
  if (error !== null) {
    throw error
  }
  return id
})
