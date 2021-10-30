import { Foundation } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

export const AnnotationConten = ({
  customisedName,
 }) => {
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{customisedName}</Text>
      </View>
      <Foundation name="marker" size={24} color="black" />
    </View>
  );
 };
  
 export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: moderateScale(100),
    backgroundColor: 'transparent',
    height: moderateScale(100),
  },
  textContainer: {
    backgroundColor: 'white',
    borderRadius: moderateScale(10),
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    paddingHorizontal: moderateScale(5),
    flex: 1,
  },
  icon: {
    paddingTop: moderateScale(10),
  },
 });