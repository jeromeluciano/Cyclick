import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/core'
import { current } from 'immer'
import { 
  Box,
  HStack,
  Text,
  Divider,
  VStack,
  Badge,
  ScrollView,
  Pressable
} from 'native-base'
import React, {
  useState
} from 'react'
import { colors } from '../../constants/colors'
import BikeLanePendingList from './Components/BikeLanePendingList'
import MarkerPendingList from './Components/MarkerPendingList'

const PendingMarkersScreen = () => {

  const [currentCategory, setCurrentCategory] = useState("bike_lane")

  const handleChangeCategory = (category) => {
    setCurrentCategory(category)
    // console.log('category', currentCategory)
  }
  
  const navigation = useNavigation()

  return (
    <Box m="5">
      {/* category */}
      <Box bg="white" borderRadius="15" marginBottom="3" overflow="hidden"  borderColor={colors.primary} borderWidth={1}>
        <HStack>
          <Box width="2/4">
            <Pressable onPress={() => handleChangeCategory("bike_lane")}>
              {({ isPressed }) => {
                return (
                  <Box alignItems="center" width="full" borderColor={colors.primary} alignSelf="center" bg={currentCategory == "bike_lane" ? colors.primary : 'white'} padding="4">
                    <Text fontSize="xs" letterSpacing="2xl" color={currentCategory == "bike_lane" ? 'white' : colors.primary} fontWeight="bold">BIKE LANE</Text>
                  </Box>
                )
              }}
            </Pressable>
          </Box>

          <Box width="2/4">
            <Pressable onPress={() => {
              handleChangeCategory("markers")
              // navigation.navigate('pending-markers-fullscreen')
            }}>
              {({ isPressed }) => {
                return (
                  <Box alignItems="center" width="full" alignSelf="center" bg={currentCategory == "markers" ? colors.primary : 'white'} padding="4">
                    <Text fontSize="xs" letterSpacing="2xl" color={currentCategory == "markers" ? 'white' : colors.primary} fontWeight="bold">MARKERS</Text>
                  </Box>
                )
              }}
            </Pressable>
          </Box>
        </HStack>
      </Box>

      {/* list of items for bike lanes*/}

      {
        currentCategory == "bike_lane" ? <BikeLanePendingList/> : <MarkerPendingList/>
      }

      
      
    </Box>
  )
}

export default PendingMarkersScreen