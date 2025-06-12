import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

// Votre configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCBDHUWaM_pNTFeKOvm6nTret8E4tkg7Mg",
  authDomain: "outfitiq-2.firebaseapp.com",
  projectId: "outfitiq-2",
  storageBucket: "outfitiq-2.firebasestorage.app",
  messagingSenderId: "389308463391",
  appId: "1:389308463391:web:ae058a735cf6fb4d0b182a",
  measurementId: "G-7S1LEJ5Z4R"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser Auth
const auth = getAuth(app);

// Configurer la persistance
setPersistence(auth, browserLocalPersistence);

export { auth };
export default app; 