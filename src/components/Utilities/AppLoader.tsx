import React from 'react'
import { StyleSheet, View } from 'react-native'
import { ActivityIndicator } from 'react-native-paper'

export default () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={"gray"} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center'
  }
})