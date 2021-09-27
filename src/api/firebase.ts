import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyBRJCUzACYgeeyteZb7nxyNotRaXJ42ySA",
  authDomain: "cyclick-6b95d.firebaseapp.com",
  projectId: "cyclick-6b95d",
  storageBucket: "cyclick-6b95d.appspot.com",
  messagingSenderId: "798342004914",
  appId: "1:798342004914:web:e23e7c58d6041c456249ab"
};



export const app = firebase.initializeApp(firebaseConfig)


export const auth = firebase.auth()

export const firestore = firebase.firestore()