
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, getDocFromServer, onSnapshot } from 'firebase/firestore';
import { GameState, UserProfile } from '../types';
import firebaseConfig from '../firebase-applet-config.json';

// Allow environment variables to override config for packaging flexibility
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || (firebaseConfig as any).storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || (firebaseConfig as any).messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || (firebaseConfig as any).measurementId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || (firebaseConfig as any).firestoreDatabaseId
};

export let auth: any = null;
export let db: any = null;
let googleProvider: any = null;
let isConfigured = false;

try {
    const app = initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app, config.firestoreDatabaseId);
    googleProvider = new GoogleAuthProvider();
    isConfigured = true;
    
    // Test connection
    const testConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    };
    testConnection();
} catch (e) {
    console.warn("Firebase Initialization Failed:", e);
}

export const subscribeToAuthChanges = (callback: (user: UserProfile | null) => void) => {
    if (!auth) {
        callback(null);
        return () => {};
    }
    return onAuthStateChanged(auth, (user: User | null) => {
        if (user) {
            callback({
                id: user.uid,
                name: user.displayName || 'Pilot',
                email: user.email || 'unknown@void.net',
                avatarUrl: user.photoURL || ''
            });
        } else {
            callback(null);
        }
    });
};

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid,
      email: auth?.currentUser?.email,
      emailVerified: auth?.currentUser?.emailVerified,
      isAnonymous: auth?.currentUser?.isAnonymous,
      tenantId: auth?.currentUser?.tenantId,
      providerInfo: auth?.currentUser?.providerData.map((provider: any) => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const loginWithGoogle = async (): Promise<UserProfile> => {
    if (!isConfigured || !auth) {
        throw new Error("Firebase not configured. Please update services/firebase.ts with your credentials.");
    }
    
    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        return {
            id: user.uid,
            name: user.displayName || 'Pilot',
            email: user.email || 'unknown@void.net',
            avatarUrl: user.photoURL || ''
        };
    } catch (error: any) {
        console.error("Auth Error:", error);
        throw new Error(error.message || "Authentication failed.");
    }
};

export const logoutUser = async () => {
    if (auth) await signOut(auth);
};

export const saveGameState = async (user: UserProfile, state: Partial<GameState>) => {
    if (!db || !user.id) return false;
    
    const path = `pilots/${user.id}`;
    try {
        // Strip out complex objects or circular dependencies if any (keeping it clean)
        const safeState = {
            currentLevelId: state.currentLevelId,
            maxReachedLevel: state.maxReachedLevel,
            xp: state.xp,
            skillLevel: state.skillLevel,
            code: state.code,
            hintsUsed: state.hintsUsed,
            assessmentComplete: state.assessmentComplete,
            tutorialPhase: state.tutorialPhase,
            unlockedAchievements: state.unlockedAchievements || [],
            lastUpdated: new Date().toISOString()
        };

        await setDoc(doc(db, "pilots", user.id), safeState, { merge: true });
        return true;
    } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, path);
        return false;
    }
};

export const loadGameState = async (userId: string): Promise<Partial<GameState> | null> => {
    if (!db) return null;
    
    const path = `pilots/${userId}`;
    try {
        const docRef = doc(db, "pilots", userId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap.data() as Partial<GameState>;
        }
    } catch (e) {
        handleFirestoreError(e, OperationType.GET, path);
    }
    return null;
};

export const subscribeToGameState = (userId: string, callback: (state: Partial<GameState>) => void) => {
    if (!db) return () => {};
    
    const path = `pilots/${userId}`;
    const docRef = doc(db, "pilots", userId);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            callback(docSnap.data() as Partial<GameState>);
        }
    }, (error) => {
        handleFirestoreError(error, OperationType.GET, path);
    });
    
    return unsubscribe;
};

