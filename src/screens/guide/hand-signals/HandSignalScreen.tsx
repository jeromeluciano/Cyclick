import React, {
  useEffect,
  useState,
} from 'react'

import {
  ScrollView,
  FlatList,
  Pressable,
  Box,
  Text,
  Image,
  VStack,
  HStack,
  Modal
} from 'native-base'

import {
  storage
} from '../../../api/firebase'

import {
  useNavigation
} from '@react-navigation/core'

const HandSignalScreen = () => {

  const navigation = useNavigation()

  const [showModal, setShowModal] = useState(false)

  const getImageUrl = async (filename: string) => {
    return await storage.ref(`Hand Signals/${filename}`).getDownloadURL()
  }

  const [imageFocused, setImageFocused] = useState('');

  const [data, setData] = useState([])

  const handleFocusedImage = (url: string) => {
    setShowModal(true)
    setImageFocused(url)
  }

  const handleModalClosed = () => {
    setShowModal(false)
    setImageFocused('')
  }

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Hand Signals'
    })

    const data = require('./hand-signals.json').data
    setData(data)

    data.forEach(item => {
      getImageUrl(item.filename).then(url => {
        console.log(url, '-', item.filename)
      })
    })
  }, [ ])

  return (
    <ScrollView>
      <Box m="4">
        <FlatList 
          data={data}
          renderItem={({ item }) => {
            return (
              <Pressable borderRadius="10" overflow="hidden" mb="5" onPress={() => handleFocusedImage(item.image_url)}>
                {({ isPressed }) => {
                  return (
                      <HStack bg={isPressed ? 'gray.50' : 'white'}>
                        <Box>
                          <Image 
                            w="160"
                            height="150"
                            alt={item.title}
                            source={{
                              uri: item.image_url,
                              cache: 'only-if-cached'
                            }}
                          />
                        </Box>
                        <Box m="4" flex="1" justifyContent="center">
                          <Text textAlign="center"  fontWeight="bold" fontSize="xl" >
                            { item.title }
                          </Text>
                        </Box>
                      </HStack>
                  )
                }}
              </Pressable>
            )
          }}
        />
      </Box>
      <Modal isOpen={showModal} onClose={handleModalClosed}>
        <Modal.Content w="full" height="2/4">
          <Image
            w="400"
            h="400"
            alt="fullscreen"
            resizeMode={'contain'}
            source={{
              uri: imageFocused,
              cache: 'only-if-cached'
            }}
          />
        </Modal.Content>
      </Modal>
    </ScrollView>
  )
}

export default HandSignalScreen;