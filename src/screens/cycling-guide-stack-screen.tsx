import { getFocusedRouteNameFromRoute } from '@react-navigation/core'
import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { colors } from '../constants/colors'
import RepairGuideView from './guide/Components/RepairGuideView'
import TrafficCategoryView from './guide/Components/TrafficCategoryView'
import CyclingCategoryScreen from './guide/cycling-category-screen'
import HandSignalScreen from './guide/hand-signals/HandSignalScreen'
import RepairGuideList from './guide/repair-guide-screen'
import RepairGuideStackScreen from './guide/repair-guide/repair-guide-stack-screen'
import RoadTrafficScreen from './guide/road-traffic-screen'

const CyclingGuideStackScreen = () => {

  const Stack = createStackNavigator()

  return (
    <Stack.Navigator screenOptions={{
      // header: () => null
      headerStyle: {
        backgroundColor: colors.primary,
      },
      
    }}>
      <Stack.Screen name="cycling-categories" component={CyclingCategoryScreen} options={{
        header: () => null
      }}/>
      <Stack.Screen 
        name="traffic-sign-lists" 
        component={RoadTrafficScreen} 
        options={{
          title: "Road Traffic Signs",
          headerTintColor: "white"
        }}
      />

      <Stack.Screen 
        name="traffic-category-view" 
        component={TrafficCategoryView} 
        options={{
          // title: "Road Traffic Signs",
          headerTintColor: "white"
        }}
      />

      <Stack.Screen 
        name="repair-guide-lists" 
        component={RepairGuideStackScreen} 
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route)
          console.log(routeName)
          if (routeName == "Repair Guide Articles" || routeName == "Repair Guide View Full") {
            return {
              header: () => null
            }
          }
          return {
            title: "Repair Guide",
            headerTintColor: "white"
          }
        }}
      />

      <Stack.Screen 
        name="repair-guide-view" 
        component={RepairGuideView} 
        options={{
          // title: "Maintenance Guide",
          headerTintColor: "white"
        }}
      />    
      
      <Stack.Screen 
        name="hand-signal-view"
        component={HandSignalScreen}
        options={{
          headerTintColor: 'white'
        }}
      />
      
    </Stack.Navigator>
  )
}

export default CyclingGuideStackScreen