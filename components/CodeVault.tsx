import React from 'react';
import { CODE_VAULT } from '../data/tutorialData';

interface CodeVaultProps {
  unlockedLevel: number;
  onClose: () => void;
  onCopy: (code: string) => void;
}

export const CodeVault: React.FC<CodeVaultProps> = ({ unlockedLevel, onClose, onCopy }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-4xl h-[80vh] bg-cyber-dark border border-gray-700 shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-black/50">
           <div>
             <h2 className="text-2xl font-bold text-white flex items-center gap-3">
               <span className="text-cyber-gold">📚</span> CIPHER'S CODE VAULT
             </h2>
             <p className="text-xs text-gray-500 mt-1">Recovered Data Fragments</p>
           </div>
           <button onClick={onClose} className="text-gray-500 hover:text-white px-4 py-2 border border-gray-700 hover:bg-gray-800">
             CLOSE DATABASE
           </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
           {CODE_VAULT.map((entry) => {
             const isLocked = entry.unlockedAtLevel > unlockedLevel;
             
             return (
               <div key={entry.id} className={`border p-4 relative group transition-all ${isLocked ? 'border-gray-800 bg-gray-900/50 opacity-50' : 'border-gray-600 bg-cyber-black hover:border-cyber-neon'}`}>
                 
                 <div className="flex justify-between items-start mb-3">
                   <h3 className={`font-bold ${isLocked ? 'text-gray-600' : 'text-cyber-neon'}`}>{entry.title}</h3>
                   {isLocked ? (
                     <span className="text-[10px] uppercase bg-gray-800 text-gray-500 px-2 py-1 rounded">Locked (Lv {entry.unlockedAtLevel})</span>
                   ) : (
                     <span className="text-[10px] uppercase bg-cyber-neon/10 text-cyber-neon px-2 py-1 rounded">Available</span>
                   )}
                 </div>

                 {isLocked ? (
                   <div className="h-24 flex items-center justify-center text-gray-700 font-mono text-sm">
                     [ENCRYPTED DATA]
                   </div>
                 ) : (
                   <>
                     <p className="text-xs text-gray-400 mb-3 h-8">{entry.description}</p>
                     <div className="bg-black p-3 rounded border border-gray-800 font-mono text-sm text-gray-300 mb-3 relative overflow-hidden">
                       <pre>{entry.code}</pre>
                     </div>
                     <button 
                       onClick={() => {
                         onCopy(entry.code);
                         onClose();
                       }}
                       className="w-full py-2 bg-gray-800 text-gray-300 text-xs hover:bg-cyber-neon hover:text-black font-bold uppercase transition-colors"
                     >
                       Load into Editor
                     </button>
                   </>
                 )}
               </div>
             );
           })}
        </div>

      </div>
    </div>
  );
};