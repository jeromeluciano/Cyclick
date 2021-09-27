import MapboxGL, { Point } from '@react-native-mapbox-gl/maps'
import { Accuracy, getCurrentPositionAsync, getLastKnownPositionAsync, requestForegroundPermissionsAsync, watchHeadingAsync, watchPositionAsync } from 'expo-location'
import React, {
  useRef,
  useState,
  useEffect
} from 'react'
import { Dimensions, Keyboard, StyleSheet, Text, View } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import SearchPlacesInput from '../../components/Navigation/SearchPlacesInput'
import AppLoader from '../../components/Utilities/AppLoader'
import DismissKeyboard from '../../components/Utilities/DismissKeyboard'
import { connectActionSheet, useActionSheet } from '@expo/react-native-action-sheet'
import { directions } from '../../api/mapbox/directions'
import { lineString } from '@turf/helpers'
import { colors } from '../../constants/colors'
import { useDispatch, useSelector } from 'react-redux'
import { closeSearchBar, fetchDirections, resetNavigation, setEndpoint, setStartpoint, startNavigating, stopNavigating } from '../../features/navigation/navigation-slice'
import { RootState } from '../../features/store'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import MapMarkers from '../../components/Navigation/MapMarkers'

const NavigationScreen = () => {
  const { top } = useSafeAreaInsets()
  const mapCameraRef = useRef<MapboxGL.Camera | null>(null)
  const [routes, setRoutes] = useState<any | null>(null)
  const [line, setLine] = useState<any>(null)
  const navigation = useSelector((state: RootState) => state.navigation)
  const dispatch = useDispatch()
  const mapRef = useRef<MapboxGL.MapView | null>(null);

  const { showActionSheetWithOptions } = useActionSheet()

  const openNavigationSheet = () => {
    const options = ['Start Navigation', 'Cancel']

    showActionSheetWithOptions(
      {
        options
      },
      (buttonIndex) => {

      }
    )
  }

  const flyToCoordinates = (location: any) => {
    mapCameraRef.current?.flyTo(location.geometry.coordinates)
    // mapCameraRef.current?.zoomTo(14)
 
    mapCameraRef.current?.flyTo(location.center)
  }

  const toggleNavigating = () => {
    if (!navigation.isNavigating) {
      dispatch(startNavigating())
    } else {
      dispatch(stopNavigating())
      dispatch(resetNavigation())
    }
  }




  // if (!startPoint) {
  //   return <AppLoader/>
  // }

  React.useEffect(() => {
    (async () => {
      const { granted } = await requestForegroundPermissionsAsync()

      if (granted) {
        getCurrentPositionAsync({
          accuracy: Accuracy.Lowest
        })
        .then((location) => {
          dispatch(setStartpoint([location.coords.longitude, location.coords.latitude]))
        })
        .catch(() => {
          getLastKnownPositionAsync({
            requiredAccuracy: 6,
          }).then(location => {
            if (location) {
              dispatch(setStartpoint([location.coords.longitude, location.coords.latitude]))
            }
          })
        })
        
      }
    })()
  }, [])


  if (!navigation.startpoint) {
    return <AppLoader/>
  }

  return (
      <View style={{ marginTop: top }}>
          {/* header */} 
        <View style={{ position: 'relative' }}>
          <MapboxGL.MapView ref={mapRef} compassEnabled={false} style={styles.map} onPress={() => {
            Keyboard.dismiss()
            dispatch(closeSearchBar())
          }} onLongPress={(feature) => {
            if (navigation.shape) return;
            // @ts-ignore
            // setEndpoint(feature.geometry.coordinates)
            dispatch(setEndpoint(feature.geometry.coordinates))
            dispatch(fetchDirections())
            // console.log()
          }}
          >
            <MapboxGL.Camera 
              ref={mapCameraRef} 
              centerCoordinate={navigation.startpoint} 
              zoomLevel={10}
              followUserLocation={navigation.isNavigating}
              // followPitch={navigation.isNavigating}
              // followHeading={navigation.isNavigating}
              followUserMode={'compass'}
              followZoomLevel={15}
            />
            <MapboxGL.UserLocation renderMode={'native'} showsUserHeadingIndicator androidRenderMode={!navigation.isNavigating ? 'normal': 'compass'}/>
            {
              navigation.endpoint ?
                <MapboxGL.PointAnnotation id={'endpoint-marker'} coordinate={navigation.endpoint} onSelected={() => {
                  console.log('dispatch fetch', navigation.shape)
                  // dispatch(fetchDirections())
                  openNavigationSheet()
                }}/> : null
            }

            {
              navigation.shape ? (
                <MapboxGL.ShapeSource id="line-source" shape={navigation.shape}>
                  <MapboxGL.LineLayer id="polyline-navigation" sourceID="line-source" style={{
                    lineCap: 'round',
                    lineWidth: 5,
                    lineColor: colors.primary,
                    lineJoin: 'round',
                  }}/>
                </MapboxGL.ShapeSource>
              ): null
            }
            <MapMarkers/>
          </MapboxGL.MapView>
        </View>
        <View style={{ position: 'absolute', width: '100%' }}>
          <SearchPlacesInput handleOnPress={(item) => {
            flyToCoordinates(item)
            // console.log('flying to', item.center)
            console.log(item)
          }}/>

          {
            navigation.shape ?
            <TouchableOpacity style={styles.startNavigationBtn} onPress={toggleNavigating}>
              {
                !navigation.isNavigating ?
                  <MaterialCommunityIcons name="map-marker-distance" size={24} color={colors.primary} />:
                  <MaterialCommunityIcons name="map-marker-remove" size={24} color="red" />
              }
            </TouchableOpacity>: null
          }
        </View>
      </View>
    
  )
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: Dimensions.get('window').height
  },
  header: {

  },
  startNavigationBtn: {
    alignSelf: 'flex-end',
    marginHorizontal: 15,
    marginVertical: 5,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    shadowRadius: 15,
    shadowOffset : { width: 10, height: 13},
    elevation: 6
  }
})



export default connectActionSheet(NavigationScreen)