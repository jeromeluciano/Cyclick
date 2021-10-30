import React, {
  useEffect
} from 'react'
import {
  auth
} from '../../api/firebase'


const Logout = () => {
  useEffect(() => {
    auth.signOut()
  }, [])

  return null
}

export default Logout;