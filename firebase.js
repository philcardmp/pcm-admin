import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDC1X9-3Pf8r4Ljp5gtXhpeROPwJjiaGW4",
  authDomain: "talasulod.firebaseapp.com",
  projectId: "talasulod",
  storageBucket: "talasulod.appspot.com",
  messagingSenderId: "843234501566",
  appId: "1:843234501566:web:eed3b2754244642531cfef"
};

// Use this to initialize the firebase App
const firebaseapp = firebase.initializeApp(firebaseConfig);

// Use for db
const db = firebaseapp.firestore();

// Use for image storage
const storage = firebase.storage();

export { db, storage };
