import React from 'react'
import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const AccountScreen = () => {
  const { top } = useSafeAreaInsets()

  return (
    <View style={{ marginTop: top }}>
      <Text>AccountScreen</Text>
    </View>
  )
}

export default AccountScreen