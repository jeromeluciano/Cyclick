import { Entypo, Feather, Foundation, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect } from "react";
import { Image, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { auth } from "../api/firebase";
import { RootState } from "../features/store";
import NavigationStackScreen from "./navigation-stack-screen";
import AccountScreen from "./tabs/account-screen";
import CycleGuideScreen from "./tabs/cycle-guide-screen";
import ExploreScreen from "./tabs/explore-screen";
import NavigationScreen from "./tabs/navigation-screen";
import TrackRecordingScreen from "./tabs/track-recording-screen";
import TrackRecordingStackScreen from "./track-recording-stack-screen";

const Tab = createBottomTabNavigator();

const RootTabScreen = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <Tab.Navigator screenOptions={{
      header: () => null,
      tabBarLabel: () => null
    }}>
      <Tab.Screen name="explore" component={ExploreScreen} options={{
        tabBarIcon: ({ color, size }) => <Ionicons name="map-sharp" size={size} color={color} />
      }}/>
      <Tab.Screen name="navigation" component={NavigationStackScreen} options={{
        tabBarIcon: ({ color, size }) => <Feather name="navigation" size={size} color={color} />
      }}/>
      <Tab.Screen name="track-recording" component={TrackRecordingStackScreen} options={{
        tabBarIcon: ({ color, size }) => <Foundation name="record" size={size} color={color} />,
        tabBarStyle: {
          display: 'none'
        }
      }}/>
      <Tab.Screen name="guide" component={CycleGuideScreen} options={{
        tabBarIcon: ({ color, size }) => <Entypo name="open-book" size={size} color={color} />
      }}/>
      <Tab.Screen name="account" component={AccountScreen} options={{
        tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="account-circle" size={size} color={color} />
      }}/>
    </Tab.Navigator>
  );
};

export default RootTabScreen;
