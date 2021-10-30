import { AntDesign } from '@expo/vector-icons'
import MapboxGL from '@react-native-mapbox-gl/maps'
import { point } from '@turf/helpers'
import { 
  Box, 
  Text,
  ScrollView,
  Select,
  TextArea,
  Pressable,
  Toast,
  useToast
} from 'native-base'
import React, {
  useState,
  useRef,
  useCallback
} from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import { useDispatch } from 'react-redux'
import { firestore } from '../../api/firebase'
import { colors } from '../../constants/colors'
import { fetchPendingMarkers } from '../../features/pending/pending-slice'

const AddMarkersScreen = () => {

  const toast = useToast()

  const dispatch = useDispatch()

  const [markerType, setMarkerType] = useState("");
  const [markerCoordinate, setMarkerCoordinate] = useState(null)
  const [errors, setErrors] = useState<any>({
    markerType: "",
    markerCoordinate: "",
    description: ""
  })
  const [description, setDescription] = useState("");
  const [locationState, setLocationState] = useState(true)

  const mapCameraRef = useRef<MapboxGL.Camera | null>(null)

  const centerToMarker = useCallback(() => {
    if (mapCameraRef.current && markerCoordinate) {
      setLocationState(false)
      mapCameraRef.current.flyTo(markerCoordinate, 500)
      setTimeout(() => {
        // setLocationState(true) 
      }, 400)
      console.log('centering to marker')
    }
    
  }, [markerCoordinate])

  const handleMarkCoordinate = (e) => {
    const coordinates = e.geometry.coordinates;
    const _point = point(coordinates);
    // setFeature(_point)
    setMarkerCoordinate(coordinates);
    centerToMarker()
  }

  const resetForm = () => {
    setMarkerType("")
    setMarkerCoordinate(null)
    // setFeature(null)
    setErrors([])
  }

  const handleSubmit = () => {
    if (!markerCoordinate) {
      toast.show({
        description: "Marker coordinate is required."
      })
    }
    if (!markerType) {
      setErrors({
        ...errors,
        markerType: "Marker type is required.",
      })
    }
    if (!(description.length > 0)) {
      setErrors({
        ...errors,
        description: "Description is required"
      })
    }

    if (!markerCoordinate || !markerType || !(description.length > 0) ) {
      return;
    }

    const instance = {
      description: description,
      coordinate: {
        longitude: markerCoordinate[0],
        latitude: markerCoordinate[1]
      },
      isApproved: false,
      isRejected: false,
      type: markerType
    }
    console.log(instance)

    firestore
      .collection('map_markers')
      .add(instance)
      .then((marker) => {
        toast.show({
          description: 'Form submitted succesfully.',
          marginBottom: 50,
          padding: 15
        })
        setDescription('')
        setMarkerType('')
        setMarkerCoordinate(null)
        dispatch(fetchPendingMarkers())
        setErrors({
          markerCoordinate: "",
          markerType: "",
          description: ""
        })
        resetForm()
      })

       
  }

  return (
    <ScrollView margin={3}>
      
      <Box overflow="hidden" borderRadius="15">
        <MapboxGL.MapView style={styles.map} onLongPress={handleMarkCoordinate}>
          <MapboxGL.Camera followUserLocation={locationState} zoomLevel={13} ref={mapCameraRef}/>
          {
            markerCoordinate ? <MapboxGL.PointAnnotation coordinate={markerCoordinate} id="new-marker"/>
            :null
          }
        </MapboxGL.MapView>
      </Box>

      <Box bg="white" padding="3" borderRadius="15" marginTop="3">
        <Select
          selectedValue={markerType}
          minWidth="200"
          accessibilityLabel="Choose Marker type"
          placeholder="Choose Marker type"
          _selectedItem={{
            // bg: "teal.600",
            // color: "coolGray.800"
            endIcon: <AntDesign name="check" size={24} color={colors.primary} />,
          }}
          mt={1}
          onValueChange={(itemValue) => setMarkerType(itemValue)}
          borderColor={errors.markerType ? 'red.500' : 'gray.200'}
        >
          <Select.Item label="Bike Repair" value="bike_repair" />
          <Select.Item label="Bike Shop" value="bike_shop" />
          <Select.Item label="Waiting shed" value="waiting_shed" />
        </Select>
        {errors.markerType ? <Text fontSize="xs" m="1" color="red.500">{errors.markerType}</Text>: null}

        <TextArea value={description} marginTop="2" placeholder="Description" onChangeText={(value) => {
          setDescription(value)
        }} borderColor={errors.description ? 'red.500' : 'gray.200'}></TextArea>
        {errors.description ? <Text fontSize="xs" m="1" color="red.500">{errors.description}</Text>: null}
        
      </Box>

      <Box marginTop="3">
        <Pressable onPress={handleSubmit}>
          {({ isFocused, isPressed }) => {
            return (
              <Box bg={isPressed ? colors.secondary : colors.primary} p="5" borderRadius="15" >
                <Text color="white" textAlign="center" fontSize="lg" fontWeight="bold">Submit</Text>
              </Box>
            )
          }}
        </Pressable>
      </Box>

    </ScrollView>
  )
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: Dimensions.get('window').height * .50,
    borderRadius: 5
  }
})

export default AddMarkersScreen