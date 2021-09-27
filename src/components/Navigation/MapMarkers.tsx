import React from 'react'
import { useDispatch } from 'react-redux'
import { fetchApprovedMarkers } from '../../features/navigation/markers-slice'

const MapMarkers = () => {
  const dispatch = useDispatch()

  React.useEffect(() => {
    (async () => {
      dispatch(fetchApprovedMarkers())
    })()
  }, [])

  return (
    <>

    </>
  )
}

export default MapMarkers