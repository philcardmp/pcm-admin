import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAFriDtm6gSVPxeUSq4dGfUIQNB81M8_1Q",
  authDomain: "pcm-main.firebaseapp.com",
  projectId: "pcm-main",
  storageBucket: "pcm-main.appspot.com",
  messagingSenderId: "556436738145",
  appId: "1:556436738145:web:a77185316c90b59f369a20",
};

// Use this to initialize the firebase App
const firebaseapp = firebase.initializeApp(firebaseConfig);

// Use for db
const db = firebaseapp.firestore();

// Use for image storage
const storage = firebase.storage();

export { db, storage };
