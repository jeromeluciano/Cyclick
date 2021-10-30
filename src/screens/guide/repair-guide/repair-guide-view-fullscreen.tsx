import React, {
  useEffect
} from 'react'
import {
  Box,
  Text,
  ScrollView
} from 'native-base'
import RenderHTML from 'react-native-render-html'
import { useWindowDimensions } from 'react-native'
import { useNavigation } from '@react-navigation/core'

const RepairGuideViewFullScreen = ({ route }) => {
  const data = route.params 
  const { width } = useWindowDimensions()

  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({
      headerTitle: data.title
    })
  }, [])

  return (
    <ScrollView >
      <Box bg="white" m="4"  p="4">
        <RenderHTML 
          contentWidth={width}
          source={{
            html: data.body,
          }}
        />
      </Box>
    </ScrollView>
  )
}

export default RepairGuideViewFullScreen;