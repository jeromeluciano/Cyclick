import { createSlice } from '@reduxjs/toolkit'

export type DeviceState = {
  isNetworkReachable: boolean
}

const initialState: DeviceState = {
  isNetworkReachable: false
}


export const deviceSlice = createSlice({
  name: 'device',
  initialState,
  reducers: {
    setNetworkStatus: (state, action) => {
      state.isNetworkReachable = action.payload
    }
  }
})

export const {
  setNetworkStatus
} = deviceSlice.actions  