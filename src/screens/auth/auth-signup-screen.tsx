import { useNavigation } from "@react-navigation/core";
import React, {
  useState
} from "react";
import {
  Alert,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { createUser, User } from "../../api/auth/auth";
import { auth } from "../../api/firebase";
import Divider from "../../components/Divider";
import AppLoader from "../../components/Utilities/AppLoader";
import { colors } from "../../constants/colors";
// import useInterFont from "../../hooks/useInterFont";
import { validateEmail } from "../../utils/utils";

const AuthSignUp = () => {
  const { top } = useSafeAreaInsets();
  // const [fontLoaded] = useInterFont();
  const navigation = useNavigation();

  const [user, setUser] = useState<User>({
    email: "",
    name: "",
    password: "",
  });

  const [confirmPassword, setConfirmPassword] = useState<string>();

  if (!fontLoaded) {
    return <AppLoader />;
  }

  const gotoLogin = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const handleSignup = () => {
    if (!(user.name.length > 2)) {
      Alert.alert('User error', 'Username must be more than 2 chars')
      return;
    }

    if (!validateEmail(user.email)) {
      Alert.alert('Email is invalid')
    }

    if (!(user.password.length > 8)) {
      Alert.alert('User error', 'Password must be more than 8 chars')
      return;
    }

    if (user.password == confirmPassword) {
      createUser(user)
        .then(response => {
          Alert.alert('Success','User successfully created.')
        })
        .catch(err => console.log(err))
  }
  }

  
  
  

  return (
    <SafeAreaView style={{ ...styles.container, marginTop: top }}>
      <View style={styles.main}>
        <View>
          <Text style={styles.h1}>Welcome</Text>
          <Text style={styles.h2}>Continue to sign up!</Text>
        </View>
        <View style={styles.formInputContainer}>
          <View style={styles.inputSpacing}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={user.name}
              placeholder="Name"
              onChange={(e) => {
                setUser({
                  ...user,
                  name: e.nativeEvent.text
                });
              }}
            />
          </View>
          <View style={styles.inputSpacing}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.input}
              value={user.email}
              placeholder="Email address"
              onChange={(e) => {
                setUser({
                  ...user,
                  email: e.nativeEvent.text
                });
              }}
            />
          </View>
          <View style={styles.inputSpacing}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.input}
              value={user.password}
              placeholder="Password"
              onChange={(e) => {
                setUser({
                  ...user,
                  password: e.nativeEvent.text
                });
              }}
            />
          </View>
          <View style={styles.inputSpacing}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <TextInput
              style={styles.input}
              value={confirmPassword}
              placeholder="Confirm password"
              onChange={(e) => {
                setConfirmPassword(e.nativeEvent.text);
              }}
            />
          </View>

          <View style={{ marginTop: 15 }}>
            <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
              <Text style={styles.textWhite}>Sign up</Text>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity style={styles.loginButton} onPress={gotoLogin}>
              <Text style={styles.textPrimary}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    height: Dimensions.get("window").height,
  },
  main: {
    width: "80%",
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
    alignContent: "center",
    margin: 25,
  },
  h1: {
    fontSize: 33,
    // fontWeight: 'bold',
    marginVertical: 3,
    color: colors.primary,
    fontFamily: "Inter-Bold",
  },
  h2: {
    fontSize: 33,
    color: colors.primary,
    fontFamily: "Inter-Light",
  },
  input: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  formInputContainer: {
    marginTop: 20,
  },
  inputLabel: {
    fontFamily: "Inter-Medium",
    color: "#898989",
    marginVertical: 3,
    fontSize: 13,
    marginHorizontal: 5,
  },
  inputSpacing: {
    marginBottom: 10,
  },
  loginButton: {
    alignSelf: "center",
    width: "100%",
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
    fontFamily: "Inter-Regular",
  },
  textWhite: {
    color: "white",
    textAlign: "center",
    fontFamily: "Inter-Regular",
  },
  signupButton: {
    alignSelf: "center",
    width: "100%",
    padding: 15,
    textAlign: "center",
    backgroundColor: colors.primary,
    borderRadius: 5,
    marginVertical: 5,
  },
});

export default AuthSignUp;
