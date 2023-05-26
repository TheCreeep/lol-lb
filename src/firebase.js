import { initializeApp } from 'firebase/app'

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
const appId = import.meta.env.VITE_FIREBASE_APP_ID

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: projectId + '.firebaseapp.com',
  projectId: 'lol-lb-db',
  storageBucket: projectId + '.appspot.com',
  messagingSenderId: '56677027073',
  appId: appId
}

const app = initializeApp(firebaseConfig)

export default app
