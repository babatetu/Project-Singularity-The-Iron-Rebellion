import React, { useState } from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (val: string) => void;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, readOnly = false }) => {
  const [isMobileInputOpen, setIsMobileInputOpen] = useState(false);
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    if (e.key === 'Tab') {
      e.preventDefault();
      // Insert 4 spaces for tab
      const newValue = code.substring(0, start) + "    " + code.substring(end);
      onChange(newValue);
      
      // Need to defer cursor move to next tick
      setTimeout(() => {
         textarea.selectionStart = textarea.selectionEnd = start + 4;
      }, 0);
    }
    else if (e.key === 'Enter') {
      e.preventDefault();
      
      // Find the current line to check indentation
      const lines = code.substring(0, start).split('\n');
      const currentLine = lines[lines.length - 1];
      
      // Calculate current indentation
      const match = currentLine.match(/^(\s*)/);
      let indent = match ? match[1] : '';
      
      // If the line ends with a colon (Python block), add extra indentation
      if (currentLine.trim().endsWith(':')) {
        indent += "    ";
      }

      const newValue = code.substring(0, start) + "\n" + indent + code.substring(end);
      onChange(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length;
      }, 0);
    }
  };

  return (
    <div className="relative w-full h-full bg-cyber-dark font-mono text-sm border-r border-cyber-slate flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-cyber-black border-b border-cyber-slate text-gray-400 text-xs select-none">
        <div className="flex items-center gap-4">
          <span>main.py</span>
          <span className="text-gray-600">Python 3.12</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-600 uppercase font-bold tracking-widest">
            {code.length} chars
          </span>
          <button 
            onClick={() => setIsMobileInputOpen(true)}
            className="md:hidden px-2 py-0.5 bg-cyber-neon/10 border border-cyber-neon/30 text-cyber-neon rounded hover:bg-cyber-neon/20 transition-all text-[10px] font-bold uppercase"
          >
            Mobile Input
          </button>
        </div>
      </div>
      <div className="relative flex-1 flex">
        {/* Line Numbers */}
        <div className="w-10 bg-cyber-black text-gray-600 text-right pr-2 pt-4 select-none leading-6 font-mono">
            {code.split('\n').map((_, i) => <div key={i}>{i + 1}</div>)}
        </div>
        
        {/* Editor Area */}
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          readOnly={readOnly}
          className="flex-1 bg-transparent text-gray-300 resize-none outline-none p-4 leading-6 selection:bg-cyber-neon selection:text-black"
          placeholder="# Write your code here..."
        />
      </div>

      {/* Mobile Input Modal */}
      {isMobileInputOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col p-4 md:hidden">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-cyber-neon font-bold uppercase tracking-widest">Mobile Code Input</h3>
            <button 
              onClick={() => setIsMobileInputOpen(false)}
              className="text-white bg-gray-800 px-3 py-1 rounded"
            >
              CLOSE
            </button>
          </div>
          <p className="text-[10px] text-gray-500 mb-2 uppercase">Type your code below. Use the "Done" button to save.</p>
          <textarea
            value={code}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
            autoFocus
            className="flex-1 bg-gray-900 text-white p-4 font-mono text-base border border-cyber-neon/30 rounded outline-none focus:border-cyber-neon"
            placeholder="Type code here..."
          />
          <div className="mt-4 flex gap-2">
            <button 
              onClick={() => onChange('')}
              className="flex-1 py-3 bg-red-900/20 border border-red-900/50 text-red-500 font-bold uppercase"
            >
              Clear
            </button>
            <button 
              onClick={() => setIsMobileInputOpen(false)}
              className="flex-[2] py-3 bg-cyber-neon text-black font-bold uppercase"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};