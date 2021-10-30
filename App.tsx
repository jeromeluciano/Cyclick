import 'expo-dev-client'
// import './mockLocation'
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, {
  useEffect
} from 'react';
import { LogBox, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AuthStackScreen from './src/screens/auth-stack-screen';
import AuthScreen from './src/screens/auth/auth-signin-screen';
import { Provider as StoreProvider } from 'react-redux'
import { store } from './src/features/store';
import RootNavigator from './src/screens/root-navigator';
import { useFonts } from '@expo-google-fonts/inter';
import MapboxGL from '@react-native-mapbox-gl/maps';
import { defineTask } from 'expo-task-manager';
import { RECORD_LOCATION_ON_BACKGROUND } from './src/hooks/useTrackUserLocationOnBackground';
import { LocationObject } from 'expo-location';
import { addLocation, recalculateFeatures } from './src/features/tracks/track-slice';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { calculateDistanceFromPoints } from './src/geojson/geojson';
import firebase from 'firebase'
import NetInfo from '@react-native-community/netinfo'
import { setNetworkStatus } from './src/screens/app/permission-slice';
import { NativeBaseProvider } from 'native-base';

LogBox.ignoreLogs(['Setting a timer for a long period of time'])
LogBox.ignoreLogs(['Mapbox warning, eglSwapBuffer error: 12301'])
// firebase.firestore.setLogLevel('debug')
MapboxGL.setAccessToken('pk.eyJ1IjoiampkbHVjaWFubyIsImEiOiJja3JkZ3gzZjk1Y3J3MzFvNmJ5ZG5iZ2RmIn0.X7IWxzKNS-hLmwJ__CaMCQ')

export default function App() {

  const [fontLoaded] = useFonts({
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
    'Inter-Light': require('./assets/fonts/Inter-Light.ttf'),
    'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
    'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
  })

  useEffect(() => {
    const netInfoSub = NetInfo.addEventListener(state => {
      if (state.isInternetReachable) {
        store.dispatch(setNetworkStatus(true))
      } else {
        store.dispatch(setNetworkStatus(false))
      }
    })

    return () => {
      if (netInfoSub) {
        netInfoSub()
      }
    }
  }, [])

  return (
    <SafeAreaProvider>
      <NativeBaseProvider>
        <StoreProvider store={store}>
          <NavigationContainer>
            <ActionSheetProvider>
              <RootNavigator />
            </ActionSheetProvider>
          </NavigationContainer>
        </StoreProvider>
      </NativeBaseProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
});


defineTask(RECORD_LOCATION_ON_BACKGROUND, ({ data, error }) => {
  if (error) {
    return;
  }

  const track = store.getState().track
  //@ts-ignore
  const location = data.locations[data.locations.length - 1]

  if (track.recording) {
    store.dispatch(addLocation(location))
    store.dispatch(recalculateFeatures())
    console.log(store.getState().track.coordinates.length)
  }
  
})