import { useNavigation } from '@react-navigation/core';
import { Box, FlatList, Text, Image, HStack, Spacer } from 'native-base';
// import { Image } from 'react-native'
import React, {
  useState,
  useEffect
} from 'react'
import { storage } from '../../../api/firebase';

const TrafficCategoryView = ({ route }) => {
  const { id, category, signs } = route.params;

  const navigation = useNavigation()

  const getImageUrl = async (filename: string) => {
    return await storage.ref(`${category}/${filename}`).getDownloadURL()
  }

  useEffect(() => {
    navigation.setOptions({
      title: category
    })
  }, [category])

  console.log(route.params)
  return (
    <Box>
      <FlatList 
        data={signs}
        renderItem={({ item }) => {
          let url;
          
          getImageUrl(item.filename).then(_url => {
            url = _url
            console.log(url, " - ", item.filename )
          })
          // console.log(url)

          return (
            <Box bg="white" marginX={5} marginY={3} borderRadius="10">
              <HStack padding="5" > 
                <Box width="70" height="70">
                  <Image
                    width="full"
                    height="full"
                    source={{
                      uri: item.url,
                      cache: 'only-if-cached'
                    }}
                    alt="Testing"
                  />
                </Box>
                <Box p="2" justifyContent="center" flex="1">
                  <Text fontSize="xs" color="warmGray.600">
                    {item.title}
                  </Text>
                </Box>
              </HStack>
            </Box>
          )
        }}
      />
    </Box>
  )
}

export default TrafficCategoryView