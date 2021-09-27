import { createSlice } from "@reduxjs/toolkit";
import firebase from 'firebase'

export type AuthState = {
  user: firebase.User | null,
}

const initialState: AuthState = {
  user: null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
    }
  }
})

export const {
  setUser
} = authSlice.actions



