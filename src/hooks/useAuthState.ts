import React, {
  useEffect,
  useState
} from 'react'
import { auth } from '../api/firebase'
import firebase from 'firebase'
import { useDispatch } from 'react-redux'
import { setUser } from '../features/auth/auth-slice'

export default () => {
  const dispatch = useDispatch()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUser(user))
      } else {
        dispatch(setUser(null))
      }
    })

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

}