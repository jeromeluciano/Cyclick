import React from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const ExploreScreen = () => {
  const { top } = useSafeAreaInsets()

  return (
    <View style={{ marginTop: top }}>
      <Text>Explore screen</Text>
    </View>
  )
}

export default ExploreScreen