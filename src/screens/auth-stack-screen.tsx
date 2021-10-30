import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { colors } from '../constants/colors'
import AuthForgotPassword from './auth/auth-forgot-password-screen'
import AuthSignIn from './auth/auth-signin-screen'
import AuthSignUp from './auth/auth-signup-screen'

const Stack = createStackNavigator()

const AuthStackScreen = () => {
  return (
    <Stack.Navigator screenOptions={{
      // header: () => null, 
      cardStyle: {
        backgroundColor: 'white'
      }
    }}>
      <Stack.Screen 
        name={"auth-signin"} 
        component={AuthSignIn}
        options={{
          header: () => null
        }}
      />
      <Stack.Screen 
        name={"auth-signup"} 
        component={AuthSignUp} 
        options={{
          header: () => null
        }}
      />
      <Stack.Screen 
        name={"auth-forgot-password"} 
        component={AuthForgotPassword} 
        options={{
          headerTitle:'',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: 'white'
        }}
      />
    </Stack.Navigator>
  )
}

export default AuthStackScreen