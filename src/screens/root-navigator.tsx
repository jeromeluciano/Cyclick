import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../features/store'
import useAuthState from '../hooks/useAuthState'
import AuthStackScreen from './auth-stack-screen'
import RootTabScreen from './root-tab-screen'

const RootNavigator = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  useAuthState()

  return (
    <>
      {
        user ? <RootTabScreen /> : <AuthStackScreen />
      }
    </>
  )
}

export default RootNavigator