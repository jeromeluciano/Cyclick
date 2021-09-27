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
import useInterFont from "../../hooks/useInterFont";
// import { Divider } from 'react-native-paper'

const AuthSignIn = () => {
  const { top } = useSafeAreaInsets();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigation = useNavigation()
  const [fontLoaded] = useInterFont()

  if (!fontLoaded) {
    return <AppLoader />
  }

  const gotoSignup = () => {
    // @ts-ignore
    navigation.navigate('auth-signup')
  }

  return (
    <SafeAreaView style={{ ...styles.container, marginTop: top }}>
      <View style={{ marginTop: "15%" }}>
        <Image
          style={{ marginLeft: 10 }}
          source={require("../../../assets/icon.png")}
        />
        <TextInput
          value={email}
          style={styles.input}
          placeholder={"Email address"}
          onChange={(e) => {
            setEmail(e.nativeEvent.text);
          }}
        />
        <TextInput
          value={password}
          style={styles.input}
          placeholder={"Password"}
          secureTextEntry={true}
          onChange={(e) => {
            setPassword(e.nativeEvent.text);
          }}
        />
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.textPrimary}>Login</Text>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity style={styles.signupButton} onPress={gotoSignup}>
          <Text style={styles.textGray}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: Dimensions.get("window").height,
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
  textGray: {
    color: "white",
    textAlign: "center",
  },
  signupButton: {
    alignSelf: "center",
    width: "80%",
    padding: 15,
    textAlign: "center",
    backgroundColor: colors.primary,
    borderRadius: 5,
    marginVertical: 5,
  },
});

export default AuthSignIn;
