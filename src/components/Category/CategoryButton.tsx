import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

export default ({ title, color, icon }) => {

  const content = ( 
    <View style={[styles.button, { backgroundColor: color }]}>
        <View>
          { 
            icon ? icon : null
          }
        </View>

        <View>
          <Text style={[styles.text, icon ? { marginLeft: 10 } : null]}> {title} </Text>
        </View>
    </View>
  )

  return (
    <TouchableOpacity style={{ width: '100%' }}>
      { content }
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 5,
    width: '100%',
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center'
  },
  text: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center'
  }
})
