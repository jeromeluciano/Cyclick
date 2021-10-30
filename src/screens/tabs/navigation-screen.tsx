import MapboxGL, { Point } from '@react-native-mapbox-gl/maps'
import { Accuracy, enableNetworkProviderAsync, getCurrentPositionAsync, getLastKnownPositionAsync, hasServicesEnabledAsync, requestForegroundPermissionsAsync, watchHeadingAsync, watchPositionAsync } from 'expo-location'
import React, {
  useRef,
  useState,
  useEffect
} from 'react'
import { Dimensions, Keyboard, Platform, StyleSheet, View } from 'react-native'
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
import { Entypo, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import MapMarkers from '../../components/Navigation/MapMarkers'
import { DefaultTheme } from 'react-native-paper'
import { setNetworkStatus } from '../app/permission-slice'
import { fetchApprovedMarkers } from '../../features/navigation/markers-slice'
import {
  Box, Pressable, Divider, Input, VStack, FlatList, Text, Image, Actionsheet, useDisclose
} from 'native-base'
import { geocoder } from '../../api/mapbox/geocoder'
import _ from 'lodash'

import bikeRepairIcon from '../../../assets/markers/bike_repair.png'
import { firestore } from '../../api/firebase'
import { getApprovedMarkers } from '../../api/markers/markers-services'
import { getApprovedBikeLanes } from '../../features/navigation/bike-lanes'
import { fetchPendingBikeLane } from '../../features/pending/pending-slice'
import bbox from '@turf/bbox'
import { setUser } from '../../features/auth/auth-slice'

const icon = {
  bikeRepair: {
    iconImage: bikeRepairIcon,
    iconAllowOverlap: true,
    iconSize: 0.4
  },
}

export const HackMarker = ({ children }) =>
    Platform.select({
        ios: children,
        android: (
            <Text
                style={{
                    lineHeight: 10, // there is some weird gap, add 40+ pixels
                    // backgroundColor: '#dcdcde',
                    
                }}>
                {children}
            </Text>
        ),
    })


const NavigationScreen = () => {
  const { top } = useSafeAreaInsets()
  const mapCameraRef = useRef<MapboxGL.Camera | null>(null)
  const [routes, setRoutes] = useState<any | null>(null)
  const [line, setLine] = useState<any>(null)
  // navigation slice
  const navigation = useSelector((state: RootState) => state.navigation)
  // permission slice
  const permission = useSelector((state: RootState) => state.permission)
  // bike lane slice
  const bikelanes = useSelector((state: RootState) => state.bikelane.bikelanes)
  // dispatcher
  const dispatch = useDispatch()
  const mapRef = useRef<MapboxGL.MapView | null>(null);

  const [userCenter, setUserCenter] = useState<boolean>(true)

  // search state
  const [search, setSearch] = useState<string>('')
  const [searchResult, setSearchResult] = useState<any>();

  const [focusedBikeLane, setFocusedBikeLane] = useState(null)

  const [showBikeLane, setShowBikeLane] = useState(false)

  const { isOpen, onOpen, onClose} = useDisclose()

  const { showActionSheetWithOptions } = useActionSheet()

  const handleToggleBikeLane = () => {
    setShowBikeLane(!showBikeLane)
    handleFetchBikeLane()
  }

  const handleFetchBikeLane = async () => {
    dispatch(getApprovedBikeLanes())
    
    console.log(bikelanes)

  }

  const focusOnBikeLane = (bikelane) => {
    setFocusedBikeLane(bikelane)
    calculateBikeLaneBoundary(bikelane)
    onOpen()
  }

  const calculateBikeLaneBoundary = (bikelane) => {
    if (!bikelane) return;
    const _coordinates = bikelane.coordinates.map(coordinate => [coordinate.longitude, coordinate.latitude])
    if (_coordinates.length > 1) {
      const _lineString = lineString(_coordinates)
      const [x1, y1, x2, y2] = bbox(_lineString)
      console.log(x1, y1, x2, y2)
      if (mapCameraRef.current) {
        setUserCenter(false)
        mapCameraRef.current.fitBounds(
          [x1, y1],
          [x2, y2],
          100, 400
        )

        setTimeout(() => {
          setUserCenter(false)
        }, 400)
      }
    }
  }

  const directionActionSheet = () => {
    const options = ['Get Directions', 'Cancel'];
    // const destructiveButtonIndex = ;
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex
      },
      buttonIndex => {
        switch(buttonIndex) {
          case 0:
            dispatch(fetchDirections())
            return;
        }
      },
    );
  }

  // const test = () => {
  //   if (mapRef.current) {
  //     mapRef.current.q
  //   }
  // }

  const flyToCoordinates = (location: any) => {
    mapCameraRef.current?.flyTo(location.geometry.coordinates)
    // mapCameraRef.current?.zoomTo(14)
 
    mapCameraRef.current?.flyTo(location.center)
  }

  const toggleNavigating = () => {
    if (!navigation.isNavigating) {
      dispatch(startNavigating())
    } else {
      dispatch(resetNavigation())
      dispatch(stopNavigating())
      mapCameraRef.current?.zoomTo(12)
    }
  }

  const searchPlace = _.debounce((place: string) => {
    geocoder.forwardGeocode({
      query: place,
      limit: 2,
      autocomplete: true,
      countries: ['ph'],
    })
    .send()
    .then((response: any) => {
      console.log('Search result: ', response.body.features)
      setSearchResult(response.body.features)
    })
  }, 400)

  const handleSearchChange = (search) => {
    setSearch(search)
    if (search.length > 2) {
      
      searchPlace(search)
      console.log(searchResult)
    } else {
      setSearchResult(null)
    }
  }

  const clearMarker = () => {
    if (navigation.endpoint) {
      dispatch(resetNavigation())
    }
  }

  const handleLocationView = (location) => {
    dispatch(resetNavigation())
    moveTo(location.geometry.coordinates)
    dispatch(closeSearchBar())
    console.log(location.geometry.coordinates)
  }

  const moveTo = (coordinates) => {
    if (mapCameraRef.current) {
      setUserCenter(false)
      dispatch(setEndpoint(coordinates))
      mapCameraRef.current.flyTo(coordinates, 200)

      // setTimeout(() => {
      //   setUserCenter(true)
      // }, 400)
    }
  }

  // if (!startPoint) {
  //   return <AppLoader/>
  // }

  useEffect(() => {
    (async () => {  
      const { granted } = await requestForegroundPermissionsAsync()
        
      enableNetworkProviderAsync()
        .then(() => dispatch(setNetworkStatus(true)))
        .catch(() => dispatch(setNetworkStatus(false)))

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
    dispatch(fetchApprovedMarkers())
  }, [navigation.isNavigating, permission.networkStatus])


  // while(!permission.networkStatus) {
  //   enableNetworkProviderAsync()
  //     .then(() => dispatch(setNetworkStatus(true)))
  //     .catch(() => dispatch(setNetworkStatus(false)))
  // }
 

  // if (!navigation.startpoint) {
  //   return <AppLoader/>
  // }

  return (
      <View style={{ marginTop: top }}>
          {/* header */} 
        <View style={{ position: 'relative' }}>
            <MapboxGL.MapView 
              ref={mapRef} 
              compassEnabled={false} 
              style={styles.map} 
              onPress={() => {
                Keyboard.dismiss()
                dispatch(closeSearchBar())
                setFocusedBikeLane(null)
              }}
              // styleURL={'mapbox://styles/jjdluciano/ckumvleklhatp19nsbhd42rzk'}
              onLongPress={(feature) => {
                if (navigation.shape) return;
                // @ts-ignore
                const _coordinates = feature.geometry.coordinates;
                dispatch(setEndpoint(_coordinates))
                dispatch(fetchPendingBikeLane())

                // console.log(navigation.endpoint)
                // dispatch(fetchDirections())
               
                // @ts-ignore
                // console.log('point: ', feature.geometry.coordinates)
              }}
              // onTa
            >
              {/* {permission.networkStatus && navigation.startpoint ? */}
                {/* <> */}
                    <MapboxGL.Camera 
                      ref={mapCameraRef} 
                      // centerCoordinate={navigation.startpoint} 
                      zoomLevel={10}
                      followUserLocation={userCenter}
                      followUserMode={navigation.isNavigating ? 'compass': 'normal'}
                      followZoomLevel={!navigation.isNavigating ? 12 : 18 }
                      animationMode={'flyTo'}
                    />
                    <MapboxGL.UserLocation renderMode={'native'} showsUserHeadingIndicator androidRenderMode={!navigation.isNavigating ? 'normal': 'compass'}/>
                {/* </>  */}
                
              {/* } */}

              {
                navigation.endpoint ?
                  <MapboxGL.PointAnnotation id={'endpoint-marker'} coordinate={navigation.endpoint} onSelected={() => {
                    // console.log('dispatch fetch', navigation.shape)
                    // dispatch(fetchDirections())
                    directionActionSheet()
                  }}>
                    
                  </MapboxGL.PointAnnotation>: null
              }

              {
                navigation.shape ? (
                  <MapboxGL.ShapeSource id="line-source" shape={navigation.shape}>
                    <MapboxGL.LineLayer id="polyline-navigation" sourceID="line-source" style={{
                      lineCap: 'round',
                      lineWidth: 5,
                      lineColor: colors.primary,
                      lineJoin: 'round',
                      // lineGapWidth: 1,
                      lineOpacity: 0.9
                      // lineBlurTransition: 5
                    }}/>
                  </MapboxGL.ShapeSource>
                ): null
              }

              {
                showBikeLane && bikelanes.map(bikelane => {
                  console.log('Bike lane', bikelane.coordinates.map(location => [location.longitude, location.latitude]))
                  return (
                    <MapboxGL.ShapeSource
                      key={`${bikelane.id}-src-key`}
                      onPress={() => focusOnBikeLane(bikelane)}
                      id={`${bikelane.id}-source`}
                      shape={{
                        type: 'MultiPoint',
                        coordinates:  bikelane.coordinates.map(location => [location.longitude, location.latitude])
                      }}
                    >
                      <MapboxGL.LineLayer 
                        id={`${bikelane.id}-marker`}
                        style={{
                          lineColor: colors.primary,
                          lineWidth: 5,
                          lineOpacity: focusedBikeLane && focusedBikeLane.id == bikelane.id ? 1 : 0.7
                        }}
                      />
                    </MapboxGL.ShapeSource>
                  )
                })
              }


              {/* markers */}

              {/* <MapboxGL.PointAnnotation id="markers-annotations" coordinate={[120.9350, 14.6732]}>
                
              </MapboxGL.PointAnnotation> */}

              <MapMarkers/>
            </MapboxGL.MapView>
        </View>

        {/* buttons */}
        
        <VStack position="absolute">
          {/* search input */}
          <Box position="relative" m="4" style={{
            width: Dimensions.get('window').width * .91950
          }} bg="2">
            <Box w="full">
              {
                navigation.searchBarState ?
                <Input
                  placeholder={'Search'}
                  borderTopRadius="5"
                  borderBottomLeftRadius="5"
                  borderWidth={0}
                  w="full"
                  py="2"
                  px="4"
                  bg="white"
                  fontSize="18"
                  shadow={1}
                  onChangeText={handleSearchChange}
                  value={search}
                />:null
              }
            </Box>
            {
              searchResult && navigation.searchBarState && search.length > 2 ?
              <Box bg="white" mt="1" borderRadius="5" overflow="hidden" shadow={1}>
                <FlatList 
                  data={searchResult} 
                  renderItem={({ item, index }) => {
                    return (
                      <>
                        { index > 0 ? <Divider/> : null }
                        <Pressable onPress={() => handleLocationView(item)}>
                          {({ isPressed }) => {
                            return (
                              <Box p="4" bg={isPressed ? 'gray.50' : 'white'}>
                                <Text fontWeight="bold" fontSize="xs" color="gray.600">
                                  { item.place_name }
                                </Text>
                              </Box>
                            )
                          }}
                        </Pressable>
                      </>
                    )
                  }}
                />
              </Box>: null
            }   
            
          </Box>

        
          <Box position="absolute" right="0" m="4" opacity={navigation.searchBarState ? 0 : 1}>
            
            <SearchPlacesInput handleOnPress={(item) => {
              flyToCoordinates(item)
              // console.log('flying to', item.center)
              // console.log(item)
            }}/>
            
            {
              // start navigation button
              navigation.shape ? (
                <Pressable onPress={toggleNavigating} >
                { ({ isPressed }) => {
                  return (
                    <>
                      <Divider/>
                      <Box bg="white" p="3">
                        {
                          !navigation.isNavigating ?
                            <MaterialCommunityIcons name="navigation" size={24} color={colors.primary} />:
                            <Entypo name="cross" size={24} color="red" />
                        }
                      </Box>
                    </>
                  )
                }}

                </Pressable>
              ): null
            }
          

            
            {
              // clear marker button
              navigation.endpoint && !navigation.isNavigating ?
              (
                <>
                  <Divider/>
                  <Pressable onPress={clearMarker}>
                    {({ isPressed }) => {
                      return (
                        <Box bg="white" p="3">
                          <MaterialCommunityIcons name="map-marker-remove" size={24} color="red" />
                        </Box>
                      )
                    }}
                  </Pressable>
                </>
              ): null
              
            }

            <Divider />
            <Pressable onPress={() => {
              setUserCenter(false)
              setTimeout(() => {
                setUserCenter(true)
              }, 300)
            }}>
              {( { isPressed } ) => {
                return (
                  <Box bg="white" p="3">
                    <MaterialIcons name="gps-fixed" size={24} color="black" /> 
                  </Box>
                )
              }}
            </Pressable> 

              <Divider/>
              {/* show bike lanes */}
              <Pressable onPress={handleToggleBikeLane}>
                {({ isPressed }) => {
                  return (
                    <Box bg={isPressed || showBikeLane ? 'black': 'white'} p="3" borderBottomRadius="5">
                      <MaterialCommunityIcons name="road-variant" size={24} color={isPressed || showBikeLane ? 'white' : 'black'} />
                    </Box>
                  )
                }}
              </Pressable>
          </Box>
          </VStack>

          <Actionsheet onClose={onClose} isOpen={isOpen}>
            <Actionsheet.Content>
              <Box m="4">
                <Box>
                  <Text fontSize="lg" fontWeight="bold" justifyContent="flex-start">
                    { focusedBikeLane ? focusedBikeLane.title : null }
                  </Text>
                  <Text fontSize="xs">
                    { focusedBikeLane ? focusedBikeLane.description : null }
                  </Text>
                </Box>
              </Box>
            </Actionsheet.Content>
          </Actionsheet>
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
    marginVertical: 10,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    shadowRadius: 15,
    shadowOffset : { width: 10, height: 13},
    elevation: 6
  },
})


export default connectActionSheet(NavigationScreen)