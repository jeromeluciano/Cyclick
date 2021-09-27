import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { featureCollection, point } from "@turf/helpers";
import { getApprovedMarkers } from "../../api/markers/markers-services";

export type MarkerType = {
  name: string,
  coordinate: [],
  type: string,
  isApproved: boolean,
}

export type MarkerState = {
  markers: any [] | null | undefined,
  currentRequestId: string | undefined,
  loading: string,
  error: any,
}

const initialState: MarkerState = {
  markers: null,
  currentRequestId: undefined,
  loading: 'idle',
  error: null
}

export const fetchApprovedMarkers = createAsyncThunk(
  'markers/fetchMarkers',
  async (_, thunkApi) => {
    try {
      const markers = await getApprovedMarkers()
      
      const transformedFeature: any[] = []

      markers.forEach((marker) => {
        const feature = point([marker.coordinate.longitude, marker.coordinate.latitude], {
          type: marker.type,
          name: marker.name
        })
        transformedFeature.push(feature)
      })

      const featureCollections = featureCollection(transformedFeature)

      return featureCollections
      // return markers
    } catch(e) {
      console.warn(e)
    }
  }
)

export const markerSlice = createSlice({
  name: 'markers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchApprovedMarkers.pending, (state, action) => {
        if (state.loading === 'idle') {
          state.loading = 'pending'
          state.currentRequestId = action.meta.requestId
        }
      })
      .addCase(fetchApprovedMarkers.fulfilled, (state, action) => {
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
      .addCase(fetchApprovedMarkers.rejected, (state, action) => {
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