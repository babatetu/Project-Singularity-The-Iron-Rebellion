import React, { useEffect, useRef } from 'react';
import { LogEntry, MessageType } from '../types';

interface ConsoleProps {
  logs: LogEntry[];
}

export const Console: React.FC<ConsoleProps> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getColor = (type: MessageType) => {
    switch (type) {
      case MessageType.ERROR: return 'text-cyber-red text-glow-red font-bold';
      case MessageType.SUCCESS: return 'text-cyber-green text-glow-green font-bold';
      case MessageType.SYSTEM: return 'text-blue-400 font-bold';
      case MessageType.STORY: return 'text-yellow-400 italic';
      default: return 'text-gray-300';
    }
  };

  return (
    <div className="w-full h-full bg-[#050505] font-mono text-xs p-4 overflow-y-auto custom-scrollbar shadow-inner relative">
      <div className="absolute top-0 right-0 px-2 py-1 text-[9px] text-gray-700 font-bold uppercase tracking-widest select-none">
        Terminal Output
      </div>
      <div className="text-cyber-green/50 mb-2 select-none border-b border-gray-800 pb-1 w-full flex justify-between">
          <span>root@cipher-terminal:~/protocol$ _</span>
          <span>v1.0.4-stable</span>
      </div>
      {logs.map((log) => (
        <div key={log.id} className={`mb-1.5 leading-relaxed ${getColor(log.type)}`}>
          <span className="opacity-30 mr-2 font-mono text-[10px] text-gray-500">[{log.timestamp}]</span>
          <span>{log.type === MessageType.ERROR ? '>> ERROR: ' : log.type === MessageType.SUCCESS ? '>> ' : ''}{log.content}</span>
        </div>
      ))}
      <div ref={endRef} className="h-4" />
    </div>
  );
};