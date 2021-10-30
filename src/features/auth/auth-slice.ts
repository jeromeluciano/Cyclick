import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import firebase from 'firebase'
import { getMyRecordedTracks } from "../../api/profile/track-feed-services";

export type AuthState = {
  user: firebase.User | null,
  tracks: any,
  error: any,
  loading: string,
  currentRequestId: string | undefined
}

const initialState: AuthState = {
  user: null,
  tracks: undefined,
  error: null,
  loading: 'idle',
  currentRequestId: undefined
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    },
  }
})

export const {
  setUser
} = authSlice.actions



