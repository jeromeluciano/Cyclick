import { AntDesign, FontAwesome } from '@expo/vector-icons';
import moment from 'moment';
import React from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../features/store';

const UserAvatarHeader = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const tracks = useSelector((state: RootState) => state.feed.tracks)

  

  return (
    <View style={{ marginTop: 15 }}>
      {/* Header */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <AntDesign name="user" size={80} color="black" />
        </View>
        <View>
          <Text style={styles.displayText}>
            {user?.displayName}
          </Text>
          <View style={{ marginTop: 5 }}>
            <Text style={styles.trackText}>Tracks: {tracks ? tracks.length:0}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: 'white',
    borderRadius: 100,
    padding: 15,
    marginRight:20
  },
  avatarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    alignSelf: 'center',
  },
  displayText: {
    fontSize: 25,
    marginTop: 15
  },
  trackText: {
    fontSize: 12,
    backgroundColor: 'white',
    alignSelf: 'baseline',
    padding: 5,
    borderRadius: 2,
    
  }
})

export default UserAvatarHeader;