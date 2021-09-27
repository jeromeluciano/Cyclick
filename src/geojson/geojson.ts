import { lineString } from "@turf/helpers";
import length from "@turf/length";
import { LocationObject } from "expo-location";


export const calculateDistanceFromPoints = (coordinates: LocationObject[]) => {
  coordinates = [...coordinates].sort((a, b) => (a.timestamp - b.timestamp))
  const points = coordinates.map((point) => [point.coords.longitude, point.coords.latitude])

  const linestring = lineString(points)

  return length(linestring)
}