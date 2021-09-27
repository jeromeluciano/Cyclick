import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LocationObject } from 'expo-location'
import React from 'react'

export type TrackState = {
  name: string,
  recording: RecordingState,
  coordinates: LocationObject[],
  duration: number
}

export type RecordingState = "idle" | "recording" | "pause"

const initialState: TrackState = {
  name: '',
  recording: "idle",
  coordinates: [],
  duration: 0
}

export const trackSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {
    setName: (state, action) => {
      state.name = action.payload
    },
    startRecording: (state) => void (state.recording = "recording"),
    stopRecording: (state) => void (state.recording = "idle"),
    pauseRecording: (state) => void (state.recording = "pause"),
    addLocation: (state, action: PayloadAction<LocationObject>) => {
      state.coordinates.push(action.payload)
    },
    incrementDuration: (state) => {
      if (state.recording) {
        state.duration += 1
      }
    },
    reset: (state) => {
      state.name = '',
      state.coordinates = [],
      state.recording = "idle",
      state.duration = 0
    }
  }
})

export const {
  addLocation,
  reset,
  setName,
  startRecording,
  stopRecording,
  incrementDuration,
  pauseRecording
} = trackSlice.actions  