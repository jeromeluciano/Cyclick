import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/core'
import { Container, Text, VStack, Center, HStack, Pressable, useColorMode, useColorModeValue, StatusBar } from 'native-base'
import React from 'react'
import { Dimensions, StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import CategoryButton from '../../components/Category/CategoryButton'
import { colors } from '../../constants/colors'

const CyclingCategoryScreen = () => {

  const { colorMode, toggleColorMode } = useColorMode()
  const { top } = useSafeAreaInsets()
  const navigation = useNavigation()

  return (
    <Container top="4" margin={10}>
      <StatusBar />
    
    <VStack width="full">
      <Text bold  fontSize="3xl" textAlign="center">
        Categories
      </Text>
      <Center>
       <VStack space={5} alignItems="center" marginTop={5}>
         <Pressable onPress={() => {
           navigation.navigate('traffic-sign-lists')
         }}>
           {({ isPressed, isFocused, isHovered }) => {
             return (
               <Center h="40" w="40" bg={isPressed ? "#679274":"#3b6448"}  rounded="3xl" shadow={3}>
                 <VStack alignItems="center" space="1">
                  <MaterialCommunityIcons name="road" size={50} color="white" />
                  <Text color="white" >Road Traffic Signs</Text>
                 </VStack>
               </Center>
             )
           }}
         </Pressable>

         <Pressable onPress={() => {
           navigation.navigate('repair-guide-lists')
         }}>
           {({ isPressed, isFocused, isHovered }) => {
             return (
               <Center h="40" w="40" bg={isPressed ? "#679274":"#3b6448"}  rounded="3xl" shadow={3}>
                 <VStack alignItems="center" space="1">
                  <MaterialCommunityIcons name="hammer-wrench" size={50} color="white" />
                  <Text color="white">Repair Guide</Text>
                 </VStack>
               </Center>
             )
           }}
         </Pressable>
         

         <Pressable onPress={() => navigation.navigate('hand-signal-view')}>
           {({ isPressed, isFocused, isHovered }) => {
             return (
               <Center h="40" w="40" bg={isPressed ? "#679274":"#3b6448"} rounded="3xl" shadow={3}>
                 <VStack alignItems="center" space="1">
                  <MaterialCommunityIcons name="hand-right" size={50} color="white" />
                  <Text color="white">Hand Signals</Text>
                 </VStack>
               </Center>
             )
           }}
         </Pressable>
         {/* <Box h="40" w="20" bg="emerald.500" rounded="md" shadow={3} /> */}
       </VStack>
      </Center>
    </VStack>
   </Container>
  )
}
const styles = StyleSheet.create({
  container: {
    // width: '80%',
    // flexDirection: 'row',
    // margin: 15,
    flex: 1,
    margin: 15,
    // flexWrap: 'wrap',
    // justifyContent: 'space-around'
  },
  categoryBtn: {
    backgroundColor: 'white',
    width: '45%',
    padding: 25,
    margin: 1,
    height: 150, 
    // borderRadius: 5,
    borderRadius: 8,
    // backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    elevation: 2,
    shadowRadius: 15 ,
    shadowOffset : { width: 1, height: 2},
  },
  buttonText: {
    textAlign: 'center',
    color: '#838383'
  }
})

export default CyclingCategoryScreen