import React, {
  useEffect,
  useState
} from 'react'
import { Button, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import NetInfo from '@react-native-community/netinfo'
import { firestore } from '../../api/firebase'

const CycleGuideScreen = () => {
  const { top } = useSafeAreaInsets()
  const [netState, setNetState] = useState<boolean>(false)


  useEffect(() => {
    const netInfoSub = NetInfo.addEventListener(state => {
      if (state.isInternetReachable) {
        setNetState(true)
      } else {
        setNetState(false)
      }
    })

    return () => {
      if (netInfoSub) {
        netInfoSub()
      }
    }
  }, [])


  const sendTestDataToFirestore = () => {
    firestore
      .collection('tests')
      .add({
        message: 'Say so!'
      })

    console.log('send data is pressed!')
  }

  return (
    <View style={{ marginTop: top }}>


      <Text>{ netState ? 'Internet is accessible':'No internet' }</Text>
      <Button title='send data' onPress={sendTestDataToFirestore}/>
    </View>
  )
}

export default CycleGuideScreen