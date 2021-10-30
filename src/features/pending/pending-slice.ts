import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { featureCollection, point } from "@turf/helpers";
import { firestore } from "../../api/firebase";
import { getApprovedMarkers } from "../../api/markers/markers-services";


export type PendingState = {
  markers: any,
  bikeLanes: any,
  currentRequestId: string | undefined,
  loading: string,
  error: any
}



export const fetchPendingBikeLane = createAsyncThunk(
  'pending/fetchPendingBikeLane',
  async (_, thunkApi) => {
    try {
      const bikelanes: any = []
      const result = await firestore
        .collection('bike_lanes')
        .where('isApproved', '==', false)
        .where('isRejected', '==', false)
        .get()

      result.forEach(marker => {
        bikelanes.push({
          ...marker.data(),
          id: marker.id
        })
      })

      return bikelanes;
    } catch(e) {
      return e
    }
  }
)

export const fetchPendingMarkers = createAsyncThunk(
  'pending/fetchPendingMarkers',
  async (_, thunkApi) => {
    try {
      const markers: any = []

      const result = await firestore
        .collection('map_markers')
        .where('isApproved', '==', false)
        .where('isRejected', '==', false)
        .get();

      result.forEach(marker => {
        markers.push({
          ...marker.data(),
          id: marker.id
        })
      })

      // console.log(markers)

      return markers;
    } catch(e) {
      return e
    }
  }
)

const initialState: PendingState = {
  bikeLanes: [],
  markers: [],
  currentRequestId: undefined,
  error: null,
  loading: "idle"
}

export const pendingSlice = createSlice({
  name: 'pending',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingMarkers.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = 'pending'
          state.currentRequestId = action.meta.requestId
        }
      })
      .addCase(fetchPendingMarkers.fulfilled, (state, action) => {
        const { requestId } = action.meta
        if (
          state.loading === 'pending' &&
          state.currentRequestId === requestId
        ) {
          state.loading = 'idle'
          state.markers = action.payload
          state.currentRequestId = undefined
        }
      })
      .addCase(fetchPendingMarkers.rejected, (state, action) => {
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

      // bike lane 
      .addCase(fetchPendingBikeLane.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = 'pending'
          state.currentRequestId = action.meta.requestId
        }
      })
      .addCase(fetchPendingBikeLane.fulfilled, (state, action) => {
        const { requestId } = action.meta
        if (
          state.loading === 'pending' &&
          state.currentRequestId === requestId
        ) {
          state.loading = 'idle'
          state.bikeLanes = action.payload
          state.currentRequestId = undefined
        }
      })
      .addCase(fetchPendingBikeLane.rejected, (state, action) => {
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