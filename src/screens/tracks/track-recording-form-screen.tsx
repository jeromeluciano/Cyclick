import MapboxGL from '@react-native-mapbox-gl/maps';
import { useNavigation } from '@react-navigation/core';
import bbox from '@turf/bbox';
import { lineString } from '@turf/helpers';
import moment from 'moment';
import { 
  Box, 
  HStack, 
  TextArea, 
  Text, 
  Divider, 
  Pressable, 
  ScrollView,
  Spinner,
  Toast
} from 'native-base';

import React, {
  useEffect,
  useRef,
  useCallback,
  useState
} from 'react'

import { Dimensions, StyleSheet } from 'react-native';
import _BackgroundTimer from 'react-native-background-timer';
import { useDispatch, useSelector } from 'react-redux';
import { firestore } from '../../api/firebase';
import { colors } from '../../constants/colors';
import { RootState } from '../../features/store';
import { reset } from '../../features/tracks/track-slice';
import useTrackUserLocationOnBackground from '../../hooks/useTrackUserLocationOnBackground';

const TrackRecordingFormScreen = ({ route }) => {
  const data = route.params

  const track = useSelector((state: RootState) => state.track)

  const user = useSelector((state: RootState) => state.auth.user)

  const mapCameraRef = useRef<MapboxGL.Camera>(null)

  const navigation = useNavigation()

  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false)

  const [startRecordingLocation, stopRecordingLocation] = useTrackUserLocationOnBackground()

  const dispatch = useDispatch()

  const handleChangeDescription = (text: string) => {
    setDescription(text)
  }

  const mapOnLine = useCallback(() => {
    if (mapCameraRef.current) {
      const _lineString = lineString(
        track.coordinates.map(location => [location.coords.longitude, location.coords.latitude])
      )
      const [x1, y1, x2, y2] = bbox(_lineString)

      mapCameraRef.current.fitBounds(
        [x1, y1],
        [x2, y2],
        100
      )
    }
  }, [track.coordinates])

  const saveTrackToFirestore = useCallback(() => {
    const instance = {
      coordinates: track.coordinates.map(location => ({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      })),
      uid: user?.uid,
      description: description,
      distanceKm: data.distanceKm,
      duration: data.duration,
      created_at: new Date().getTime()
    }
    setLoading(true)
    firestore
      .collection('tracks')
      .add(instance)
      .then(track => {
        if (track.id) {
          stopRecordingLocation()
          dispatch(reset())
          _BackgroundTimer.stopBackgroundTimer()
          _BackgroundTimer.stop()
          setDescription('')
          navigation.navigate('recording')
          Toast.show({
            description: 'Track succesfully saved.',
            marginBottom: Dimensions.get('window').height / 2
          })
        }
        setLoading(false)
      })
      .catch(err => {
        setLoading(false)
      })

  }, [description])

  // console.log(coordinates)
  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Track Recording Form'
    })
    console.log(data)
    // console.log(track.coordinates.map(coordinate => [coordinate.coords.longitude, coordinate.coords.latitude]))
  }, [])

  return (
    <ScrollView>
      <Box m="3" borderRadius="xl" overflow="hidden">
        <MapboxGL.MapView 
          style={styles.map} 
          compassEnabled={false}
          onDidFinishLoadingMap={() => {
            mapOnLine()
          }}
        >
          <MapboxGL.Camera 
            ref={mapCameraRef}
          />

          {
            track.coordinates.length > 1 ?
            <MapboxGL.ShapeSource 
              id="line-source"
              shape={{
                type: 'MultiPoint',
                coordinates: track.coordinates.map(coordinate => [coordinate.coords.longitude, coordinate.coords.latitude])
              }}
            >
              <MapboxGL.LineLayer 
                id="line-marker"
                style={{
                  lineColor: colors.primary,
                  lineWidth: 4,
                  lineJoin: 'round'
                }}
              />
            </MapboxGL.ShapeSource> : null
          }
        </MapboxGL.MapView>
      </Box>

      <Box mx="3" my="1" bg="white" borderRadius="15">
        <HStack justifyContent="space-between">
          <Box w="1/2" p="2" >
            <Text fontSize="xs" color="gray.500" textAlign="center">Duration</Text>
            <Text fontSize="4xl" color="gray.900" fontWeight="bold" textAlign="center">
              {
                moment
                .utc (
                  moment
                    .duration(data.duration, 'seconds')
                    .asMilliseconds()
                ).format('HH:mm:ss')
              }
            </Text>
          </Box>
          <Divider orientation="vertical"/>
          <Box w="1/2" p="2">
            <Text fontSize="xs" color="gray.500" textAlign="center">Distance (km)</Text>
            <Text fontSize="4xl" color="gray.900" fontWeight="bold" textAlign="center">
              { data.distanceKm.toPrecision(1) } 
            </Text>
          </Box>
        </HStack>
      </Box>
      
      <Box bg="white" mx="3" my="2" borderRadius="15">
        <Box p="3" borderRadius="15" overflow="hidden">
          <TextArea onChangeText={handleChangeDescription} borderRadius="5" borderColor="gray.300" placeholder="Description" px="4"></TextArea>
        </Box>
      </Box>

        <Pressable mx="3" my="1" onPress={saveTrackToFirestore}>
          {({ isPressed }) => {
            return (
              <Box textAlign="center" bg={isPressed ? colors.secondary : colors.primary} borderRadius="15" p="4">
                {
                  loading ?
                  <Spinner size="sm" />
                  : <Text color="white" textAlign="center"  fontWeight="bold">
                    Save
                  </Text> 
                }
              </Box>
            )
          }}
        </Pressable>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * .50
  }
})

export default TrackRecordingFormScreen;