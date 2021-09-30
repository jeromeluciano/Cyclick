import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { enableNetworkProviderAsync, hasServicesEnabledAsync } from "expo-location"

export type AppPermission = {
  networkStatus: boolean,
  loading: string,
  currentRequestId: string | undefined,
  error: any
}

export const initialState: AppPermission = {
  networkStatus: false,
  loading: 'idle',
  currentRequestId: undefined,
  error: null
}

export const resolveGpsNetwork = createAsyncThunk(
  'permission/resolveGpsNetwork',
  // @ts-ignore
  async (_, thunkApi) => {
    // const state = thunkApi.getState()

    const serviceStatus = await hasServicesEnabledAsync()

    return serviceStatus;
  }
)



export const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    setNetworkStatus: (state, action) => {
      state.networkStatus = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(resolveGpsNetwork.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = 'pending'
          state.currentRequestId = action.meta.requestId
        }
      })
      .addCase(resolveGpsNetwork.fulfilled, (state, action) => {
        const { requestId } = action.meta
        if (
          state.loading === 'pending' &&
          state.currentRequestId === requestId
        ) {
          state.loading = 'idle'
          // @ts-ignore
          state.networkStatus = action.payload
          state.currentRequestId = undefined
        }
      })
      .addCase(resolveGpsNetwork.rejected, (state, action) => {
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

export const {
  setNetworkStatus
} = permissionSlice.actions