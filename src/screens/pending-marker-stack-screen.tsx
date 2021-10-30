import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { colors } from '../constants/colors'
import PendingBikeLaneFullScreenView from './admin/pending-bikelane-fullscreen-screen'
import PendingMarkerFullScreenView from './admin/pending-marker-fullscreen-screen'
// import PendingMarkerSoloScreen from './admin/pending-marker-fullscreen-screen'
import PendingMarkersScreen from './admin/pending-markers-screen'
import TrafficCategoryView from './guide/Components/TrafficCategoryView'
import CyclingCategoryScreen from './guide/cycling-category-screen'
import RoadTrafficScreen from './guide/road-traffic-screen'

const PendingMarkerStackScreen = () => {

  const Stack = createStackNavigator()

  return (
    <Stack.Navigator screenOptions={{
      // header: () => null
      headerStyle: {
        backgroundColor: colors.primary,
      },
      header: () => null
    }}>
        <Stack.Screen 
          name="pending-markers" 
          component={PendingMarkersScreen}
        />

        <Stack.Screen 
          name="pending-markers-fullscreen"  
          component={PendingMarkerFullScreenView}
        />

        <Stack.Screen 
          name="pending-bikelane-fullscreen"  
          component={PendingBikeLaneFullScreenView}
        />


        {/* <Stack.Screen name="pending-bikelane-view"  component={PendingMarkersScreen}/> */}
    </Stack.Navigator>
  )
}

export default PendingMarkerStackScreen