import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import TrackRecordingScreen from './tabs/track-recording-screen'
import TrackRecordingFormScreen from './tracks/track-recording-form-screen'

const Stack = createStackNavigator()

const TrackRecordingStackScreen = () => {
  return (
    <Stack.Navigator screenOptions={{
      header: () => null
    }}>
      <Stack.Screen name="recording" component={TrackRecordingScreen} />
      <Stack.Screen name="recording-form" component={TrackRecordingFormScreen} />
    </Stack.Navigator>
  )
}

export default TrackRecordingStackScreen