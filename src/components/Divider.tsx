import React from 'react'
import { Text, View } from 'react-native'

export default () => {
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', alignSelf: 'center', width: '80%', marginVertical: 10}}>
      <View style={{flex: 1, height: 1, backgroundColor: '#e0e0e0'}} />
      <View>
        <Text style={{width: 25, textAlign: 'center', color: '#e0e0e0'}}>Or</Text>
      </View>
      <View style={{flex: 1, height: 1, backgroundColor: '#e0e0e0'}} />
    </View>
  )
}