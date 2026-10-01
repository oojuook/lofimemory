import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getMessaging, isSupported } from 'firebase/messaging';

export const firebaseConfig = {
  apiKey: 'AIzaSyCypzduBVumGSOqbvbX1cTe_zec9MLRZf0',
  authDomain: 'lofimemory.firebaseapp.com',
  projectId: 'lofimemory',
  storageBucket: 'lofimemory.firebasestorage.app',
  messagingSenderId: '701827206746',
  appId: '1:701827206746:web:41f91edfa367462c735263'
};

const app = initializeApp(firebaseConfig);
const messagingSupportPromise = isSupported().catch(() => false);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export async function getMessagingIfSupported() {
  const supported = await messagingSupportPromise;
  if (!supported) return null;
  return getMessaging(app);
}
