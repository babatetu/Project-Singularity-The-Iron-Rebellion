import React from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (val: string) => void;
  readOnly?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, readOnly = false }) => {
  
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
        <span>main.py</span>
        <span>Python 3.12</span>
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
    </div>
  );
};