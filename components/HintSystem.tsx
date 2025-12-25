import React from 'react';
import { HintData, TutorialPhase } from '../types';

interface HintSystemProps {
  hintData?: HintData;
  activeTier: number;
  tutorialPhase: TutorialPhase;
  onDismiss: () => void;
  onUseSolution: () => void;
}

export const HintSystem: React.FC<HintSystemProps> = ({ 
  hintData, 
  activeTier, 
  tutorialPhase, 
  onDismiss,
  onUseSolution
}) => {

  // I DO Mode Overlay
  if (tutorialPhase === 'IDO') {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
        <div className="bg-black/80 border border-cyber-neon text-cyber-neon px-6 py-4 rounded backdrop-blur-sm animate-pulse shadow-[0_0_20px_rgba(0,243,255,0.3)]">
           <div className="text-xs uppercase tracking-widest mb-1">A.D.A.M. Demonstration</div>
           <div className="text-xl font-bold">OBSERVE TERMINAL INPUT</div>
        </div>
      </div>
    );
  }

  // WE DO Mode Overlay
  if (tutorialPhase === 'WEDO') {
    return (
      <div className="absolute top-20 right-10 z-40 max-w-xs animate-bounce">
         <div className="bg-cyber-gold/10 border border-cyber-gold text-cyber-gold p-4 rounded backdrop-blur-sm">
            <div className="flex items-start gap-3">
               <span className="text-xl">☝️</span>
               <div>
                  <h4 className="font-bold text-sm uppercase">Your Turn</h4>
                  <p className="text-xs mt-1">Type <code className="bg-black/50 px-1 rounded">print("POWER_CORE_ONLINE")</code> exactly as shown.</p>
               </div>
            </div>
         </div>
      </div>
    );
  }

  // Standard Hints
  if (!hintData || activeTier === 0) return null;

  const getHintContent = () => {
    switch (activeTier) {
      case 1: return hintData.tier1;
      case 2: return hintData.tier2;
      case 3: return hintData.tier3;
      case 4: return hintData.tier4;
      default: return "";
    }
  };

  return (
    <div className="absolute bottom-20 right-10 z-50 w-80 animate-[slideIn_0.5s_ease-out]">
      <div className={`bg-cyber-dark border-l-4 shadow-2xl p-4 relative ${activeTier === 4 ? 'border-cyber-red' : 'border-cyber-neon'}`}>
        
        {/* Avatar & Header */}
        <div className="flex items-center gap-3 mb-3">
           <div className="w-8 h-8 bg-cyan-900 rounded flex items-center justify-center border border-cyan-500">
             <span className="font-bold text-xs text-white">AI</span>
           </div>
           <div>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest">
                Hint Tier {activeTier}/4
              </div>
              <div className="text-xs font-bold text-white">A.D.A.M. Protocol</div>
           </div>
           <button 
             onClick={onDismiss} 
             className="ml-auto text-gray-500 hover:text-white"
           >✕</button>
        </div>

        {/* Content */}
        <div className="text-sm text-gray-300 font-mono mb-4 leading-relaxed bg-black/30 p-2 rounded">
          {getHintContent()}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
           {activeTier === 4 ? (
             <button 
               onClick={onUseSolution}
               className="px-3 py-1 bg-cyber-red/20 text-cyber-red border border-cyber-red/50 text-xs uppercase hover:bg-cyber-red hover:text-black transition-colors"
             >
               Auto-Complete (-50 XP)
             </button>
           ) : (
             <span className="text-[10px] text-gray-600 italic">Waiting for input...</span>
           )}
           
           <button 
             onClick={onDismiss}
             className="text-xs text-cyber-neon hover:underline"
           >
             Got it
           </button>
        </div>

      </div>
    </div>
  );
};