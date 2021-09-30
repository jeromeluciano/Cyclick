import { connectActionSheet, useActionSheet } from '@expo/react-native-action-sheet'
import { AntDesign, FontAwesome, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import MapboxGL from '@react-native-mapbox-gl/maps'
import { useNavigation } from '@react-navigation/core'
import React, {
  useEffect,
  useState,
  useCallback
} from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useDispatch, useSelector } from 'react-redux'
import { colors } from '../../constants/colors'
import { RootState } from '../../features/store'
import { incrementDuration, pauseRecording, reset, startRecording, stopRecording } from '../../features/tracks/track-slice'
import useTrackUserLocationOnBackground from '../../hooks/useTrackUserLocationOnBackground'
import BackgroundTimer from 'react-native-background-timer'
import moment from 'moment'
import { calculateDistanceKm, createLineString } from '../../geojson/LineString'
import { hasServicesEnabledAsync, enableNetworkProviderAsync } from 'expo-location'
import { setNetworkStatus } from '../app/permission-slice'
MapboxGL.setAccessToken('pk.eyJ1IjoiampkbHVjaWFubyIsImEiOiJja3JkZ3gzZjk1Y3J3MzFvNmJ5ZG5iZ2RmIn0.X7IWxzKNS-hLmwJ__CaMCQ')

const TrackRecordingScreen = () => {
  const { top } = useSafeAreaInsets()
  const navigation = useNavigation()
  const [mapboxPermission, setMapboxPermission] = useState<boolean>(false);
  const [time, setTime] = useState<string>('0:00:00')
  const [startRecordingOnBackground, stopRecordingOnBackground] = useTrackUserLocationOnBackground()
  // track slice
  const track = useSelector((state: RootState) => state.track)
  // permission slice
  const permission = useSelector((state: RootState) => state.permission)
  const dispatch = useDispatch()
  const [locationServicesEnabled, setLocationServicesEnabled] = useState<boolean>(false)

  const { showActionSheetWithOptions } = useActionSheet()


  const openActionSheet = () => {
    const pauseButtonIndex = 0;
    const saveButtonIndex = 1;
    const destructiveButtonIndex = 2
    const cancelButtonIndex = 3;
    
    showActionSheetWithOptions({
      options: ['Pause', 'Save', 'Stop Recording', 'Cancel' ],
      icons: [
        <FontAwesome name="pause" size={24} color="orange" />,
        <FontAwesome name="save" size={24} color="green" />,
        <FontAwesome name="stop" size={24} color='red' />,
        <MaterialCommunityIcons name="cancel" size={24} color={colors.primary} />
      ],
      cancelButtonIndex,
      destructiveButtonIndex,
    }, 
    (buttonIndex) => {
      switch (buttonIndex) {
        case pauseButtonIndex:
          // pause the recording
          handlePauseRecording()
          return;
        case saveButtonIndex:
          // Save the recording
          // @ts-ignore
          navigation.navigate('recording-form')
          return;
        case 2:
          handleStopRecording()
          return;
        case 3:
          // Cancel the action
          return;
      }
    })
  }

  const goBack = () => {
    // if (navigation.getState().key == 'explore') {
    //   navigation.navigate('explore')
    // }
    
    if (navigation.canGoBack()) {
      navigation.goBack()
    }
  }

  const handleStartRecording = () => {
    if (track.recording == "idle" || track.recording == "pause") {
      console.log('Recording started')
      dispatch(startRecording())
      startRecordingOnBackground()
      startTimer()
    } 
  }

  const handlePauseRecording = () => {
    console.log('Recording is paused')
    if (track.recording == "recording") {
      dispatch(pauseRecording())
      stopRecordingOnBackground()
      stopTimer()
    }
  }

  const handleStopRecording = () => {
    if (track.recording == "recording") {
      dispatch(stopRecording())
      dispatch(reset())
      stopRecordingOnBackground()
      stopTimer()
      console.log('Recording stopped')
    }
  }

  const startTimer = () => {
    BackgroundTimer.runBackgroundTimer(() => {
      dispatch(incrementDuration())
    }, 1000);
  }

  const stopTimer = () => {
    BackgroundTimer.stopBackgroundTimer()
  }
  
  const handleEnableNetwork = async () => {
    const isLocationServiceEnabled = await hasServicesEnabledAsync()

    if (!isLocationServiceEnabled) {
      enableNetworkProviderAsync()
        .then(() => {
          dispatch(setNetworkStatus(true))
        })
        .catch(() => {
          dispatch(setNetworkStatus(false))
        })
    }
  }

  useEffect(() => {
    (async () => {
      const isLocationServiceEnabled = await hasServicesEnabledAsync();
      setLocationServicesEnabled(isLocationServiceEnabled)
      if (!isLocationServiceEnabled) {
        await enableNetworkProviderAsync()
      }
    })()

    if (mapboxPermission) return;
    MapboxGL.requestAndroidLocationPermissions()
      .then(status => setMapboxPermission(status))
  }, [permission.networkStatus])

  return (
    <View style={{ marginTop: top }}>
      
      {/* header */}
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
            }}>Track Recording</Text>
          </View>
          <View style={{ alignSelf: 'center' }}>
            <TouchableOpacity  onPress={goBack}>
              <Text style={[styles.textWhite, { marginRight: 5, fontSize: 15 }]}>Tracks</Text>
            </TouchableOpacity>
          </View>
      </View>

      {/* Map */}
      {
        locationServicesEnabled ?
        <MapboxGL.MapView style={styles.map}>
          {
            track.features ?
            <MapboxGL.ShapeSource shape={track.features} id="track-polyline-source">
              <MapboxGL.LineLayer 
                sourceID="track-polyline-source" 
                id="track-route-polyline"
                style={{
                  lineWidth: 5,
                  lineCap: 'round'
                }}
              />
            </MapboxGL.ShapeSource>: null
          }
          <MapboxGL.Camera  followUserMode={'normal'} followUserLocation={track.recording == 'recording'} followZoomLevel={12} />
          <MapboxGL.UserLocation animated={true} renderMode={'native'} showsUserHeadingIndicator={true} />
        </MapboxGL.MapView> :
        <View style={{ 
          height: Dimensions.get('window').height * .70,
          justifyContent: 'center',
          alignSelf: 'center',
          backgroundColor: 'white',
          paddingHorizontal: '20%',
          marginTop: '5%',
          borderRadius: 5,
         }}>
          <Text style={{ color: 'gray' }}>Please enable your location services!</Text>
          <TouchableOpacity onPress={handleEnableNetwork} style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: colors.primary, padding: 10, borderRadius: 5, marginTop: 10 }}>
            <MaterialIcons name="gps-fixed" size={24} color="white" />
            <Text style={{ marginLeft: 5, color: 'white' }}>
              Enabled GPS
            </Text>
          </TouchableOpacity>
        </View>
      }

      <View>
        <View style={styles.descriptionContainer}>
          <View>
            <Text style={styles.descriptionTitle}>Time</Text>
            <Text style={styles.descriptionBody}>{moment.utc(moment.duration(track.duration, 'seconds').asMilliseconds()).format('HH:mm:ss')}</Text>
          </View>
          <View>
            <Text style={styles.descriptionTitle}>Distance (km)</Text>
            <Text style={styles.descriptionBody}>{
              track.coordinates.length > 1 ?
              calculateDistanceKm(track.coordinates).toString(): 0
            }</Text>
          </View>
        </View>
        <View style={{ marginTop: -10 }}>
          {
            track.recording == "idle" || track.recording == "pause" ?
            <TouchableOpacity style={styles.playButton} onPress={handleStartRecording}>
              <AntDesign name="play" size={60} color={colors.primary} />
            </TouchableOpacity>: track.recording == "recording" ?
            <TouchableOpacity style={styles.playButton} onPress={openActionSheet}>
              <AntDesign name="pausecircle" size={60} color={colors.primary} />
            </TouchableOpacity>: null
          }
        </View>
        
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height * .75
  },
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
    width: '100%',
    height: Dimensions.get('window').height * .7
  },
  descriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    marginHorizontal: 35
  },
  descriptionTitle: {
    textAlign: 'center'
  },
  descriptionBody: {
    fontSize: 35,
    textAlign: 'center'
  },
  playButton: {
    alignItems: 'center',
  }
})

export default connectActionSheet(TrackRecordingScreen)