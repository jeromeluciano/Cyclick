import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/core'
import { createStackNavigator } from '@react-navigation/stack'
import { Box, Pressable } from 'native-base'
import React from 'react'
import { colors } from '../constants/colors'
import TrackRecordingScreen from './tabs/track-recording-screen'
import TrackRecordingFormScreen from './tracks/track-recording-form-screen'

const Stack = createStackNavigator()

const TrackRecordingStackScreen = () => {

  const navigation = useNavigation()
  
  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    }
  }

  return (
    <Stack.Navigator screenOptions={{
      // header: () => null,
    }}>
      <Stack.Screen name="recording" component={TrackRecordingScreen} 
        options={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTitleStyle: {
            color: 'white'
          },
          headerTitle: 'Track Recording',
          headerLeft: () => {
            return (
              <Pressable onPress={handleGoBack}>
                {({ isPressed }) => {
                  return (
                    <Box pl="4">
                      <Ionicons name="arrow-back" size={24} color={isPressed ? colors.secondary : 'white'} />
                    </Box>
                  )
                }}
              </Pressable>
            )
          }
        }}
      />
      <Stack.Screen 
      name="track-recording-form" 
      component={TrackRecordingFormScreen} 
      options={{
        headerStyle: {
          backgroundColor: colors.primary
        },
        headerTitleStyle: {
          color: 'white'
        },
        headerLeft: () => {
          return (
            <Pressable onPress={() => navigation.navigate('recording')}>
              {({ isPressed }) => {
                return (
                  <Box pl="4">
                    <Ionicons name="arrow-back" size={24} color={isPressed ? colors.secondary : 'white'} />
                  </Box>
                )
              }}
            </Pressable>
          )
        }
      }}
      />
    </Stack.Navigator>
  )
}

export default TrackRecordingStackScreen