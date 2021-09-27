import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import NavigationTrackingScreen from './navigation/navigation-tracking-screen'
import NavigationScreen from './tabs/navigation-screen'


const Stack = createStackNavigator()

const NavigationStackScreen = () => {
  return (
    <Stack.Navigator screenOptions={{
      header: () => null
    }}>
      <Stack.Screen name="navigation-main" component={NavigationScreen} />
      <Stack.Screen name="navigation-tracking" component={NavigationTrackingScreen} />
    </Stack.Navigator>
  )
}

export default NavigationStackScreen