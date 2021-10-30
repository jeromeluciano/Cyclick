import React, {
  useEffect,
  useState,
  useRef
} from 'react'
import { FlatList, Keyboard, StyleSheet, Text, TextInput, View } from 'react-native'
import { geocoder } from '../../api/mapbox/geocoder'
import _ from 'lodash'
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../features/store'
import { FontAwesome } from '@expo/vector-icons'
import { openSearchBar } from '../../features/navigation/navigation-slice'
import { colors } from '../../constants/colors'
import { Box, Pressable } from 'native-base'

//@ts-ignore
const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    { children }
  </TouchableWithoutFeedback>
)

const SearchPlacesInput = ({ handleOnPress }) => {

  const [search, setSearch] = useState<string>('')
  const [result, setResult] = useState<any>()
  const [searchState, setSearchState] = useState<boolean>(false);
  const navigation = useSelector((state: RootState) => state.navigation)
  const dispatch = useDispatch()

  const searchPlace = _.debounce((place: string) => {
    geocoder.forwardGeocode({
      query: place,
      limit: 2,
      autocomplete: true,
      countries: ['ph']
    })
    .send()
    .then((response: any) => {
      setResult(response)
    })
  }, 400)

  let textRef = useRef()

  const handleTextChange = (place: string) => {
    if (place.length > 2) {
      searchPlace(place)
    }
  }

  return (
    <DismissKeyboard >
      <View style={styles.container}>
        {
          <Pressable opacity={navigation.searchBarState ? 0 : 1} onPress={() => dispatch(openSearchBar())} >
            {({ isPressed }) => {
              return (
                <Box bg="white" p="3" borderTopRadius="5">
                  <FontAwesome name="search" size={24} color="black" />
                </Box>
              )
            }}
          </Pressable>
        }
        {
          result && navigation.searchBarState ? 
          <FlatList style={{ marginTop: -13 }} data={result.body.features} keyExtractor={item => item.place_name} 
            renderItem={({ item }) => {
              return (
                <TouchableOpacity onPress={() => handleOnPress(item)} style={styles.searchItem}>
                  <Text>{item.place_name}</Text>
                </TouchableOpacity>
              )
          }}/>: null
        }
      </View>
     </DismissKeyboard>
  )
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 15,
    // height: 50,
    borderRadius: 5,
    opacity: 0.8,
    position: 'relative'
  },
  container: {
    // position: 'relative',
    // flex: 1,
    // backgroundColor: 'gray',
    
  },
  searchItem: {
    // marginTop: ,
    marginHorizontal: 15,
    padding: 15,
    borderRadius: 5,
    marginVertical: 2,
    backgroundColor: 'white'
  },
  searchButton: {
    alignSelf: 'flex-end',
    margin: 15,
  
    borderRadius: 5,
    backgroundColor: '#f3f3f3',
    justifyContent: 'center',
    alignContent:'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOpacity: 0.8,
    shadowRadius: 15,
    shadowOffset : { width: 10, height: 13},
    elevation: 6
  }
})

export default SearchPlacesInput