import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import firebase from 'firebase'
import { getMyRecordedTracks } from "../../api/profile/track-feed-services";

export type AuthState = {
  tracks: any,
  loading: string,
  error: any,
  currentRequestId: undefined | string
}

const initialState: AuthState = {
  tracks: null,
  loading: 'idle',
  error: null,
  currentRequestId: undefined
}

export const getMyTracks = createAsyncThunk(
  'feed/getMyTracks',
  async (uid: string, thunkApi) => {
    if (!uid) return;
    const tracks = await getMyRecordedTracks(uid)
    return tracks;
  }
)

export const feedSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clean: (state) => {
      state.tracks = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getMyTracks.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = 'pending'
          state.currentRequestId = action.meta.requestId
        }
      })
      .addCase(getMyTracks.fulfilled, (state, action) => {
        const { requestId } = action.meta
        if (
          state.loading === 'pending' &&
          state.currentRequestId === requestId
        ) {
          state.loading = 'idle'
          state.tracks = action.payload
          state.currentRequestId = undefined
        }
      })
      .addCase(getMyTracks.rejected, (state, action) => {
        const { requestId } = action.meta
        if (
          state.loading === 'pending' &&
          state.currentRequestId === requestId
        ) {
          state.loading = 'idle'
          state.error = action.error
          state.currentRequestId = undefined
        }
      })
  }
})




