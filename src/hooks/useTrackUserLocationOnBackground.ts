import { Accuracy, hasStartedLocationUpdatesAsync, requestBackgroundPermissionsAsync, requestForegroundPermissionsAsync, startLocationUpdatesAsync, stopLocationUpdatesAsync } from 'expo-location'
import React, {
  useEffect
} from 'react'

export const RECORD_LOCATION_ON_BACKGROUND = 'RECORD_LOCATION_ON_BACKGROUND'

export default () => {

  const start = async () => {
    // const { granted } = await requestForegroundPermissionsAsync()
    const foreground = await requestForegroundPermissionsAsync()
    const { granted } = await requestBackgroundPermissionsAsync()
    const locationServices = await hasStartedLocationUpdatesAsync(RECORD_LOCATION_ON_BACKGROUND)

    // check if the permission is granted

    // set the state as recording if location services started
    

    if (!locationServices) {
      if (granted) {
        await startLocationUpdatesAsync(RECORD_LOCATION_ON_BACKGROUND, {
          accuracy: Accuracy.BestForNavigation,
          // timeInterval: 1000,
          distanceInterval: 5, // minimum change (in meters) betweens updates
          deferredUpdatesInterval: 15000, // minimum interval (in milliseconds) between updates
          // foregroundService is how you get the task to be updated as often as would be if the app was open
          foregroundService: {
            notificationTitle: 'Using your location',
            notificationBody: 'To turn off, go back to the app and switch something off.',
          },
        })
      }
    }
  }

  const stop = async () => {
    const locationServices = await hasStartedLocationUpdatesAsync(RECORD_LOCATION_ON_BACKGROUND)

    if (locationServices) {
      stopLocationUpdatesAsync(RECORD_LOCATION_ON_BACKGROUND)
    }
  }

  return [start, stop]
}