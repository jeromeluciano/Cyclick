import { AntDesign, Ionicons } from '@expo/vector-icons'
import MapboxGL from '@react-native-mapbox-gl/maps'
import { useNavigation } from '@react-navigation/core'
import { 
  Box,
  HStack,
  Pressable,
  Text,
  Badge,
  Toast,
  ScrollView
} from 'native-base'
import React, {
  useEffect
} from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import { firestore } from '../../api/firebase'
import { colors } from '../../constants/colors'
import { fetchApprovedMarkers } from '../../features/navigation/markers-slice'
import { fetchPendingMarkers } from '../../features/pending/pending-slice'


const PendingMarkerFullScreenView = ({ route }) => {
  const marker = route.params
  const navigation = useNavigation()
  const dispatch = useDispatch()

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    }
  }

  const handleApprovePress = () => {
    const instance = {
      coordinate: {
        latitude: marker.coordinate.latitude,
        longitude: marker.coordinate.longitude
      },
      description: marker.description,
      type: marker.type,
      isApproved: true,
      isRejected: false
    }

    firestore
      .collection('map_markers')
      .doc(marker.id)
      .update(instance)
      .then((_) => {
        dispatch(fetchPendingMarkers())
        dispatch(fetchApprovedMarkers())
        navigation.goBack()
      })
      .catch((_) => {
        Toast.show({
          description: "Something unexpected happen."
        })
      })
  }

  const handleRefusePress = () => {
    const instance = {
      coordinate: {
        latitude: marker.coordinate.latitude,
        longitude: marker.coordinate.longitude
      },
      description: marker.description,
      type: marker.type,
      isApproved: false,
      isRejected: true
    }

    firestore
      .collection('map_markers')
      .doc(marker.id)
      .update(instance)
      .then((_) => {
        dispatch(fetchPendingMarkers())
        // dispatch(fetchApprovedMarkers())
        navigation.goBack()
      })
      .catch((_) => {
        Toast.show({
          description: "Something unexpected happen."
        })
      })
  }

  useEffect(() => {
  
    console.log('params from fullscreen', marker)
  }, [])
  
  
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Box overflow="hidden" marginX="4" marginY="4" borderRadius="20" position="relative">
        <MapboxGL.MapView style={styles.map} rotateEnabled={false} compassEnabled={false} zoomEnabled={false} scrollEnabled={false} pitchEnabled={false}>
          <MapboxGL.Camera 
            centerCoordinate={[marker.coordinate.longitude, marker.coordinate.latitude]}
            zoomLevel={14}
          />
          <MapboxGL.PointAnnotation 
            coordinate={[marker.coordinate.longitude, marker.coordinate.latitude]} 
            id="marker-fullscreen"
          />
        </MapboxGL.MapView>

        <Box position="absolute" zIndex={2}>
          <Pressable onPress={handleGoBack}>
            {({ isPressed }) => {
              return (
                <Box m="3" borderRadius="20">
                  <Box bg={isPressed ? 'emerald.800' : 'emerald.600'} px="4" py="2" borderRadius="20" opacity="0.9">
                    <Ionicons name="arrow-back-sharp" size={24} color="white" />
                  </Box>
                </Box>
              )
            }}
          </Pressable>
        </Box>
      </Box>
          
      <Box>
        <Box mx="4" my="1" bg="white" p="5" borderRadius="20" >
          <HStack justifyContent="space-between">
            <Box>
              <Text fontSize="xl" fontWeight="bold">
                Description
              </Text>
            </Box>
            <Box>
              <Badge colorScheme="success" px="2" py="1" borderRadius="5">
                <Text fontSize="sm" fontWeight="medium">
                  {
                    marker.type == 'bike_shop' 
                      ? 'Bike Shop' 
                      : marker.type == 'bike_repair' 
                      ? 'Bike Repair Shop' 
                      : marker.type == 'waiting_shed' 
                      ? 'Waiting Shed': '' 
                  }
                </Text>
              </Badge>
            </Box>
          </HStack>
          <Text marginTop="1">
            {marker.description}
          </Text>
        </Box>
      </Box>

      <Box mx="1" my="1">
        <HStack p="2" justifyContent="space-evenly">
          <Box w="1/2" p="1">
            <Pressable onPress={handleApprovePress}>
              {({ isPressed }) => {
                return (
                  <Box bg={isPressed ? 'emerald.600' : 'emerald.500'} w="full" alignItems="center" p="5" borderRadius="20">
                    <HStack space={2}>
                      <AntDesign name="checkcircle" size={24} color="#ecfdf5" />
                      <Text color="emerald.50" fontSize="lg" fontWeight="bold">
                        Approve
                      </Text>
                    </HStack>
                  </Box>
                )
              }}
            </Pressable>
          </Box>

          <Box w="1/2" p="1">
            <Pressable onPress={handleRefusePress}>
              {({ isPressed }) => {
                return (
                  <Box bg={isPressed ? 'red.700':'red.600'} w="full" alignItems="center" p="5" borderRadius="20">
                    <HStack space={2}>
                      <AntDesign name="closecircle" size={24} color="#fef2f2" />
                      <Text color="red.50" fontSize="lg" fontWeight="bold">
                        Refuse
                      </Text>
                    </HStack>
                  </Box>
                )
              }}
            </Pressable>
          </Box>
        </HStack>
      </Box>
      
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: Dimensions.get('window').height * .50
  }
})

export default PendingMarkerFullScreenView