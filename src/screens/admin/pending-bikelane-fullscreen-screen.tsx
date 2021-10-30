import { AntDesign, Ionicons } from "@expo/vector-icons";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { useNavigation } from "@react-navigation/core";
import bbox from "@turf/bbox";
import { lineString } from "@turf/helpers";
import { Box, HStack, Pressable, Text, Badge, Toast, ScrollView } from "native-base";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { useDispatch } from "react-redux";
import { firestore } from "../../api/firebase";
import { colors } from "../../constants/colors";
import { fetchApprovedMarkers } from "../../features/navigation/markers-slice";
import { fetchPendingBikeLane, fetchPendingMarkers } from "../../features/pending/pending-slice";

const PendingBikeLaneFullScreenView = ({ route }) => {
  const bikelane = route.params;

  const navigation = useNavigation();

  const dispatch = useDispatch();

  const [boundBox, setBoundBox] = useState(null);

  const [coordinates, setCoordinates] = useState(null)

  const mapCameraRef = useRef<MapboxGL.Camera>(null)

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const setMapBoundary = (_bbox) => {
    if (mapCameraRef.current) {
      const [x1, y1, x2, y2] = _bbox
      mapCameraRef.current.fitBounds([x1, y1], [x2, y2], 50)
    }
  }

  const handleApprovePress = useCallback(() => {
    const instance = {
      coordinates: bikelane.coordinates,
      description: bikelane.description,
      title: bikelane.title,
      isApproved: true,
      isRejected: false,
      id: bikelane.id
    };

    // console.log(bikelane.coordinates)

    firestore
      .collection('bike_lanes')
      .doc(bikelane.id)
      .update(instance)
      .then((_) => {
        // dispatch(fetchPe())
        // dispatch(fetchApprovedMarkers())
        Toast.show({
          description: `${bikelane.title} is approved.`
        })
        navigation.goBack()
      })
      .catch((_) => {
        Toast.show({
          description: "Something unexpected happen."
        })
      })
  }, [bikelane]);

  const handleRefusePress = () => {
    const instance = {
      coordinate: bikelane.coordinates,
      description: bikelane.description,
      isApproved: false,
      isRejected: true,
      id: bikelane.id
    };

    firestore
      .collection("bike_lanes")
      .doc(bikelane.id)
      .update(instance)
      .then((_) => {
        dispatch(fetchPendingBikeLane());
        // dispatch(fetchApprovedMarkers())
        navigation.goBack();
      })
      .catch((_) => {
        Toast.show({
          description: "Something unexpected happen.",
        });
      });
  };

  const calculateBoundingBox = (coordinates) => {
    const _coordinates = coordinates.map((coordinate) => [
      coordinate.longitude,
      coordinate.latitude,
    ]);
    const _lineString = lineString(_coordinates);
    const _bbox = bbox(_lineString);
    return _bbox;
  };

  useEffect(() => {
    const _coordinates = bikelane.coordinates.map((coordinate) => [
      coordinate.longitude,
      coordinate.latitude,
    ])

    setCoordinates(_coordinates)

    console.log("params from fullscreen", bikelane);
  }, [bikelane]);

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <Box
        overflow="hidden"
        marginX="4"
        marginY="4"
        borderRadius="20"
        position="relative"
      >
        <MapboxGL.MapView
          style={styles.map}
          rotateEnabled={false}
          compassEnabled={false}
          // zoomEnabled={false}
          // scrollEnabled={false}
          pitchEnabled={false}
          onDidFinishLoadingMap={() => {
            const _bbox = calculateBoundingBox(bikelane.coordinates);
            setMapBoundary(_bbox)
            console.log(_bbox)
          }}
        >
          <MapboxGL.Camera 
            // centerCoordinate={[marker.coordinate.longitude, marker.coordinate.latitude]}
            zoomLevel={14}
            ref={mapCameraRef}
          />

          {
            coordinates ?
            <MapboxGL.ShapeSource
              id="bikelane-source"
              shape={{
                type: 'MultiPoint',
                coordinates: coordinates
              }}
            >
              <MapboxGL.LineLayer 
                id="bikelane-line"
                style={{
                  lineWidth: 5,
                  lineCap: 'round',
                  lineColor: colors.primary
                }}
              />
            </MapboxGL.ShapeSource> : null
          }
        </MapboxGL.MapView>

        <Box position="absolute" zIndex={2}>
          <Pressable onPress={handleGoBack}>
            {({ isPressed }) => {
              return (
                <Box m="3" borderRadius="20">
                  <Box
                    bg={isPressed ? "emerald.800" : "emerald.600"}
                    px="4"
                    py="2"
                    borderRadius="20"
                    opacity="0.9"
                  >
                    <Ionicons name="arrow-back-sharp" size={24} color="white" />
                  </Box>
                </Box>
              );
            }}
          </Pressable>
        </Box>
      </Box>

      <Box>
        <Box mx="4" my="1" bg="white" p="5" borderRadius="20">
          <HStack justifyContent="space-between">
            <Box>
              <Text fontSize="xl" fontWeight="bold">
                {bikelane.title}
              </Text>
            </Box>
            <Box>
              <Badge colorScheme="success" px="2" py="1" borderRadius="5">
                <Text fontSize="sm" fontWeight="medium">
                  Bike lane
                </Text>
              </Badge>
            </Box>
          </HStack>
          <Text marginTop="1">{bikelane.description}</Text>
        </Box>
      </Box>

      <Box mx="1" my="1">
        <HStack p="2" justifyContent="space-evenly">
          <Box w="1/2" p="1">
            <Pressable onPress={handleApprovePress}>
              {({ isPressed }) => {
                return (
                  <Box
                    bg={isPressed ? "emerald.600" : "emerald.500"}
                    w="full"
                    alignItems="center"
                    p="5"
                    borderRadius="20"
                  >
                    <HStack space={2}>
                      <AntDesign name="checkcircle" size={24} color="#ecfdf5" />
                      <Text color="emerald.50" fontSize="lg" fontWeight="bold">
                        Approve
                      </Text>
                    </HStack>
                  </Box>
                );
              }}
            </Pressable>
          </Box>

          <Box w="1/2" p="1">
            <Pressable onPress={handleRefusePress}>
              {({ isPressed }) => {
                return (
                  <Box
                    bg={isPressed ? "red.700" : "red.600"}
                    w="full"
                    alignItems="center"
                    p="5"
                    borderRadius="20"
                  >
                    <HStack space={2}>
                      <AntDesign name="closecircle" size={24} color="#fef2f2" />
                      <Text color="red.50" fontSize="lg" fontWeight="bold">
                        Refuse
                      </Text>
                    </HStack>
                  </Box>
                );
              }}
            </Pressable>
          </Box>
        </HStack>
      </Box>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: Dimensions.get("window").height * 0.55,
  },
});

export default PendingBikeLaneFullScreenView;
