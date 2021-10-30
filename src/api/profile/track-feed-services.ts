import { firestore } from "../firebase"

// fetch data from firebase -> transform data to feature collection -> [ duration, title, features: FeatureCollection ]
export const getMyRecordedTracks = async (uid: string) => {
  if (uid.length > 0) {
    const tracks: any = []
    const tracksQuery = await firestore
      .collection('tracks')
      .where('uid', '==', uid)
      .get()
    
    tracksQuery.forEach((track) => {
      tracks.push({
        id: track.id,
        ...track.data()
      })
    })

    return tracks;
  }
  return null;
}