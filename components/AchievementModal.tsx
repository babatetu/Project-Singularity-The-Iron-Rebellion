
import React from 'react';
import { Achievement } from '../types';
import { ACHIEVEMENTS } from '../data/achievements';

interface AchievementModalProps {
  unlockedIds: string[];
  onClose: () => void;
}

export const AchievementModal: React.FC<AchievementModalProps> = ({ unlockedIds, onClose }) => {
  
  const unlockedCount = unlockedIds.length;
  const totalCount = ACHIEVEMENTS.length;
  const progress = (unlockedCount / totalCount) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-4xl h-[80vh] bg-cyber-dark border border-cyber-gold/50 shadow-[0_0_50px_rgba(255,215,0,0.1)] flex flex-col" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-black/50">
           <div>
             <h2 className="text-2xl font-bold text-white flex items-center gap-3">
               <span className="text-cyber-gold">🏆</span> HALL OF RECORDS
             </h2>
             <div className="flex items-center gap-4 mt-2">
                 <p className="text-xs text-gray-500">Pilot Achievements</p>
                 <div className="w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                     <div className="h-full bg-cyber-gold" style={{ width: `${progress}%` }}></div>
                 </div>
                 <span className="text-xs text-cyber-gold font-mono">{unlockedCount} / {totalCount}</span>
             </div>
           </div>
           <button onClick={onClose} className="text-gray-500 hover:text-white px-4 py-2 border border-gray-700 hover:bg-gray-800">
             CLOSE
           </button>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 custom-scrollbar">
           {ACHIEVEMENTS.map((achievement) => {
             const isUnlocked = unlockedIds.includes(achievement.id);
             
             return (
               <div 
                 key={achievement.id} 
                 className={`relative border p-4 flex gap-4 items-center transition-all group ${
                     isUnlocked 
                     ? 'bg-cyber-gold/5 border-cyber-gold/30 hover:bg-cyber-gold/10' 
                     : 'bg-black/50 border-gray-800 opacity-60'
                 }`}
               >
                 <div className={`text-3xl ${isUnlocked ? '' : 'grayscale opacity-50'}`}>
                     {isUnlocked ? achievement.icon : '🔒'}
                 </div>
                 
                 <div className="flex-1 min-w-0">
                     <div className={`font-bold text-sm mb-1 ${isUnlocked ? 'text-white' : 'text-gray-600'}`}>
                         {achievement.title}
                     </div>
                     <div className="text-xs text-gray-500 leading-tight">
                         {(achievement.isHidden && !isUnlocked) ? '???' : achievement.description}
                     </div>
                 </div>

                 {isUnlocked && (
                     <div className="absolute top-2 right-2 w-2 h-2 bg-cyber-gold rounded-full shadow-[0_0_5px_#ffd700]"></div>
                 )}
               </div>
             );
           })}
        </div>

      </div>
    </div>
  );
};
