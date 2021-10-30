import { getFocusedRouteNameFromRoute } from '@react-navigation/core'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { colors } from '../../../constants/colors'
import RepairGuideList, { RepairGuideCollectionItems } from '../repair-guide-screen'
import RepairGuideViewFullScreen from './repair-guide-view-fullscreen'

const Stack = createStackNavigator()

const RepairGuideStackScreen = ( ) => {
  return (
    <Stack.Navigator screenOptions={{
      // header: () => null
      headerStyle: {
        backgroundColor: colors.primary,
      },
      headerTitleStyle: {
        color: 'white'
      },
      cardStyle: {
        backgroundColor: '#f3f3f3'
      }
    }}>
      <Stack.Screen 
        name="Repair Guide"
        options={{
          header: () => null
        }}
        component={RepairGuideList}
      />

      <Stack.Screen 
        name="Repair Guide Articles"
        component={RepairGuideCollectionItems}
      />

      <Stack.Screen 
        name="Repair Guide View Full"
        component={RepairGuideViewFullScreen}
      />
  
    </Stack.Navigator>
  )
}

export default RepairGuideStackScreen