import { StatusBar } from 'native-base'
import React, {
  useEffect
} from 'react'
import { View } from 'react-native'
// import { ScrollView } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import { getMyTracks } from '../../../features/auth/feed-slice'
import { RootState } from '../../../features/store'
import UserAvatarHeader from '../UserAvatarHeader'
import TrackFeedView from './TrackFeedView'
import {
  ScrollView
} from 'native-base'

export default () => {
  // fetch data -> transform to feature collection -> array of feature collection
  const feed = useSelector((state: RootState) => state.feed)
  const auth = useSelector((state: RootState) => state.auth)

  const dispatch = useDispatch()

  useEffect(() => {
    if (auth.user){
      // fetch recorded tracks of logged in user
      dispatch(getMyTracks(auth.user?.uid))
      if (feed.tracks) {
        console.log('auth trakcs', feed.tracks)
      }
      
    }
  }, [])

  return (
    <ScrollView keyboardShouldPersistTaps='always'>
       <StatusBar/>
      {/* <UserAvatarHeader /> */}
      
      {
        feed.tracks != null ?
        // @ts-ignore
        feed.tracks.map((track) => <TrackFeedView key={track.id} track={track}/>):null
      }
    </ScrollView>
  )
}