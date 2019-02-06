import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

var config = {
  apiKey: "AIzaSyBwdcKmTZKdaM1g2HVmXPJU5BnDspjLflk",
  authDomain: "reslack.firebaseapp.com",
  databaseURL: "https://reslack.firebaseio.com",
  projectId: "reslack",
  storageBucket: "reslack.appspot.com",
  messagingSenderId: "472943542414"
};
firebase.initializeApp(config);

export default firebase;