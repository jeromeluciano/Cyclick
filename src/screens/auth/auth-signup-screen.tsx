import { AntDesign, EvilIcons, FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import { NativeModulesProxy } from "@unimodules/react-native-adapter";
import { 
  Box, 
  Text,
  StatusBar,
  FormControl,
  Input,
  VStack,
  HStack,
  Image,
  Pressable
} from "native-base";
import React, {
  useState,
  useCallback
} from "react";
import { auth, firestore } from "../../api/firebase";
import { colors } from "../../constants/colors";
import validator from 'validator'

const AuthSignUp = () => {
  // const [fontLoaded] = useInterFont();
  const navigation = useNavigation();

  const [emailAlreadyTaken, setEmailAlreadyTaken] = useState<any>(null)

  const [nameError, setNameError] = useState<any>(null)

  const [passwordError, setPasswordError] = useState<any>(null)

  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')

  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [name, setName] = useState('')

  const goToSignInForm = () => {
    navigation.navigate('auth-signin')
  }


  

  

  const handleCreateUser = useCallback(async () => {
    

    if (name.length == 0) {
      setNameError('Name is required.')
      // console.log(name)
      console.log(nameError)
      return;
    } else if (!validator.isAlphanumeric(name, 'en-US', {
      ignore: ' '
    })) {
      setNameError('Special Characters is not allowed')
    }
    
    else {
      setNameError(null)
    }

    if (!validator.isEmail(email)) {
      setEmailAlreadyTaken('Invalid email format')
    } else {
      setEmailAlreadyTaken(null)
    }

    const isEmailUsed = await auth.fetchSignInMethodsForEmail(email)

    if (isEmailUsed.length >= 1) {
      setEmailAlreadyTaken('Email is already taken.')
      console.log('email')
      return;
    } else {
      setEmailAlreadyTaken(null)
    }

    if (password != confirmPassword) {
      setPasswordError('Password mismatch.')
      return;
    } else {
      setPasswordError(null)
    }

    if (password.length < 8) {
      setPasswordError('Password must be more than 8 chars.')
      return;
    } else {
      setPasswordError(null)
    }

    auth
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        user.user?.updateProfile({
          displayName: name
        })
      })
  }, [name, email, password, confirmPassword])

  return (
    <>
    <Pressable m="10" onPress={goToSignInForm}>
      {({ isPressed }) => {
        return (
          <Ionicons name="arrow-back-sharp" size={24} color={isPressed ? '#858585':'black'} />
        )
      }}
     
    </Pressable>
    <Box m="5" flex="1" justifyContent="center" mt="-8">
        <StatusBar/>
        <HStack m="5" justifyContent="space-between" alignItems="center" space="3">
          <Box>
            <Text color={colors.primary} fontSize="3xl" fontWeight="bold" letterSpacing="md">Create Account</Text>
          </Box>
          <Box>
            <Image 
              w="50"
              h="50"
              source={require('../../../assets/logo-500.png')}
            />
          </Box>
          
        </HStack>
        <VStack mx="5" space="5">
          <FormControl isInvalid={nameError ? true : false}>
            <Input
              type="text"
              placeholder="Name"
              fontSize="md" px="2"
              borderWidth="0"
              borderBottomWidth="1"
              borderBottomColor={nameError ? 'red.500' : colors.primary}
              keyboardType={'name-phone-pad'}
              value={name}
              InputLeftElement={
                <Box ml="2">
                  <Ionicons name="person" size={24} color={nameError ?  '#f43f5e' : colors.secondary} />
                </Box>
              }
              onChangeText={(text) => setName(text)}
            />

            <FormControl.ErrorMessage leftIcon={
              <Box ml="2">
                <EvilIcons name="exclamation" size={24} color="#f43f5e" />
              </Box>
            }>
              {nameError}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isInvalid={emailAlreadyTaken ? true : false}>
            <Input
              type="email"
              placeholder="example@domain.com"
              value={email}
              fontSize="md" px="2"
              borderWidth="0"
              borderBottomWidth="1"
              borderBottomColor={emailAlreadyTaken ? 'red.500' : colors.primary}
              InputLeftElement={
                <Box ml="2">
                  <MaterialIcons name="email" size={24} color={emailAlreadyTaken ? 'red' : colors.secondary} />
                </Box>
              }
              onChangeText={(text) => setEmail(text)}
            />

            <FormControl.ErrorMessage leftIcon={
              <Box ml="2">
                <EvilIcons name="exclamation" size={24} color="#f43f5e" />
              </Box>
            }>
              {emailAlreadyTaken}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isInvalid={passwordError ? true : false}>
            <Input
              type="password"
              value={password}
              placeholder="Password"
              fontSize="md" px="2"
              borderWidth="0"
              borderBottomWidth="1"
              borderBottomColor={passwordError ? '#f43f5e' : colors.primary}
              InputLeftElement={
                <Box ml="2">
                  <FontAwesome5 name="lock" size={24} color={passwordError ? '#f43f5e' : colors.secondary} />
                </Box>
              }
              onChangeText={(text) => setPassword(text)}
            />

            <FormControl.ErrorMessage leftIcon={
              <Box ml="2">
                <EvilIcons name="exclamation" size={24} color="#f43f5e" />
              </Box>
            }>
              {passwordError}
            </FormControl.ErrorMessage>
          </FormControl>

          <FormControl isInvalid={passwordError ? true : false}>
            <Input
              type="password"
              value={confirmPassword}
              placeholder="Confirm password"
              fontSize="md" px="2"
              borderWidth="0"
              borderBottomWidth="1"
              borderBottomColor={passwordError ? '#f43f5e' : colors.primary}
              InputLeftElement={
                <Box ml="2">
                  <FontAwesome5 name="lock" size={24} color={passwordError ? '#f43f5e' : colors.secondary} />
                </Box>
              }
              onChangeText={(text) => setConfirmPassword(text)}
            />
            <FormControl.ErrorMessage leftIcon={
              <Box ml="2">
                <EvilIcons name="exclamation" size={24} color="#f43f5e" />
              </Box>
            }>
              {passwordError}
            </FormControl.ErrorMessage>
          </FormControl>

          <Box mt="5">
            <Pressable onPress={handleCreateUser}>
              {({ isPressed }) => {
                return (
                  <Box bg={isPressed ? colors.secondary : colors.primary} p="4" borderRadius="15">
                    <Text
                      fontWeight="bold"
                      letterSpacing="xl"
                      textAlign="center"
                      color="white"
                    >
                      SIGN UP
                    </Text>
                  </Box>
                )
              }}
            </Pressable>
          </Box>

          <Box mt="1" alignItems="center">
            <HStack space={2}>
              <Box>
                <Text 
                  textAlign="center"
                  letterSpacing="xl"
                  fontSize="xs"
                >Already have an account?</Text>
              </Box>
              <Box>
                <Pressable onPress={goToSignInForm}>
                  {({ isPressed }) => {
                    return (
                      <Box>
                        <Text
                          color={isPressed ? colors.secondary : colors.primary}
                          letterSpacing="xl"
                          fontSize="xs"
                        >Sign in</Text>
                      </Box>
                    )
                  }}
                </Pressable>
              </Box>
            </HStack>
          </Box>
        </VStack>
    </Box>
    </>
  )
}


export default AuthSignUp;
