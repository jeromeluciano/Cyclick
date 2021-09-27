import React from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const CycleGuideScreen = () => {
  const { top } = useSafeAreaInsets()

  return (
    <View style={{ marginTop: top }}>
      <Text>CycleGuideScreen</Text>
    </View>
  )
}

export default CycleGuideScreen