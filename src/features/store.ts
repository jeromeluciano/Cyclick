import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { permissionSlice } from "../screens/app/permission-slice";
import { authSlice } from "./auth/auth-slice";
import { feedSlice } from "./auth/feed-slice";
import { markerSlice } from "./navigation/markers-slice";
import { navigationSlice } from "./navigation/navigation-slice";
import { pendingSlice } from "./pending/pending-slice";
import { trackSlice } from "./tracks/track-slice";
import { bikelaneSlice } from './navigation/bike-lanes'

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    track: trackSlice.reducer,
    feed: feedSlice.reducer,
    navigation: navigationSlice.reducer,
    marker: markerSlice.reducer,
    permission: permissionSlice.reducer,
    pending: pendingSlice.reducer,
    bikelane: bikelaneSlice.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch