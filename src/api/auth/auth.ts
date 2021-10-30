import { Alert } from "react-native";
import { app, auth, firestore } from "../firebase"
import firebase from 'firebase'

export type User = {
  id?: string,
  name: string,
  email: string,
  password: string,
}

export const loginWithToken = async (token: string) => {
  const credential = firebase.auth.FacebookAuthProvider.credential(token)
  auth
    .signInWithCredential(credential)
    .catch(err => console.log(err))
}

export const isCurrentUserAdmin = async () => {
  // check if user exist in role collection if it exists it means he/she is admin
  if (auth.currentUser) {
    const query = await firestore
      .collection('roles')
      .where('userId', '==', auth.currentUser.uid)
      .get()

    if (!query.empty) {
      return true
    } 
  }

  return false;
}