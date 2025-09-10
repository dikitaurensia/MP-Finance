import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/messaging'

const firebaseConfig = {
  apiKey: "AIzaSyCBWJGeI91CTekAddO8DVtaXZaDhiFkIJc",
  authDomain: "mitran-1dc87.firebaseapp.com",
  databaseURL: "https://mitran-1dc87.firebaseio.com",
  projectId: "mitran-1dc87",
  storageBucket: "mitran-1dc87.appspot.com",
  messagingSenderId: "643756140027",
  appId: "1:643756140027:web:73eae674c5f9bbea3b175e",
  measurementId: "G-S278WPRZZB"
};

firebase.initializeApp(firebaseConfig);
//   firebase.analytics();

export default firebase;