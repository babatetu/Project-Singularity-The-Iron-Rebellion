
import React, { useState, useEffect } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  onChar?: () => void;
  className?: string;
}

export const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 30, onComplete, onChar, className }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        if (onChar) onChar();
        i++;
      } else {
        clearInterval(timer);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed, onComplete, onChar]);

  return <span className={className}>{displayedText}</span>;
};
