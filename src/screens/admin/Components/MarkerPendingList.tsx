import { useNavigation } from "@react-navigation/core";
import {
  ScrollView,
  Text,
  Box,
  HStack,
  VStack,
  Divider,
  Badge,
  Pressable,
  FlatList,
} from "native-base";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingMarkers } from "../../../features/pending/pending-slice";
import { RootState } from "../../../features/store";

const MarkerPendingItemView = ({ marker, index }) => {
  const navigation = useNavigation()

  const viewMarkerFullScreen = () => {
    navigation.navigate('pending-markers-fullscreen', {
      ...marker
    })
  }
  console.log(marker)

  return (
    <>
      {index > 0 ? <Divider /> : null}
      <Pressable onPress={viewMarkerFullScreen}>
        {({ isPressed }) => {
          return (
            <Box bg={isPressed ? 'gray.50' : 'white'} borderRadius="15">
              <HStack
                justifyContent="space-between"
                padding="5"
                alignItems="center"
              >
                <Box>
                  <Badge colorScheme="error" borderRadius="4">
                    <Text fontSize="md" fontWeight="light" color="red.700">
                      Pending
                    </Text>
                  </Badge>
                </Box>
                <VStack space={2} alignItems="flex-start" flex="1" justifyContent="center" p="2">
                  {
                    marker.description ?
                    <Box>
                      <Text fontSize="md" fontWeight="bold" color={isPressed ? 'gray.500':'gray.600'} numberOfLines={2}>
                        {
                          marker.description
                        }
                      </Text>
                    </Box>:null
                  }

                  {marker.contributor ? (
                    <Box>
                      <Text color="gray.400" fontSize="xs">
                        {marker.contributor}
                      </Text>
                    </Box>
                  ) : null}
                </VStack>
              </HStack>
            </Box>
          );
        }}
      </Pressable>
      
    </>
  );
};

const MarkerPendingList = () => {
  const dispatch = useDispatch();
  const pendingMarkers = useSelector(
    (state: RootState) => state.pending.markers
  );

  // const navigation = useNavigation()

  useEffect(() => {
    dispatch(fetchPendingMarkers());
    console.log(pendingMarkers);
  }, []);

  return (
    <ScrollView
      bg="white"
      borderRadius="15"
      marginBottom="12"
      showsVerticalScrollIndicator={false}
    >
      {pendingMarkers.length > 0 ? (
        <FlatList
          data={pendingMarkers}
          renderItem={({ item, index }) => {
            console.log(item);
            return (
              <MarkerPendingItemView
                marker={item}
                index={index}
                key={index}
              />
            );
          }}
        />
      ) : (
        <Text
          textAlign="center"
          padding="5"
          fontSize="sm"
          fontWeight="bold"
          letterSpacing="lg"
          color="gray.500"
        >
          Nothing to show.
        </Text>
      )}
    </ScrollView>
  );
};

export default MarkerPendingList;
