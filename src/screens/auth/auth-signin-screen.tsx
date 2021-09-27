import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/core";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
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

const AuthSignIn = () => {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation()
  // const [fontLoaded] = useInterFont()

  const loginWithFacebook = async () => {
    try {
      await Facebook.initializeAsync({
        appId: '874246013199070'
      })

      const {
        type,
        token,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });

      if (type == 'success') {
        // signin using token
        loginWithToken(token)
      }
      
    }catch (e) {
      console.log(e)
    }
    
  }

  return (
    <SafeAreaView style={{ ...styles.container, marginTop: top }}>
      <View style={{ marginTop: -20 }}>
        <Image
          style={{ marginLeft: 10 }}
          source={require("../../../assets/icon.png")}
        />

        <TouchableOpacity style={styles.facebookBtn} onPress={loginWithFacebook}>
          <AntDesign name="facebook-square" size={30} color="white" />
          <Text style={styles.loginText}>
            Login with Facebook
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    backgroundColor: colors.primary,
    borderRadius: 5,
    marginVertical: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center'
    
  },
});

export default AuthSignIn;
