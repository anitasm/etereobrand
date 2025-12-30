import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyDn7I3J0y_alvjIXvez2f7fnlmRbKd_ceQ',
  authDomain: 'etereobrand-ce927.firebaseapp.com',
  projectId: 'etereobrand-ce927',
  storageBucket: 'etereobrand-ce927.firebasestorage.app',
  messagingSenderId: '1000084488702',
  appId: '1:1000084488702:web:0aaf6e1d969b63dad900af',
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)