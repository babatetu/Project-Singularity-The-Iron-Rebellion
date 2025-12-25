
import React, { useEffect } from 'react';
import { Achievement } from '../types';

interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onClose }) => {
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 right-0 z-[100] animate-[slideIn_0.5s_ease-out]">
      <div className="bg-cyber-black border-l-4 border-cyber-gold p-4 shadow-[0_0_20px_rgba(255,215,0,0.3)] flex items-center gap-4 max-w-sm mr-6 relative overflow-hidden">
        {/* Shine effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
        
        <div className="text-4xl filter drop-shadow-md">{achievement.icon}</div>
        <div>
           <div className="text-[10px] text-cyber-gold uppercase tracking-widest font-bold">Achievement Unlocked</div>
           <div className="text-white font-bold text-sm">{achievement.title}</div>
           <div className="text-gray-400 text-xs">{achievement.description}</div>
        </div>
      </div>
    </div>
  );
};
