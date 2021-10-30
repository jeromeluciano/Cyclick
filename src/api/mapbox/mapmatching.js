import MapMatching from "@mapbox/mapbox-sdk/services/map-matching";
import geojsonTidy from '@mapbox/geojson-tidy'

export const mapMatching = MapMatching({
  accessToken: 'pk.eyJ1IjoiampkbHVjaWFubyIsImEiOiJja3JkZ3gzZjk1Y3J3MzFvNmJ5ZG5iZ2RmIn0.X7IWxzKNS-hLmwJ__CaMCQ'
})

export const mapMatchCoordinates = async (coordinates) => {
  const coords = coordinates.map((coord) => {
    return {
      coordinates: [
        coord.coords.longitude,
        coord.coords.latitude
      ]
    }
  })

  // console.log(tidyLineString)
  console.log(coords)
  const mapMatchResponse = await mapMatching.getMatch({
    profile: 'cycling',
    points: coords,
    tidy: true
  })
  .send()

  return mapMatchResponse;

}