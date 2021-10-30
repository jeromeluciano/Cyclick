import { Ionicons } from '@expo/vector-icons'
import MapboxGL from '@react-native-mapbox-gl/maps'
import { useNavigation } from '@react-navigation/core'
import bbox from '@turf/bbox'
import { lineString } from '@turf/helpers'
import moment from 'moment'
import { 
  Box, 
  Text,
  Pressable,
  HStack,
  ScrollView,
  VStack
} from 'native-base'
import React, {
  useEffect,
  useRef
} from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import { colors } from '../../constants/colors'

const ProfileFeedFullScreen = ({ route }) => {
  const data = route.params

  const mapCameraRef = useRef<MapboxGL.Camera>(null)

  const navigation = useNavigation()

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    }
  }

  const calculateBoundary = (coordinates: any) => {
    const _lineString = lineString(coordinates)
    const _bbox = bbox(_lineString)
    return _bbox
  }

  const timestampToDate = (seconds: number) => {
    // console.log(moment.unix(seconds).toDate())
    return moment.unix(seconds).calendar()
  }

  const cameraOnLine = () => {
    if (mapCameraRef.current) {
      const [x1, y1, x2, y2] = calculateBoundary(data.coordinates)
      mapCameraRef.current.fitBounds(
        [x1, y1],
        [x2, y2],
        100
      )
    }
  }

  return (
    <ScrollView>
      <Box position="relative">
        <MapboxGL.MapView 
          style={styles.map}
          onDidFinishLoadingMap={() => {
            cameraOnLine()
          }}
        >
          <MapboxGL.Camera 
            ref={mapCameraRef}
          />

          <MapboxGL.ShapeSource
            id="linestring-source"
            shape={{
              type: 'MultiPoint',
              coordinates: data.coordinates
            }}
          >
            <MapboxGL.LineLayer 
              id="linestring-marker"
              style={{
                lineColor: colors.primary,
                lineWidth: 4,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />
          </MapboxGL.ShapeSource>
        </MapboxGL.MapView>

        <Box position="absolute" margin="2">
          <Pressable onPress={handleGoBack}>
            {({ isPressed }) => {
              return (
                <Box bg={isPressed ? colors.secondary : colors.primary} px="3" py="2" borderRadius="15">
                  <Ionicons name="arrow-back-outline" size={24} color="white" />
                </Box>
              )
            }}
          </Pressable>
        </Box>

      </Box>
      
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: Dimensions.get('window').height 
  }
})

export default ProfileFeedFullScreen