import React, { useState } from 'react';
import { ASSESSMENT_QUESTIONS } from '../data/tutorialData';
import { SkillLevel } from '../types';

interface PreAssessmentProps {
  onComplete: (skill: SkillLevel) => void;
}

export const PreAssessment: React.FC<PreAssessmentProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);

  const handleAnswer = (correct: boolean) => {
    const newScore = correct ? score + 1 : score;
    if (step < ASSESSMENT_QUESTIONS.length - 1) {
      setScore(newScore);
      setStep(step + 1);
    } else {
      // Determine skill
      let skill: SkillLevel = 'beginner';
      if (newScore === 3) skill = 'advanced';
      else if (newScore === 2) skill = 'intermediate';
      
      onComplete(skill);
    }
  };

  const handleSkip = (level: SkillLevel) => {
    onComplete(level);
  };

  const currentQ = ASSESSMENT_QUESTIONS[step];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md">
      <div className="w-full max-w-lg bg-cyber-dark border-2 border-cyber-neon p-8 relative shadow-[0_0_30px_rgba(0,243,255,0.2)]">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 border-b border-gray-700 pb-4">
          <div className="w-12 h-12 bg-cyan-900/50 rounded-full border border-cyber-neon flex items-center justify-center">
             <div className="w-8 h-8 bg-cyber-neon/20 rounded-full animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-cyber-neon tracking-wider">A.D.A.M. // CALIBRATION</h2>
            <p className="text-xs text-gray-400">Assessing neural compatibility...</p>
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
           <div className="flex justify-between text-xs uppercase text-gray-500 mb-4">
              <span>Question {step + 1} of {ASSESSMENT_QUESTIONS.length}</span>
              <span>Protocol: Assessment</span>
           </div>
           
           <h3 className="text-lg font-mono text-white mb-6 leading-relaxed">
             {currentQ.question}
           </h3>

           <div className="space-y-3">
             {currentQ.options.map((opt) => (
               <button
                 key={opt.id}
                 onClick={() => handleAnswer(opt.correct)}
                 className="w-full text-left p-4 bg-gray-900 border border-gray-700 hover:border-cyber-neon hover:bg-cyber-neon/10 transition-all font-mono text-sm group"
               >
                 <span className="text-gray-500 mr-4 group-hover:text-cyber-neon">&gt;</span>
                 {opt.text}
               </button>
             ))}
           </div>
        </div>

        {/* Skip Options */}
        <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
            <span className="text-xs text-gray-600">Manual Override Options:</span>
            <div className="flex gap-2">
                <button onClick={() => handleSkip('beginner')} className="text-xs text-gray-500 hover:text-white px-2">I'm new</button>
                <button onClick={() => handleSkip('advanced')} className="text-xs text-gray-500 hover:text-white px-2">I'm an expert</button>
            </div>
        </div>

      </div>
    </div>
  );
};