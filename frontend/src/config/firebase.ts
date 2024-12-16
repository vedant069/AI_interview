import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDXbtijpoiyRzWY6GqFBusdsaasdasdad",
  authDomain: "interview-prosd-sddsd2dbfa.sdasdasdafirebaseapp.com",
  projectId: "interview-pro-d2bsddsdfa",ds
  storageBucket: "interview-pro-d2bfdsddsda.appspot.com",
  messagingSenderId: "78492819589sd3433549",
  appId: "1:784928195899:web:a613651ca13a3433d3d506c64a31e",
  measurementId: "G-8VM6M0XE43343e482"
};

// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// export const db = getFirestore(app);
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

export default app;
