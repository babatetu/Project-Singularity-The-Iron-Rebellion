
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { GameState, UserProfile } from '../types';

// ------------------------------------------------------------------
// CONFIGURATION
// Replace the values below with your specific Firebase Project Config
// ------------------------------------------------------------------
const firebaseConfig = {
  apiKey: "PLACEHOLDER_API_KEY", 
  authDomain: "placeholder-project.firebaseapp.com",
  projectId: "placeholder-project",
  storageBucket: "placeholder-project.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000000000"
};

let auth: any = null;
let db: any = null;
let googleProvider: any = null;
let isConfigured = false;

try {
    // Basic check to see if config is still default
    if (firebaseConfig.apiKey !== "PLACEHOLDER_API_KEY") {
        const app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        googleProvider = new GoogleAuthProvider();
        isConfigured = true;
    }
} catch (e) {
    console.warn("Firebase Initialization Failed:", e);
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
        console.error("Cloud Save Failed:", e);
        return false;
    }
};

export const loadGameState = async (userId: string): Promise<Partial<GameState> | null> => {
    if (!db) return null;
    
    try {
        const docRef = doc(db, "pilots", userId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
            return docSnap.data() as Partial<GameState>;
        }
    } catch (e) {
        console.error("Cloud Load Failed:", e);
    }
    return null;
};
