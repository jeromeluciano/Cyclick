import { useNavigation } from '@react-navigation/core';
import { 
  Box,
  Text

} from 'native-base';
import React, {
  useEffect
} from 'react'

const RepairGuideView = ({ route }) => {
  const navigation = useNavigation()
  const data = route.params

  useEffect(() => {
    navigation.setOptions({
      headerTitle: data.title
    })
  }, [])

  return (
    <Box>
      <Box m="3" bg="white" p="5">
        <Text fontWeight="bold" fontSize="xl">
          {data.title}
        </Text>
        <Text mt="2" color="gray.600" textAlign="justify">
          {data.content}
        </Text>
      </Box>
    </Box>
  )
}

export default RepairGuideView;