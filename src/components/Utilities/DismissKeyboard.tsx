import React from 'react'
import { Keyboard } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

// @ts-ignore
export default ({ children }) => (
  <TouchableWithoutFeedback onPress={() => {
    Keyboard.dismiss()
    console.log('dismissed keyboard')
  }}>
    { children }
  </TouchableWithoutFeedback>
)