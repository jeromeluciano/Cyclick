import { lineString } from "@turf/helpers";
import length from "@turf/length";

export const validateEmail = (email: string) => {
  console.log(email);
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
  if (reg.test(email) === false) {
    console.log("Email is Not Correct");
    return false;
  }
  else {
    return true
  }
}

export const transformCoordsToArray = (coordinates: any) => {
  // @ts-ignore
  return coordinates.map((coord) => [coord.longitude, coord.latitude])
}

export const getDistFromLine = (coordinates: any) => {
  coordinates = [...coordinates].sort((a, b) => (a.timestamp - b.timestamp))
  const points = coordinates.map((coord: any) => [coord.longitude, coord.latitude])

  const linestring = lineString(points)

  return length(linestring, { units: 'kilometers' })
}



// export const calculateDistanceKm = (coordinates: LocationObject[]) => {
//   coordinates = [...coordinates].sort((a, b) => (a.timestamp - b.timestamp))
//   const points = coordinates.map((point) => [point.coords.longitude, point.coords.latitude])

//   const linestring = lineString(points)

//   return length(linestring, { units: 'kilometers' }).toPrecision(1)
// }
