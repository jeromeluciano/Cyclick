import { FontAwesome } from '@expo/vector-icons'
import React from 'react'
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../../features/store'

// @ts-ignore
export default () => {
  const user = useSelector((state: RootState) => state.auth.user)
  // console.log(user)
  return (
    <View>
        <View style={styles.profileIcon}>
          {
            !user?.photoURL ?
              <Image 
                style={{
                  width: 80,
                  height: 80
                }}
                source={{
                  uri: user?.photoURL,
                }} 
              /> : 
              <FontAwesome name="user-circle" size={40} color="#838383" />
          }
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  profileIcon: {
    marginRight: 15
  }
})