import React, { useCallback, useState } from "react";
import {
  Box,
  StatusBar,
  HStack,
  Text,
  Pressable,
  Actionsheet,
  useDisclose,
  Toast,
} from "native-base";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { Dimensions, StyleSheet } from "react-native";
import moment from "moment";
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";

import { colors } from "../../constants/colors";
import useTrackUserLocationOnBackground from "../../hooks/useTrackUserLocationOnBackground";
import _BackgroundTimer from "react-native-background-timer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../features/store";
import {
  incrementDuration,
  pauseRecording,
  reset,
  startRecording,
  stopRecording,
} from "../../features/tracks/track-slice";
import {
  enableNetworkProviderAsync,
  hasServicesEnabledAsync,
} from "expo-location";
import length from "@turf/length";
import { useNavigation } from "@react-navigation/core";
import { lineString } from "@turf/helpers";

const TrackRecordScreen = () => {
  const [startRecordingLocation, stopRecordingLocation] =
    useTrackUserLocationOnBackground();

  const track = useSelector((state: RootState) => state.track);

  const { isOpen, onOpen, onClose, onToggle } = useDisclose();

  const dispatch = useDispatch();

  const navigation = useNavigation()
  // console.log(track.features)

  const startTimer = () => {
    _BackgroundTimer.stopBackgroundTimer();
    _BackgroundTimer.runBackgroundTimer(() => {
      dispatch(incrementDuration());
    }, 1000);
  };

  const stopTimer = () => {
    _BackgroundTimer.stopBackgroundTimer();
    _BackgroundTimer.stop();
  };

  const handleStartRecordingOnBackground = async () => {
    const isNetworkAvailable = await hasServicesEnabledAsync();

    if (!isNetworkAvailable) {
      await enableNetworkProviderAsync();
    }

    if (track.recording == "idle" || track.recording == "pause" && isNetworkAvailable) {
      console.log("background recording", track.recording);
      // stopRecordingLocation()
      dispatch(startRecording());
      startRecordingLocation();
      startTimer();
    }
  };

  const navigateToTrackForm = useCallback(() => {
    if (track.coordinates.length > 1) {
      const _coordinates = track.coordinates.map(location => [location.coords.longitude, location.coords.latitude])
      const _lineString = lineString(_coordinates)

      const distanceTravelled = length(_lineString, {
        units: 'meters'
      })

      // 5 meter inorder to save the track
      if (distanceTravelled > 0) {
        navigation.navigate('track-recording-form', {
          duration: track.duration,
          distanceKm: length(_lineString, {
            units: 'kilometers'
          })
        })
      } else {
        Toast.show({
          description: 'You need to record longer activity.',
          marginBottom: Dimensions.get('window').height / 2
        })
      }
    } else {
      Toast.show({
        description: 'You need to record longer activity.',
        marginBottom: Dimensions.get('window').height / 2
      })
    }
    
  }, [track.coordinates])

  const handleStopRecordingOnBackground = () => {
    if (track.recording == "pause" || track.recording == "recording") {
      dispatch(stopRecording());
      dispatch(reset())
      stopRecordingLocation();
      stopTimer();
    }
    onClose()
  };

  const handlePauseRecording = () => {
    if (track.recording == "recording") {
      dispatch(pauseRecording())
      stopRecordingLocation()
      stopTimer()
    }
    onClose()
  }

  return (
    <Box>
      <StatusBar />
      <Box overflow="hidden" borderRadius="20" m="2">
        <MapboxGL.MapView style={styles.map}>
          <MapboxGL.Camera followUserLocation={true}  />
          <MapboxGL.UserLocation 
            renderMode={'native'}
          />
        </MapboxGL.MapView>
      </Box>

      <Box mx="12" my="2">
        <HStack justifyContent="space-between">
          <Box>
            <Text textAlign="center">Duration</Text>
            <Text fontWeight="bold" textAlign="center" fontSize="4xl">
              {
                moment
                .utc (
                  moment
                    .duration(track.duration, 'seconds')
                    .asMilliseconds()
                )
                .format('HH:mm:ss')
              }
            </Text>
          </Box>
          <Box>
            <Text textAlign="center">Distance (km)</Text>
            <Text fontWeight="bold" textAlign="center" fontSize="4xl">
              {
                
                track.features && track
                    .features
                    .geometry
                    .coordinates
                    .length > 1 
                      ? length(track.features, { units: 'kilometers'}).toPrecision(3) : 0 
              }
            </Text>
          </Box>
        </HStack>
        <Box alignItems="center">
          {track.recording == "idle" || track.recording == "pause" ? (
            <Pressable onPress={handleStartRecordingOnBackground}>
              {({ isPressed }) => {
                return (
                  <Box bg={isPressed ? colors.secondary : colors.primary} p="3" borderRadius="full">
                    <Entypo name="controller-play" size={35} color="white" />
                  </Box>
                );
              }}
            </Pressable>
          ) : (
            <Pressable onPress={onOpen}>
              {({ isPressed }) => {
                return (
                  <Box bg={isPressed ? colors.secondary : colors.primary} p="3" borderRadius="full">
                    <Ionicons name="pause" size={35} color="white" />
                  </Box>
                );
              }}
            </Pressable>
          )}
        </Box>
      </Box>

      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Box>
            <Text>Actions</Text>
          </Box>
          <Actionsheet.Item onPress={navigateToTrackForm}>
            <HStack alignItems="center" space={3}>
              <FontAwesome name="save" size={24} color="black" />
              <Text>Save</Text>
            </HStack>
          </Actionsheet.Item>
          <Actionsheet.Item onPress={handlePauseRecording}>
            <HStack alignItems="center" space={3}>
              <FontAwesome name="pause" size={24} color="black" />
              <Text>Pause</Text>
            </HStack>
          </Actionsheet.Item>
          <Actionsheet.Item onPress={handleStopRecordingOnBackground}>
            <HStack alignItems="center" space={3}>
              <FontAwesome name="stop" size={24} color="red" />
              <Text color="red.500">Stop Recording</Text>
            </HStack>
          </Actionsheet.Item>
          <Actionsheet.Item onPress={onClose}>
            <Text>Cancel</Text>
          </Actionsheet.Item>
        </Actionsheet.Content>
      </Actionsheet>
    </Box>
  );
};

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.68,
  },
});

export default TrackRecordScreen;
