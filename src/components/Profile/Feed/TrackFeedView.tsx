import MapboxGL from "@react-native-mapbox-gl/maps";
import bbox from "@turf/bbox";
import cleanCoords from "@turf/clean-coords";
import { lineString } from "@turf/helpers";
import moment from "moment";
import React from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { colors } from "../../../constants/colors";
import { getDistFromLine } from "../../../utils/utils";
import AppLoader from "../../Utilities/AppLoader";
import { Box, Pressable, HStack, Text } from "native-base";
import { useNavigation } from "@react-navigation/core";
import length from "@turf/length";

// @ts-ignore
export default ({ track }) => {
  const [features, setFeatures] = React.useState<any>(null);
  const [coordinates, setCoordinates] = React.useState<any>(null);
  const [distanceKm, setDistanceKm] = React.useState(0);
  let mapRef = React.useRef<MapboxGL.MapView | null>(null);
  let mapCameraRef = React.useRef<MapboxGL.Camera | null>(null);

  const navigation = useNavigation()

  const transformToFeatures = (coordinates: any) => {
    // transform coordinates to feature collection
    // @ts-ignore
    // clean coordinates
    // coordinates = cleanCoords(coordinates)
    // transform to array of coords
    coordinates = transformToCoords(coordinates);
    // let ls =
    return cleanCoords(lineString(coordinates));
  };

  const transformToCoords = (coordinates: any) => {
    // @ts-ignore
    return coordinates.map((coord) => [coord.longitude, coord.latitude]);
  };

  const centerToLineString = (feature) => {
    const bound = bbox(feature);
    console.log("bound", bound);
    mapCameraRef.current?.fitBounds(
      [bound[0], bound[1]],
      [bound[2], bound[3]],
      20
    );
  };

  const handleViewTrackFull = () => {
    const data = {
      ...track,
      distance_km: distanceKm,
      coordinates: coordinates
    }
    navigation.navigate('profile-feed-full-screen', data)
  }

  const humanizeTime = (seconds: number) => {
    return moment
      .duration({
        seconds: seconds,
      })
      .humanize();
  };

  const timestampToDate = (seconds: number) => {
    console.log(moment.unix(seconds).toDate())
    console.log(moment.utc(seconds).calendar())
    return moment
          .utc(seconds)
          .utcOffset('+08:00')
          .calendar()
  }

  React.useEffect(() => {
    // transform passed data into feature collection
    setFeatures(transformToFeatures(track.coordinates));
    setCoordinates(transformToCoords(track.coordinates));
    

    const _coordinates = track.coordinates.map(coordinate => [coordinate.longitude, coordinate.latitude])
    const _ls = lineString(_coordinates)
    // console.log(track.coordinates)
    const km = length(_ls, {
      units: 'kilometers'
    })

    setDistanceKm(km)
    console.log(km)

    console.log(`${track.description} - ${track.coordinates}`)
    // console.log(track)
    // console.log('features: ', features)
    // console.log('coords: ', coordinates)
  }, []);

  if (!track.coordinates || !features || !coordinates) return <AppLoader />;

  return (
    <Box m="4" borderRadius="10" overflow="hidden">
      <Pressable onPress={handleViewTrackFull}>
        {({ isPressed }) => {
          return (
            <>
              <Box bg="white" opacity={isPressed ? 0.8 : 1}>
                <MapboxGL.MapView
                  style={[styles.map]}
                  ref={mapRef}
                  zoomEnabled={false}
                  pitchEnabled={false}
                  rotateEnabled={false}
                  scrollEnabled={false}
                  attributionEnabled={false}
                  logoEnabled={false}
                  onDidFinishRenderingMapFully={() => {
                    // fit camera on polyline
                    centerToLineString(features);
                  }}
                >
                  <MapboxGL.Camera ref={mapCameraRef} />

                  {/* line string */}
                  <MapboxGL.ShapeSource shape={{
                    type: 'MultiPoint',
                    coordinates: coordinates
                  }} id="track-ls-source">
                    <MapboxGL.LineLayer
                      sourceID="track-ls-source"
                      id="track-ls"
                      style={{
                        lineWidth: 3,
                        lineOpacity: 0.8,
                        lineCap: "round",
                        lineJoin: "round",
                        lineColor: colors.primary,
                      }}
                    />
                  </MapboxGL.ShapeSource>
                </MapboxGL.MapView>
                <HStack my="2" mx="2" justifyContent="space-between">
                  <Box>
                    <Text fontWeight="bold" numberOfLines={2}>
                      {track.description}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontSize="xs">
                      {timestampToDate(track.created_at)}
                    </Text>
                  </Box>
                </HStack>
                <HStack justifyContent="space-between" mx="3" mb="2">
                  <Box>
                    <Text color="gray.600" fontSize="xs">
                      Duration: {humanizeTime(track.duration)}
                    </Text>
                    <Text color="gray.600" fontSize="xs">
                      Distance: {distanceKm.toPrecision(3)} km
                    </Text>
                  </Box>
                  
                </HStack>
              </Box>
            </>
          );
        }}
      </Pressable>
    </Box>
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: 220,
    borderRadius: 10,
  },
  trackContainer: {
    backgroundColor: "white",
    // padding: 5,
    borderRadius: 5,
    padding: 10,
  },
  feedBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  feedContainer: {
    marginBottom: 10,
    marginTop: 20,
    marginHorizontal: 20,
  },
});
