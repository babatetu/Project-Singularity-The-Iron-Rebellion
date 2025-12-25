import React, { useState } from 'react';
import { UserProfile } from '../types';
import { loginWithGoogle } from '../services/firebase';

interface LoginModalProps {
  onLogin: (user: UserProfile) => void;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onLogin, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginWithGoogle();
      onLogin(user);
    } catch (e: any) {
      console.error(e);
      // Fallback/Simulation for demo purposes if firebase isn't set up by the user
      if (e.message.includes("Firebase not configured")) {
         setError("SYSTEM ERROR: Firebase Config Missing. (Check services/firebase.ts)");
         
         // Optional: Still let them in as 'Guest' after a delay for UX testing
         setTimeout(() => {
             const mockUser: UserProfile = {
                id: 'sim_user_99',
                name: 'Pilot Sim',
                email: 'sim@localhost',
                avatarUrl: ''
             };
             onLogin(mockUser);
         }, 2000);
      } else {
         setError("CONNECTION FAILED: " + e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md bg-cyber-dark border border-gray-700 shadow-[0_0_50px_rgba(0,0,0,0.8)] p-8 relative overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Cyberpunk Accents */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-neon to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-cyber-neon opacity-50"></div>

        <h2 className="text-2xl font-bold text-white mb-2 tracking-wider">CLOUD LINK</h2>
        <p className="text-xs text-gray-500 mb-8 uppercase tracking-widest">Establish Secure Neural Connection</p>

        <div className="space-y-4">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white text-gray-900 font-bold py-3 px-4 rounded flex items-center justify-center gap-3 hover:bg-gray-200 transition-all relative overflow-hidden group"
          >
             {loading ? (
                 <span className="flex items-center gap-2">
                     <span className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></span>
                     AUTHENTICATING...
                 </span>
             ) : (
                 <>
                    {/* Google Icon SVG */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                        />
                        <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                        />
                        <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                        />
                        <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                        />
                    </svg>
                    <span>Sign in with Google</span>
                 </>
             )}
          </button>
          
          {error && (
              <div className="p-3 bg-red-900/30 border border-red-500 text-red-400 text-xs font-mono">
                  {error}
              </div>
          )}

          <div className="text-center text-[10px] text-gray-600 mt-4">
             By connecting, you agree to store your mission data on the Global Defense Grid (Google Firestore).
          </div>
        </div>

        <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-white"
        >
            ✕
        </button>

      </div>
    </div>
  );
};