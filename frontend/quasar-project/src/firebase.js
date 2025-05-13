// src/firebase.js
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyAAZDJlz2JeObL_OnU9RK-7631kUuHYfkk",
    authDomain: "programskocoffe-8bfc7.firebaseapp.com",
    projectId: "programskocoffe-8bfc7",
    storageBucket: "programskocoffe-8bfc7.appspot.com", // ← ISPRAVNO!
    messagingSenderId: "385769470014",
    appId: "1:385769470014:web:49ef8aa0f6b49f95f7f96f",
    measurementId: "G-B07ZX2P970"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const storage = getStorage(app)
