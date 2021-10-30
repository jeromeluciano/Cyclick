import { Point } from "@react-native-mapbox-gl/maps";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { lineString } from "@turf/helpers";
import firebase from 'firebase'
import { directions } from "../../api/mapbox/directions";
import { RootState } from "../store";

export type LngLat = [number, number]

export type NavigationState = {
  searchBarState: boolean,
  shape: any, // geojson polyline data
  endpoint: LngLat | null,
  startpoint: LngLat | null,
  currentRequestId: string | undefined,
  loading: string,
  error: any,
  isNavigating: boolean
}

const initialState: NavigationState = {
  searchBarState: false,
  shape: null,
  endpoint: null,
  startpoint: null,
  currentRequestId: undefined,
  loading: 'idle',
  error: null,
  isNavigating: false
}

export const fetchDirections = createAsyncThunk(
  'navigation/fetchDirections',
  //@ts-ignore
  async (_, thunkApi) => {
    const state = thunkApi.getState();

    try {
      // @ts-ignore
      if (state.navigation.startpoint && state.navigation.endpoint) {
        const directionResult = await directions.getDirections({
          profile: 'cycling',
          waypoints: [
            {
              // @ts-ignore
              coordinates: state.navigation.startpoint
            },
            {
              // @ts-ignore
              coordinates: state.navigation.endpoint
            },
          ],
          geometries: 'geojson'
        })
        .send()
        let line = lineString(directionResult.body.routes[0].geometry.coordinates)
        console.log('fetch directions from firebase')
        return line
      }
    } catch (e) {
      console.log(e)
    }
  }
)

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setEndpoint: (state, action) => {
      state.endpoint = action.payload
    },
    setStartpoint: (state, action) => {
      state.startpoint = action.payload
    },
    openSearchBar: (state) => {
      state.searchBarState = true
    },
    closeSearchBar: (state) => {
      state.searchBarState = false
    },
    startNavigating: (state) => {
      state.isNavigating = true
    },
    stopNavigating: (state) => {
      state.isNavigating = false
    },
    resetNavigation: (state) => {
      state.endpoint = null
      state.shape = null
    },
    // removeMarker: (state) => {
    //   state.endpoint = null
    // }
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchDirections.pending, (state, action) => {
      if (state.loading === 'idle') {
        state.loading = 'pending'
        state.currentRequestId = action.meta.requestId
      }
    })
    .addCase(fetchDirections.fulfilled, (state, action) => {
      const { requestId } = action.meta
      if (
        state.loading === 'pending' &&
        state.currentRequestId === requestId
      ) {
        state.loading = 'idle'
        state.shape = action.payload
        state.currentRequestId = undefined
      }
    })
    .addCase(fetchDirections.rejected, (state, action) => {
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
  setEndpoint,
  setStartpoint,
  closeSearchBar,
  openSearchBar,
  startNavigating,
  stopNavigating,
  resetNavigation
} = navigationSlice.actions



