import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import AuthSignIn from './auth/auth-signin-screen'
import AuthSignUp from './auth/auth-signup-screen'

const Stack = createStackNavigator()

const AuthStackScreen = () => {
  return (
    <Stack.Navigator screenOptions={{
      header: () => null
    }}>
      <Stack.Screen name={"auth-signin"} component={AuthSignIn} />
      <Stack.Screen name={"auth-signup"} component={AuthSignUp} />
    </Stack.Navigator>
  )
}

export default AuthStackScreen