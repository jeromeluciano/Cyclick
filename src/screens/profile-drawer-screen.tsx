import { createDrawerNavigator } from '@react-navigation/drawer'
import React, {
  useEffect,
  useState
} from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'
import UserProfile from '../components/Profile/UserProfile'
import { colors } from '../constants/colors'
import { RootState } from '../features/store'
import ProfileStackScreen from './ProfileStackScreen'
import { isCurrentUserAdmin } from '../api/auth/auth'
import { StatusBar } from 'native-base'
import { AntDesign, Entypo, FontAwesome, FontAwesome5, Foundation, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { getFocusedRouteNameFromRoute, useNavigation } from '@react-navigation/core'
import AddMarkersScreen from './markers/AddMarkersScreen'
import PendingMarkerStackScreen from './pending-marker-stack-screen'
import AddBikeLaneScreen from './markers/AddBikeLaneScreen'
import NetInfo from '@react-native-community/netinfo'
import Logout from './auth/Logout'

const Drawer = createDrawerNavigator()



const ProfileDrawerMenuScreen = () => {

  const { top } = useSafeAreaInsets();
  // get user from redux
  const user = useSelector((state: RootState) => state.auth.user)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(async (state) => {
      if (state.isConnected && state.isInternetReachable) {
        const checkUserRole = await isCurrentUserAdmin()
        setIsAdmin(checkUserRole)
      } else {
        setIsAdmin(false)
      }
    })
    
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  return (
    <Drawer.Navigator screenOptions={({ navigation }) => ({
      headerStatusBarHeight: top,
        drawerActiveTintColor: colors.primary,
        drawerStyle: {
          justifyContent:"center"
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTitleStyle: {
          color: "white"
        },
        headerLeft: ({ size, color }) => (
          <Entypo 
            onPress={() => {
              navigation.openDrawer()
            }} 
            name="menu" 
            size={30} 
            color="white" 
            style={{
              margin: 15
            }}
          />
        )
      })
    }
    >
     
      <Drawer.Screen 
        name="profile-menu" 
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route)
          if (routeName == 'profile-feed-full-screen') {
            return {
              drawerLabel: "My Tracks",
              drawerIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={color} />,
              header: () => null
            }
          }
          // console.log('Route name: ', routeName)
          return {
            drawerLabel: "My tracks",
            headerTitle: user?.displayName,
            drawerIcon: ({ color, size }) => <Ionicons name="person-circle-outline" size={size} color={color} />
          }
        }} 
        component={ProfileStackScreen} 
      />

      

      <Drawer.Screen 
        name="add-markers-profile"
        component={AddMarkersScreen}
        options={{
          drawerLabel: "Add markers",
          headerTitle: "Add Markers",
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="map-marker-circle" size={size} color={color} />
        }}
      />
        
      <Drawer.Screen 
        name="add-bikelanes-profile"
        component={AddBikeLaneScreen}
        options={{
          drawerLabel: "Add Bike lanes",
          headerTitle: "Add Bike lanes",
          drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="map-marker-path" size={size} color={color} />
        }}
      />

      {
        isAdmin ?
        <Drawer.Screen 
          name="map-request" 
          options={{
            headerTitle: "Pending Request",
            drawerLabel: "Pending Request",
            drawerIcon: ({ color, size }) => <MaterialIcons name="pending-actions" size={size - 2} color={color} />
          }} 
          component={PendingMarkerStackScreen} 
        />: null
      }

      <Drawer.Screen 
        name="Logout"
        options={{
          drawerIcon: ({color, size}) => <AntDesign name="logout" size={size -2} color='red' />,
        }}
        component={Logout}
      />
      
    </Drawer.Navigator>
  )
}

export default ProfileDrawerMenuScreen