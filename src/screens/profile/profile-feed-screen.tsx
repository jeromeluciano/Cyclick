import { Box, Text } from 'native-base'
import React from 'react' 
import { Dimensions, Image, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import { isCurrentUserAdmin } from '../../api/auth/auth'
import TrackFeedViewList from '../../components/Profile/Feed/TrackFeedViewList'
import UserAvatarHeader from '../../components/Profile/UserAvatarHeader'
import UserProfile from '../../components/Profile/UserProfile'
import { getMyTracks } from '../../features/auth/feed-slice'
import { RootState } from '../../features/store'

const ProfileFeedScreen = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  // console.log(user?.photoURL)
  const auth = useSelector((state: RootState) => state.auth);
  const feed = useSelector((state: RootState) => state.feed)

  const dispatch = useDispatch()

  React.useEffect(() => {
    isCurrentUserAdmin().then(res => console.log(res, 'user is admin'))
    if (auth.user){
      // fetch recorded tracks of logged in user
      dispatch(getMyTracks(auth.user?.uid))
      if (feed.tracks) {
        console.log('auth trakcs', feed.tracks)
      }
      
    }
  }, [])

  return (
    <>
      {
        feed.tracks && feed.tracks.length == 0 ?
          (
            <Box  flex="1" justifyContent="center">
              <Box bg="white" m="5" borderRadius="10">
                <Text fontWeight="bold" letterSpacing="xl" textAlign="center" p="5">
                  There's nothing to show at the moment.
                </Text>
              </Box>
            </Box>
          )
          : 
          (
            <View style={styles.feedContainer}>
              <TrackFeedViewList />
            </View>
          )
      }
    </>
  )
}

const styles = StyleSheet.create({ 
  nothing: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleGray: {
    color: '#565657',
    fontSize: 17
  },
  feedContainer: {
    margin: 0
  }
})

export default ProfileFeedScreen