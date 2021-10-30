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
import React, {
  useEffect
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../features/store";
import { fetchPendingBikeLane } from '../../../features/pending/pending-slice'
import { useNavigation } from "@react-navigation/core";

const BikeLaneItemView = ({ bikelane, index }) => {

  const navigation = useNavigation()


  const viewBikeLaneFullScreen = () => {
    navigation.navigate('pending-bikelane-fullscreen', {
      ...bikelane
    })
  }

  return (
    <>
      <Pressable onPress={viewBikeLaneFullScreen}>
        {({ isPressed }) => {
          return (
            <>
            { index > 0 ? <Divider /> : null }
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
                <VStack space={2} alignItems="flex-start">
                  <Box>
                    <Text fontSize="md" fontWeight="bold" numberOfLines={2}>
                      {bikelane.title}
                    </Text>
                    {/* <Text mt="1" fontSize="xs" fontWeight="medium">
                      {bikelane.description}
                    </Text> */}
                  </Box>

                  <Box>
                    <Text color="gray.400" fontSize="xs">
                      Submitted by: Jerome
                    </Text>
                  </Box>
                </VStack>
              </HStack>
            </Box>
            
            </>
          );
        }}
      </Pressable>
    </>
  );
};

const BikeLanePendingList = () => {

  const bikeLanes = useSelector((state: RootState) => state.pending.bikeLanes)
  
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchPendingBikeLane())
  }, [])

  return (
    <ScrollView
      bg="white"
      borderRadius="15"
      marginBottom="12"
      showsVerticalScrollIndicator={false}
    >
      {
        bikeLanes.length == 0 ?
          <Box m="5" alignItems="center">
            <Text fontWeight="bold">Nothing to show.</Text>
          </Box>
        :<FlatList
          data={bikeLanes}
          renderItem={({ item, index }) => {
            return (
              <BikeLaneItemView
                bikelane={item}
                index={index}
              />
            );
          }}
        />
    }
      
    </ScrollView>
  );
};

export default BikeLanePendingList;
