import { firestore } from "../firebase"

export const getApprovedMarkers = async () => {
  const markers: any = []
  const markersQuery = await firestore
    .collection('map_markers')
    .where('isApproved', '==' , true)
    .get()

    markersQuery.forEach((marker) => {
      markers.push({
        id: marker.id,
        ...marker.data()
      })
    })
  
  return markers;
}