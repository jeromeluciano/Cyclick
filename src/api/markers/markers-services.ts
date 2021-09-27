import { firestore } from "../firebase"

export const getApprovedMarkers = async () => {
  const markers = await firestore
    .collection('map_markers')
    .where('isApproved', '==' , true)
    .get()
  
  return markers;
}