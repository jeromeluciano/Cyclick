import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import firebase from "firebase";
import { LatLng } from "react-native-maps";
import {
  firestore
} from '../../api/firebase'


export type BikeLaneState = {
  bikelanes: [],
  currentRequestId: undefined | string,
  loading: any,
  error: any
}

export const BIKE_LANE = 'bike_lanes'

export const getApprovedBikeLanes = createAsyncThunk(
  'bikelane/getApprovedBikeLanes',
  async (_, thunkApi) => {
  const bikelanes: any = []
  try {
    const result = await firestore
      .collection(BIKE_LANE)
      .where('isApproved', '==', true)
      .get();

    result.docs.forEach(doc => {
      bikelanes.push({
        ...doc.data(),
        id: doc.id,
      })
    })

    return bikelanes
  } catch(e: any) {
    throw Error(e)
  }
})

const initialState: BikeLaneState = {
  bikelanes: [],
  loading: 'idle',
  currentRequestId: undefined,
  error: null
}

export const bikelaneSlice = createSlice({
  name: 'bikelane',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
    .addCase(getApprovedBikeLanes.pending, (state, action) => {
      if (state.loading === 'idle') {
        state.loading = 'pending'
        state.currentRequestId = action.meta.requestId
      }
    })
    .addCase(getApprovedBikeLanes.fulfilled, (state, action) => {
      const { requestId } = action.meta
      if (
        state.loading === 'pending' &&
        state.currentRequestId === requestId
      ) {
        state.loading = 'idle'
        state.bikelanes = action.payload
        state.currentRequestId = undefined
      }
    })
    .addCase(getApprovedBikeLanes.rejected, (state, action) => {
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


