import React, {
  useState,
  useEffect
} from 'react'
import { 
  Box, 
  FlatList, 
  Spinner,
  Pressable,
  Text,
  Divider,
  ScrollView
} from 'native-base'
import { useNavigation } from '@react-navigation/core'
import RenderHtml from 'react-native-render-html'
import { Dimensions, useWindowDimensions } from 'react-native'
import { colors } from '../../constants/colors'

import _ from 'lodash'


const RepairGuideItemPressable = ({ item }) => {
  const navigation = useNavigation()
  const handleNavigate = () => {
    navigation.navigate('Repair Guide View Full', {
      ...item
    })
  }
  return (
    <Pressable onPress={handleNavigate}>
      {({ isPressed }) => {
        return (
          <Box px="4" py="6" my="3" borderLeftColor={'primary.400'} borderLeftWidth={5} bg={isPressed ? 'gray.50' : 'white'}>
            <Text textAlign="center" color="gray.500" fontWeight="bold">
              {item.title}
            </Text>
          </Box>
        )
      } }
    </Pressable>
  )
}

export const RepairGuideCollectionItems = ({ route }) => {
  const { category, collections } = route.params
  const navigation = useNavigation()

  useEffect(() => {
    navigation.setOptions({
      headerTitle: category
    })
  })

  const handleViewFullArticle = (item) => {
    console.log(item)
    navigation.navigate('Repair Guide View Full', {
      ...item
    })
  }

  return (
    <FlatList 
      data={collections}
      renderItem={({ item }) => {
        return (
          <Pressable onPress={() => handleViewFullArticle(item)}>
            {({ isPressed }) => {
              return (
                <Box mx="4" my="3" px="3" py="5" bg={isPressed ? 'gray.50' : 'white'} borderRightColor="primary.500" borderRightWidth="5">
                  <Text fontWeight="bold" fontSize="xs" textAlign="left">
                    {item.title}
                  </Text>
                </Box>
              )
            }}
          </Pressable>
        )
      }}
    />
  )
}

const RepairGuideList = () => {

  const [data, setData] = useState(null)

  const navigation = useNavigation()

  const handleViewRepairGuide = (item) => {
    navigation.navigate('repair-guide-view', item)
  }

  const { width } = useWindowDimensions()

  useEffect(() => {
    const loadedData = require('./repair-guide.json')

    setData(loadedData.collections)
  }, [])

  if (!data) {
    return <Box style={{ flex: 1, justifyContent: 'center' }}>
      <Spinner />
    </Box>
  }

  return (
    <ScrollView borderRadius="15" overflow="hidden" showsVerticalScrollIndicator={false}>
      <Box m="4" borderRadius="15" overflow="hidden">
        <FlatList 
          data={data}
          renderItem={({ item }) => {
            return (
              <RepairGuideItemPressable item={item} />
            )
          }}
        />
      </Box>
    </ScrollView>
  )
}

export default RepairGuideList;