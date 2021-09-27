import MapboxGL from '@react-native-mapbox-gl/maps'
import React from 'react'
import { Image } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { fetchApprovedMarkers } from '../../features/navigation/markers-slice'
import { RootState } from '../../features/store'
import bikeRepairIcon from '../../../assets/markers/bike_repair.png'
import bikeShopIcon from '../../../assets/markers/bike_shop_.png'
import waitingShedIcon from '../../../assets/markers/waiting_shed.png'

const styles = {
  bikeRepair: {
    iconImage: bikeRepairIcon,
    iconAllowOverlap: true,
    iconSize: 0.4
  },
  bikeShop: {
    iconImage: bikeShopIcon,
    iconAllowOverlap: true,
    iconSize: 0.4
  },
  waitingShed: {
    iconImage: waitingShedIcon,
    iconAllowOverlap: true,
    iconSize: 0.4
  },
}

const MapMarkers = () => {
  const dispatch = useDispatch()
  const markers = useSelector((state: RootState) => state.marker.markers)
  // console.log(markers)
  // console.log(markers)
  React.useEffect(() => {
    (async () => {
      dispatch(fetchApprovedMarkers())
      
    })()
  }, [])

  return (
    <>
    {
      markers ?
        <MapboxGL.ShapeSource 
          id="bike-markers-source"
          hitbox={{width: 20, height: 20}}
           // @ts-ignore
          shape={markers}
          filter={[
            'all',
            ['==', 'type', 'bike_shop']
          ]} 
        >
          <MapboxGL.SymbolLayer 
            filter={[
              'all',
              ['==', 'type', 'bike_shop']
            ]} 
            id="bike-markers" 
            style={styles.bikeShop}
            minZoomLevel={12}
          />
        </MapboxGL.ShapeSource>: null
    }

    {
      markers ?
        <MapboxGL.ShapeSource 
          id="bikeRepair-markers-source"
          hitbox={{width: 20, height: 20}}
           // @ts-ignore
          shape={markers}
          filter={[
            'all',
            ['==', 'type', 'bike_repair']
          ]} 
        >
          <MapboxGL.SymbolLayer 
            filter={[
              'all',
              ['==', 'type', 'bike_repair']
            ]} 
            id="bikeRepair-markers" 
            style={styles.bikeRepair}
            minZoomLevel={12}
          />
        </MapboxGL.ShapeSource>: null
    }
    {
      markers ?
        <MapboxGL.ShapeSource 
          id="waitingShed-markers-source"
          hitbox={{width: 20, height: 20}}
           // @ts-ignore
          shape={markers}
          filter={[
            'all',
            ['==', 'type', 'waiting_shed']
          ]} 
        >
          <MapboxGL.SymbolLayer 
            filter={[
              'all',
              ['==', 'type', 'waiting_shed']
            ]} 
            id="waitingShed-markers" 
            style={styles.bikeRepair}
            minZoomLevel={12}
          />
        </MapboxGL.ShapeSource>: null
    }
    </>
  )
}

export default MapMarkers