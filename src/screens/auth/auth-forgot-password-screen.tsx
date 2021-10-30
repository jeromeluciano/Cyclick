import { AntDesign, EvilIcons, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import React, { useState, useCallback } from "react";

import { Box, FormControl, HStack, Image, Input, Pressable, Text, VStack } from "native-base";
import validator from 'validator'
import { colors } from "../../constants/colors";
import { auth } from "../../api/firebase";


const AuthForgotPassword = () => {

  const [email, setEmail] = useState('')
  
  type EmailResponseType = {
    status: string | null,
    message: string | null
  }

  const [response, setResponse] = useState<EmailResponseType>({
    status: null,
    message: null
  })

  const handleForgotPassword = useCallback(() => {
    console.log('sending forgot password')
    if (!validator.isEmail(email)) {
      setResponse({
        status: 'failed',
        message: 'Invalid email format'
      })
      return;
    } else {
      setResponse({
        status: null,
        message: null
      })
    }

    auth.sendPasswordResetEmail(email)
      .then( _ => {
        setResponse({
          status: 'success',
          message: 'Email has been sent to you, please check and verify.'
        })
        setEmail('')
      })
      .catch(error => {
        setResponse({
          status: 'failed',
          message: "Something unexpected happen."
        })
        console.log(error)
      })
  }, [email])

  return (
    <Box flex="1" justifyContent="center">

      <VStack space="56">
        
        <Box>
          <Box alignItems="center">
            <Image
              alt="logo"
              style={{ marginLeft: 10, width: 200, height: 200, marginBottom: 20 }}
              source={require("../../../assets/logo-500.png")}
            />
          </Box>
          
          <VStack space={5} justifyContent="space-between" my="5" mx="10" mt="-8">
            <Box>
              <Text 
                textAlign="center"
                fontSize="lg"
                fontWeight="bold"
                letterSpacing="xl"
              >Forgot your password?</Text>
            </Box>
            <Box>
              <Text 
                textAlign="center"
                fontSize="xs"
                color="gray.500"
                // fontWeight=""
                letterSpacing="lg"
              >Enter your registered email below to receive password reset instruction</Text>
            </Box>
            <Box>
              <FormControl isInvalid={response.status == 'failed' ? true : false}>
                <Input 
                  type="email" 
                  placeholder="example@domain.com"
                  borderWidth="0"
                  borderRadius="0"
                  borderBottomWidth="1"
                  value={email}
                  borderBottomColor={response.status == 'failed' ? '#f43f5e' : colors.primary}
                  InputLeftElement={
                    <Box ml="2">
                      <MaterialIcons name="email" size={24} color={response.status == 'failed' ? '#f43f5e' : colors.secondary} />
                    </Box>
                  }
                  onChangeText={(text) => setEmail(text)}
                />
              <FormControl.ErrorMessage leftIcon={
                <Box ml="2">
                  <EvilIcons name="exclamation" size={24} color="#f43f5e" />
                </Box>
              }>
                {response.message}
              </FormControl.ErrorMessage>
              {
                response.status && response.status == 'success' ?
                <FormControl.HelperText>
                  <Text textAlign="center" fontSize="xs" color="green.500">
                    {response.message}
                  </Text>
                </FormControl.HelperText> : null
              }
              </FormControl>
            </Box>
            
            <Box>
              <Pressable my="3" onPress={handleForgotPassword} >
                {({ isPressed }) => {
                  return (
                    <Box>
                      <Text 
                        textAlign="center"
                        bg={colors.primary}
                        py="4"
                        color="white"
                        letterSpacing="xl"
                        fontWeight="bold"
                        borderRadius="15"
                      >
                        RESET PASSWORD
                      </Text>
                    </Box>
                  )
                }}
              </Pressable>
            </Box>

            </VStack>
          </Box>
      </VStack>
    </Box>
  );
};


export default AuthForgotPassword;
