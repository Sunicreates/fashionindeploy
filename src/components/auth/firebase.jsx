import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebasecred = {
    apiKey: "AIzaSyB0KBoFeuQBAFnLr7TWfy0Ns1eTmC6etJA",
    authDomain: "fashion-city-50195.firebaseapp.com",
    projectId: "fashion-city-50195",
    storageBucket: "fashion-city-50195.appspot.com",
    messagingSenderId: "976998275524",
    appId: "1:976998275524:web:53d8929d7971d502086c91",
    measurementId: "G-WF5J5QB43F"
};

const app = initializeApp(firebasecred);
const k = getAuth(app);
const storage = getStorage(app);
const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
});
const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => signInWithPopup(k, provider);
export { k, db, storage };
