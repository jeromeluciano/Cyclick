import { Point } from "@react-native-mapbox-gl/maps"
import { LocationObject } from "expo-location"
import length from '@turf/length'
import { lineString } from "@turf/helpers"

export type LineStringType = {
  type: string,
  geometry: {
    type: string,
    coordinates: any
  }
}

export const LineString = {
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: []
  }
}

export const createLineString = () => LineString

export const calculateDistanceKm = (coordinates: LocationObject[]) => {
  coordinates = [...coordinates].sort((a, b) => (a.timestamp - b.timestamp))
  const points = coordinates.map((point) => [point.coords.longitude, point.coords.latitude])

  const linestring = lineString(points)

  return length(linestring, { units: 'kilometers' }).toPrecision(1)
}
