import { AntDesign, Entypo, FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { lineString } from "@turf/helpers";
import { Box, Text, Pressable, VStack, Divider, ScrollView, TextArea, Input, Spinner } from "native-base";
import React, {
  useState,
  useCallback
} from "react";
import { Dimensions, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { firestore } from "../../api/firebase";
import { mapMatchCoordinates, mapMatching } from "../../api/mapbox/mapmatching";
import { colors } from "../../constants/colors";
import { fetchPendingBikeLane } from "../../features/pending/pending-slice";
import { RootState } from "../../features/store";

const AddBikeLaneScreen = () => {

  const user = useSelector((state: RootState) => state.auth.user)

  const [coordinates, setCoordinates] = useState<any>([]);

  const [isEditing, toggleEditing] = useState(false);

  // const [searchState, toggleSearchState] = useState(false);

  const [matchedCoordinates, setMatchedCoordinates] = useState(null)

  const [title, setTitle] = useState('')
  
  const [description, setDescription] = useState('')
  
  const [isLoading, setIsLoading] = useState(false)

  const dispatch = useDispatch()

  const handleAddCoordinate = useCallback((e) => {
    if (!isEditing) return;
    const coordinate = e.geometry.coordinates
    setCoordinates([coordinate, ...coordinates])
    // console.log(shape)
  }, [coordinates, isEditing])

  const handleRemoveCoordinates = () => {
    setCoordinates([])
    setMatchedCoordinates(null)
  }

  const handleChangeOnDescription = (_description: string) => {
    setDescription(_description)
  }

  const handleChangeOnTitle = (_title: string) => {
    setTitle(_title)
  }

  const handleToggleEditing = () => {
    toggleEditing(!isEditing)
  }

  const handleAddBikeLaneSubmit = useCallback(() => {

    if (!matchedCoordinates) return;

    const finalCoordinates = matchedCoordinates.map(([longitude, latitude]) => ({
      longitude,
      latitude
    }))
    
    const instance = {
      title,
      description,
      coordinates: finalCoordinates,
      contributor: {
        email: user?.email,
        avatar_url: user?.photoURL,
        name: user?.displayName
      },
      isRejected: false,
      isApproved: false
    }

    setIsLoading(true)


    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    firestore
      .collection('bike_lanes')
      .add(instance)
      .then(_bikelane => {
        setIsLoading(false)
        dispatch(fetchPendingBikeLane())
        setMatchedCoordinates(null)
        setDescription('')
        setTitle('')
      })
      .catch(() => {
        setIsLoading(false)
        setMatchedCoordinates(null)
        setDescription('')
        setTitle('')
      })
  }, [matchedCoordinates, description, title, user])

  const optimizeCyclingPath = async (coordinates) => {
    if (coordinates.length <= 1) return;

    setMatchedCoordinates(coordinates)
    setCoordinates([])
    toggleEditing(false)
  }

  return (
    <ScrollView m={3} showsVerticalScrollIndicator={false}>
      <Box m="2" overflow="hidden" borderRadius="20" position="relative">
        <MapboxGL.MapView  rotateEnabled={false} style={styles.map} onLongPress={handleAddCoordinate}>
          <MapboxGL.Camera centerCoordinate={[120.9842, 14.5995]} zoomLevel={10}/>

          {
            coordinates.length >= 2 && isEditing  ?
              <MapboxGL.ShapeSource shape={{
                type: 'MultiPoint',
                coordinates: coordinates,
              }} id="marker-source">
                <MapboxGL.LineLayer 
                  id="line-marker"
                  style={{
                    lineWidth: 3,
                    lineDasharray: [2, 2],
                    lineOpacity: 0.7,
                    // lineJoin: 'round',
                    lineCap: 'round'
                  }}
                />
              </MapboxGL.ShapeSource> : null
          }

          {   
            matchedCoordinates ?
              <MapboxGL.ShapeSource shape={{
                type: 'MultiPoint',
                coordinates: matchedCoordinates,
              }} id="matched-line-source">
                <MapboxGL.LineLayer 
                  id="matched-line"
                  style={{
                    lineWidth: 3,
                    lineOpacity: 0.7,
                    // lineJoin: 'round',
                    lineCap: 'round',
                    lineColor: 'green'
                  }}
                />
              </MapboxGL.ShapeSource> : null
          }

          {
            isEditing ?
            <MapboxGL.ShapeSource
              id="bike-path-point-source"
              shape={{ 
                type: 'MultiPoint', 
                coordinates: coordinates
              }}
            >
              <MapboxGL.CircleLayer 
                id="circle-bikelane"
                style={{
                  circleRadius: 4,
                  circleColor: colors.primary,
                }}
              />
            </MapboxGL.ShapeSource>:null
          }

        </MapboxGL.MapView>

        <Box position="absolute" right="0" margin="3"> 
          <VStack shadow={1} overflow="hidden" borderRadius="10">
            <Box>
              <Pressable onPress={handleToggleEditing}>
                {({ isPressed }) => {
                  return (
                    <Box bg={isPressed || isEditing ? colors.primary : 'white'} p="3" borderTopRadius="10">
                      <MaterialCommunityIcons
                        name="map-marker-path"
                        size={15}
                        color={isPressed || isEditing ? 'white' : 'black'}
                      />
                    </Box>
                  );
                }}
              </Pressable>
            </Box>


            {
              isEditing ? 
              (
                <>
                  <Divider />
                  <Box>
                    <Pressable onPress={() => optimizeCyclingPath(coordinates)}>
                      {({ isPressed }) => {
                        return (
                          <Box bg={isPressed ? colors.primary : 'white'} p="3" borderWidth="0">
                            <AntDesign 
                              name="check" 
                              size={15} 
                              color={isPressed ? 'white' : 'black'} 
                            />
                          </Box>
                        );
                      }}
                    </Pressable>
                  </Box>
                </>
              ) : null
            }
            <Divider />
            <Box> 
              <Pressable onPress={handleRemoveCoordinates}>
                {({ isPressed }) => {
                  return (
                    <Box bg={isPressed ? colors.primary : 'white'} p="3"  borderBottomRadius="10">
                      <Entypo 
                        name="trash" 
                        size={15} 
                        color={isPressed ? 'white' : 'black'}
                      />
                    </Box>
                  );
                }}
              </Pressable>
            </Box>
            
          </VStack>

        </Box>
      </Box>

      <Box mx="3" my="2" >
        <Box bg="white" p="4" borderRadius="15"> 
          <Box >
            <Input borderColor="gray.200" value={title} px="4" placeholder="Title" onChangeText={handleChangeOnTitle}/>
          </Box>
          <Box mt="2">
            <TextArea borderColor="gray.200" value={description}  px="4" placeholder="Description" onChangeText={handleChangeOnDescription}/>
          </Box>
        </Box>
        <Box>
          <Pressable onPress={handleAddBikeLaneSubmit}>
            {({ isPressed }) => {
              return (
                <Box bg={isPressed ? colors.secondary : colors.primary} p="4" borderRadius="15" mt="4" shadow={1}>
                  {
                    isLoading ?
                    <Spinner color={'white'} />
                    :<Text textAlign="center" color="white" fontSize="md" fontWeight="bold"> 
                      Submit
                    </Text>
                  }
                </Box>
              )
            }}
          </Pressable>
        </Box>
      </Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: Dimensions.get("window").height * 0.60,
  },
});

export default AddBikeLaneScreen;
