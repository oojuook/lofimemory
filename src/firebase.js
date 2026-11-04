import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: 'AIzaSyCypzduBVumGSOqbvbX1cTe_zec9MLRZf0',
  authDomain: 'lofimemory.firebaseapp.com',
  projectId: 'lofimemory',
  storageBucket: 'lofimemory.firebasestorage.app',
  messagingSenderId: '701827206746',
  appId: '1:701827206746:web:41f91edfa367462c735263'
};

const app = initializeApp(firebaseConfig);
let messagingPromise = null;

async function loadMessagingModule() {
  if (typeof window === 'undefined') return null;
  if (messagingPromise) return messagingPromise;

  messagingPromise = (async () => {
    try {
      const { getMessaging, isSupported } = await import('firebase/messaging');
      const supported = await isSupported();
      if (!supported) return null;
      return getMessaging(app);
    } catch {
      return null;
    }
  })();

  return messagingPromise;
}

export async function getMessagingToken(options) {
  const messaging = await loadMessagingModule();
  if (!messaging) return null;
  const { getToken } = await import('firebase/messaging');
  return getToken(messaging, options);
}

export async function onMessagingMessage(callback) {
  const messaging = await loadMessagingModule();
  if (!messaging) return () => {};
  const { onMessage } = await import('firebase/messaging');
  return onMessage(messaging, callback);
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
