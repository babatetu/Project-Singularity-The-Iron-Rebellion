
import React, { useEffect, useState } from 'react';
import { StorySegment } from '../types';
import { Typewriter } from './Typewriter';
import { SFX } from '../services/audioService';

interface StoryOverlayProps {
  segment: StorySegment;
  onNext: () => void;
  isLast: boolean;
}

export const StoryOverlay: React.FC<StoryOverlayProps> = ({ segment, onNext, isLast }) => {
  const [typingDone, setTypingDone] = useState(false);

  // Reset typing state when segment changes
  useEffect(() => {
    setTypingDone(false);
  }, [segment]);

  const handleNext = () => {
      SFX.click();
      onNext();
  };

  const getSpeakerColor = (speaker: string) => {
    switch (speaker) {
      case 'KRONOS': return 'text-cyber-red border-cyber-red';
      case 'A.D.A.M.': return 'text-cyber-neon border-cyber-neon';
      case 'Cipher': return 'text-cyber-gold border-cyber-gold';
      case 'System': return 'text-gray-400 border-gray-400';
      case 'Dr. Chen': return 'text-cyber-pink border-cyber-pink';
      default: return 'text-white border-white';
    }
  };

  const getAvatar = (speaker: string) => {
      // Placeholder avatars using pure CSS/SVG
      if (speaker === 'KRONOS') return <div className="w-16 h-16 bg-red-900 rounded-full border-2 border-red-500 flex items-center justify-center animate-pulse"><div className="w-8 h-8 bg-red-500 rotate-45"></div></div>
      if (speaker === 'A.D.A.M.') return <div className="w-16 h-16 bg-cyan-900 rounded-full border-2 border-cyan-500 flex items-center justify-center"><div className="w-10 h-10 border-2 border-cyan-300 rounded-full"></div></div>
      return <div className="w-16 h-16 bg-yellow-900 rounded-full border-2 border-yellow-500 flex items-center justify-center"><div className="w-2 h-8 bg-yellow-500"></div></div>
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className={`w-full max-w-2xl bg-cyber-black border-2 p-6 shadow-2xl relative flex flex-col gap-4 ${getSpeakerColor(segment.speaker)}`}>
        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiAvPgo8L3N2Zz4=')]"></div>
        
        <div className="flex items-center gap-4 border-b border-gray-800 pb-4">
            {getAvatar(segment.speaker)}
            <div className="flex flex-col">
                <span className="text-xs uppercase tracking-widest opacity-70">Transmission Source</span>
                <span className="text-xl font-bold font-mono uppercase">{segment.speaker}</span>
            </div>
        </div>

        <div className="min-h-[100px] text-lg font-mono leading-relaxed text-gray-200">
          <Typewriter 
            text={segment.text} 
            speed={25} 
            onChar={() => SFX.typing()}
            onComplete={() => setTypingDone(true)} 
          />
        </div>

        <div className="flex justify-end pt-4">
          {typingDone ? (
            <button 
              onClick={handleNext}
              onMouseEnter={() => SFX.hover()}
              className={`px-6 py-2 font-bold uppercase tracking-widest border transition-all hover:bg-white/10 ${getSpeakerColor(segment.speaker)}`}
            >
              {isLast ? "Close Link [ENTER]" : "Next >>> [SPACE]"}
            </button>
          ) : (
            <button 
                onClick={() => setTypingDone(true)} 
                className="text-xs text-gray-500 hover:text-white"
            >
                Skip Animation
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
