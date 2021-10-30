import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import ProfileFeedFullScreen from './profile/profile-feed-full-screen'
import ProfileFeedScreen from './profile/profile-feed-screen'

const Stack = createStackNavigator()

const ProfileStackScreen = () => {
  return (
    <Stack.Navigator screenOptions={{
      header: () => null
    }}>
      <Stack.Screen name="profile-feed" component={ProfileFeedScreen} />
      <Stack.Screen 
        name="profile-feed-full-screen"
        component={ProfileFeedFullScreen}
      />
    </Stack.Navigator>
  )
}

export default ProfileStackScreen