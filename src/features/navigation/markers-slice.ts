import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getApprovedMarkers } from "../../api/markers/markers-services";

export type MarkerType = {
  name: string,
  coordinate: [],
  type: string,
  isApproved: boolean,
}

export type MarkerState = {
  markers: MarkerType []
}

const initialState: MarkerState = {
  markers: []
}

export const fetchApprovedMarkers = createAsyncThunk(
  'markers/fetchMarkers',
  async (_, thunkApi) => {
    const markers = await getApprovedMarkers()
    markers.forEach(marker => console.log(marker.data()))
  }
)

const markerSlice = createSlice({
  name: 'markers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {

  }
})