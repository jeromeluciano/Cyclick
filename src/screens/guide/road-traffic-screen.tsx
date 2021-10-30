import React, {
  useEffect,
  useState
} from 'react'
import { Box, Container, FlatList, HStack, Text, VStack, Center, Accordion, StatusBar, Image, Pressable} from 'native-base'
import { useNavigation } from '@react-navigation/core'

const RoadTrafficScreen = () => {
  const [data, setData] = useState(null)

  const navigation = useNavigation()

  useEffect(() => {
    const loadedData = require('../../../guide-traffic-signs.json')
    setData(loadedData.data)
    console.log(data)
  }, [])

  return (
    <Box>
      <StatusBar />
    
      <Box margin="2">
        <FlatList data={data} renderItem={({ item }) => {

          const handleItemPress = (item) => {
            const params = {
              id: item.id,
              category: item.category,
              signs: item.signs
            } 
            console.log(item)

            navigation.navigate('traffic-category-view', params)
          }

          return (
            <Pressable onPress={(e) => handleItemPress(item)}>
              {({ isFocused, isPressed }) => {
                const handleItemPress = (item) => {
                  const params = {
                    id: item.id,
                    category: item.category,
                    signs: item.signs
                  } 
                  console.log(item)
      
                  navigation.navigate('traffic-category-view', params)
                }
                
                return (
                  <Box bg={isPressed ? 'warmGray.200':'white'} padding="6" marginX={3} marginY={2} shadow={-1} borderRadius={8}>
                    <HStack space={8} justifyContent="center">
                      <Text fontWeight="bold" color="gray.500" textAlign="center">{item.category}</Text>
                    </HStack>
                  </Box>
                )
              }}
              
            </Pressable>
          )
        }} />
      </Box>
    </Box>
  )
}

export default RoadTrafficScreen