import { AntDesign, Entypo, EvilIcons, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import React, { useState, useCallback } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  // Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import Divider from "../../components/Divider";
import AppLoader from "../../components/Utilities/AppLoader";
import { colors } from "../../constants/colors";
// import useInterFont from "../../hooks/useInterFont";
// import { Divider } from 'react-native-paper'
import * as Facebook from 'expo-facebook'
import { loginWithToken } from "../../api/auth/auth";
import { Box, FormControl, HStack, Input, Pressable, Text, VStack } from "native-base";
import validator from 'validator'
import { auth } from "../../api/firebase";
import { setUser } from "../../features/auth/auth-slice";


const AuthSignIn = () => {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation()
  // const [fontLoaded] = useInterFont()

  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')

  const [hidePassword, setHidePassword] = useState(true)

  const [emailError, setEmailError] = useState(null)

  const [passwordError, setPasswordError] = useState(null)

  const toggleHidePassword = useCallback(() => {
    setHidePassword(!hidePassword)
  }, [hidePassword])
  

  const loginWithEmail = useCallback(() => {
    if (!validator.isEmail(email)) {
      setEmailError('Invalid email format')
      return;
    } else {
      setEmailError(null)
    }

    if (password.length < 8) {
      // console.log('pass')
      setPasswordError('Password must be 8 chars long');
      return;
    } else {
      setPasswordError(null)
    }

    auth
      .signInWithEmailAndPassword(email, password)
      .then(_ => {
        setEmail('')
        setPassword('')
        setEmailError(null)
        setPasswordError(null)
      })
      .catch(error => {
        console.log(error)
        switch(error.code) {
          case 'auth/wrong-password':
            setPasswordError('Invalid credentials')
            return;
          case 'auth/user-not-found':
            setEmailError("Email address not found.")
            return;
          case 'auth/too-many-requests':
            setEmailError('Access to this account has been temporarily disabled due to many failed login attempts.')
            return;
          default:
            setPasswordError(null);
            setEmailError(null)
        }
        console.log(error.code)
      })
  }, [email, password])

  const goToSignUpForm = () => {
    navigation.navigate('auth-signup')
  }

  const gotoForgotPassword = () => {
    navigation.navigate('auth-forgot-password')
  }

  return (
    <Box flex="1" justifyContent="center" >
      <VStack space="48" >
      <View style={{ marginTop: -30 }}>
        <Box alignItems="center">
          <Image
            style={{ marginLeft: 10, width: 200, height: 200, marginBottom: 20 }}
            source={require("../../../assets/logo-500.png")}
          />
        </Box>

        <VStack justifyContent="space-between" my="5" mx="10" mt="-8">
          <Box>
            <FormControl isInvalid={emailError ? true : false}>
              <Input 
                type="email" 
                placeholder="example@domain.com"
                borderWidth="0"
                borderRadius="0"
                borderBottomWidth="1"
                value={email}
                borderBottomColor={emailError ? '#f43f5e' : colors.primary}
                InputLeftElement={
                  <Box ml="2">
                    <MaterialIcons name="email" size={24} color={emailError ? '#f43f5e' : colors.secondary} />
                  </Box>
                }
                onChangeText={(text) => setEmail(text)}
              />

            <FormControl.ErrorMessage leftIcon={
              <Box ml="2">
                <EvilIcons name="exclamation" size={24} color="#f43f5e" />
              </Box>
            }>
              {emailError}
            </FormControl.ErrorMessage>
            </FormControl>
            <FormControl mt="7" isInvalid={passwordError ? true : false}>
              {/* <FormControl.Label >
                <Text fontWeight="bold">
                  Password
                </Text>
              </FormControl.Label> */}
              <Input 
                type={hidePassword ? 'password' : 'text'} 
                placeholder="Password"
                borderWidth="0"
                borderRadius="0"
                borderBottomWidth="1"
                value={password}
                borderBottomColor={colors.primary}
                InputLeftElement={
                  <Box ml="2">
                    <FontAwesome5 name="lock" size={24} color={passwordError ? '#f43f5e' : colors.secondary} />
                  </Box>
                }
                InputRightElement={
                  <Pressable mr="2" onPress={toggleHidePassword}>
                    {
                      hidePassword ? 
                        <Entypo name="eye-with-line" size={24} color="black" />:
                        <Entypo name="eye" size={24} color="black" /> 
                    }
                  </Pressable> 
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

            <Pressable onPress={loginWithEmail}>
              {({ isPressed }) => {
                return (
                  <Box mt="10" p="4" bg={isPressed ? colors.secondary : colors.primary} borderRadius="15">
                    <Text letterSpacing="xl" fontWeight="bold" color="white" textAlign="center">SIGN IN</Text>
                  </Box>
                )
              }}
            </Pressable>
          </Box>
          
          <Box mx="10" my="6">
            <Pressable onPress={gotoForgotPassword}>
              {({ isPressed }) => {
                return (
                  <Box>
                    <Text color={isPressed ? colors.secondary : colors.primary} fontSize="xs" letterSpacing="xl" textAlign="center">
                      Forgot Password?
                    </Text>
                  </Box>
                )
              }}
            </Pressable>
          </Box>
          
        </VStack>
      </View>

      <Box m="5" alignItems="center">
            <HStack space={2}>
              <Box>
                <Text 
                  textAlign="center"
                  letterSpacing="xl"
                  fontSize="xs"
                >Don't have an account?</Text>
              </Box>
              <Box>
                <Pressable onPress={goToSignUpForm}>
                  {({ isPressed }) => {
                    return (
                      <Box>
                        <Text
                          color={isPressed ? colors.secondary : colors.primary}
                          letterSpacing="xl"
                          fontSize="xs"
                        >Sign up</Text>
                      </Box>
                    )
                  }}
                </Pressable>
              </Box>
            </HStack>
          </Box>

      
      </VStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: Dimensions.get("window").height,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  input: {
    backgroundColor: "#f3f3f3",
    width: "80%",
    alignSelf: "center",
    marginVertical: 5,
    padding: 12,
    borderRadius: 5,
  },
  loginButton: {
    alignSelf: "center",
    width: "80%",
    padding: 15,
    textAlign: "center",
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.primary,
    marginVertical: 5,
  },
  textPrimary: {
    color: colors.primary,
    textAlign: "center",
    fontFamily: "Inter_900Black"
  },
  loginText: {
    color: "white",
    textAlign: "center",
    alignContent: 'center',
    alignSelf: 'center',
    marginHorizontal: 8
  },
  facebookBtn: {
    alignSelf: "center",
    width: "80%",
    padding: 10,
    textAlign: "center",
    backgroundColor: '#1a91ff',
    borderRadius: 5,
    marginVertical: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center'
    
  },
});

export default AuthSignIn;
