import { Ionicons } from '@expo/vector-icons'
import MapboxGL from '@react-native-mapbox-gl/maps'
import { useNavigation } from '@react-navigation/core'
import { lineString } from '@turf/helpers'
import React, {
  useRef,
  useEffect,
  useCallback
} from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import { colors } from '../../constants/colors'
import { RootState } from '../../features/store'
import { calculateDistanceFromPoints } from '../../geojson/geojson'

const TrackRecordingFormScreen = () => {
  const navigation = useNavigation()
  const { top } = useSafeAreaInsets()
  const cameraRef = useRef<MapboxGL.Camera | null>(null);
  // const coordinates = useSelector((state: RootState) => state.track.coordinates)
  // mock coordinates
  const coordinates = [
    [
      120.941589,
      14.665011
    ],
    [
      120.941609,
      14.664976
    ],
    [
      120.941829,
      14.664602
    ],
    [
      120.941877,
      14.664522
    ],
    [
      120.942049,
      14.664229
    ],
    [
      120.942074,
      14.664187
    ],
    [
      120.942283,
      14.663832
    ],
    [
      120.942389,
      14.663653
    ]
  ]

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack()
    }
  }

  const fitCameraFromBounds = useCallback(() => {
    if (cameraRef) {
      if (calculateDistanceFromPoints(coordinates)) {
        
        // cameraRef.current?.fitBounds(leftCoord, rightCoord, 10)
        // console.log('mapbox')
      }
    }
  }, [coordinates.length])

  const generateGeojsonPolyline = () => {
    const ls = lineString(coordinates)
    return ls
  }

  return (
    <View style={{ marginTop: top }}>
      <View> 
        <View style={styles.header}>
          <View style={styles.headerLeftItem}>
            <TouchableOpacity onPress={goBack}>
              <Ionicons name="arrow-back" size={35} color="white" />
            </TouchableOpacity>
            <Text style={{
              alignSelf: 'center',
              color: 'white',
              fontFamily: 'Inter-Medium',
              fontSize: 15,
              marginLeft: 10
            }}>Track Form</Text>
          </View>
        </View>

        <MapboxGL.MapView 
          style={styles.map}
        >
          <MapboxGL.Camera 
            ref={(camera) => {
              // const leftCoord = [coordinates[0].coords.longitude, coordinates[0].coords.latitude]
              // const rightCoord = [coordinates[coordinates.length - 1].coords.longitude, coordinates[coordinates.length - 1].coords.latitude]
              camera?.fitBounds(coordinates[0], coordinates[coordinates.length - 1])
              generateGeojsonPolyline()
              // console.log(leftCoord, rightCoord)
            }}
          />

          <MapboxGL.ShapeSource 
            id={"track-source"}
            shape={generateGeojsonPolyline()}
          >
            <MapboxGL.LineLayer id={"track-line"} sourceID={"track-source"} style={{
              lineColor: colors.primary,
              lineWidth: 8,
              lineOpacity: 0.8,
              lineJoin: 'round',
              lineCap: 'round'
            }}/>
          </MapboxGL.ShapeSource>
        </MapboxGL.MapView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: 8,
    justifyContent: 'space-between'
  },
  headerLeftItem: {
    flexDirection: 'row',
    // alignSelf: 'center',
    // alignContent: 'center',
  },
  textWhite: {
    color: '#fff'
  },
  map: {
    height: Dimensions.get('window').height * 0.85,
    width: '100%'
  }
})

export default TrackRecordingFormScreen