
import React, { useState, useEffect, useRef } from 'react';
import { generateAIResponse, generateSpeech, getGenAIClient } from '../services/aiService';
import { Modality, LiveServerMessage } from '@google/genai';
import { SFX } from '../services/audioService';

interface AIChatTerminalProps {
  onClose: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  modeUsed?: 'fast' | 'think' | 'search' | 'standard';
}

// --- Icons ---
const Icons = {
  Standard: () => <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
  Fast: () => <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  Think: () => <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>,
  Search: () => <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  Mic: () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>,
  Copy: () => <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
};

// --- UI Components ---

const ModeBadge: React.FC<{ mode?: string }> = ({ mode }) => {
  if (!mode) return null;

  let colorClass = "bg-cyber-neon/10 text-cyber-neon border-cyber-neon";
  let Icon = Icons.Standard;
  let label = "GEN";

  switch (mode) {
    case 'think':
      colorClass = "bg-purple-500/10 text-purple-400 border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.2)]";
      Icon = Icons.Think;
      label = "THINK";
      break;
    case 'fast':
      colorClass = "bg-yellow-500/10 text-yellow-400 border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.2)]";
      Icon = Icons.Fast;
      label = "FAST";
      break;
    case 'search':
      colorClass = "bg-blue-500/10 text-blue-400 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.2)]";
      Icon = Icons.Search;
      label = "WEB";
      break;
    default:
      colorClass = "bg-cyber-neon/10 text-cyber-neon border-cyber-neon shadow-[0_0_10px_rgba(0,243,255,0.2)]";
      Icon = Icons.Standard;
      label = "GEN";
      break;
  }

  return (
    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-t-sm border-b text-[9px] font-bold tracking-widest w-full ${colorClass} uppercase bg-opacity-20`}>
      <Icon />
      <span>{label}_PROTOCOL</span>
    </div>
  );
};

// --- Syntax Highlighter Component ---
const CodeBlock: React.FC<{ code: string; language?: string }> = ({ code, language = 'python' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    SFX.click();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlight = (text: string) => {
    // 1. Escape HTML first
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const tokens: string[] = [];
    const save = (s: string) => {
      tokens.push(s);
      return `__TOKEN_${tokens.length - 1}__`;
    };

    // 2. Protect Strings & Comments from keyword highlighting
    // Strings (Single and Double quotes) - Monokai Yellow
    html = html.replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, (match) => save(`<span class="text-[#e6db74]">${match}</span>`));
    
    // Comments (Hash) - Monokai Grey
    html = html.replace(/#.*/g, (match) => save(`<span class="text-[#75715e] italic">${match}</span>`));

    // 3. Highlight Syntax
    const keywords = ['def', 'return', 'print', 'if', 'else', 'elif', 'for', 'while', 'import', 'from', 'class', 'try', 'except', 'pass', 'break', 'continue', 'in', 'and', 'or', 'not', 'as', 'with', 'True', 'False', 'None', 'async', 'await', 'lambda', 'global', 'nonlocal', 'del', 'raise', 'yield', 'assert'];
    const builtins = ['range', 'len', 'str', 'int', 'float', 'list', 'dict', 'set', 'super', 'open', 'input', 'type', 'enumerate', 'zip', 'map', 'filter'];

    // Keywords - Monokai Pink
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'g');
      html = html.replace(regex, `<span class="text-[#f92672] font-bold">$0</span>`);
    });

    // Builtins - Monokai Cyan/Italic
    builtins.forEach(bi => {
      const regex = new RegExp(`\\b${bi}\\b`, 'g');
      html = html.replace(regex, `<span class="text-[#66d9ef] italic">$0</span>`);
    });

    // Numbers - Monokai Purple
    html = html.replace(/\b\d+\b/g, '<span class="text-[#ae81ff]">$0</span>');

    // Decorators - Monokai Green
    html = html.replace(/(@\w+)/g, '<span class="text-[#a6e22e]">$1</span>');

    // Function/Class Definitions - Monokai Green
    // Matches: <span ...>def</span> name
    html = html.replace(/(<span[^>]*>def<\/span>\s+)(\w+)/g, '$1<span class="text-[#a6e22e] font-bold">$2</span>');
    html = html.replace(/(<span[^>]*>class<\/span>\s+)(\w+)/g, '$1<span class="text-[#a6e22e] font-bold">$2</span>');

    // 4. Restore protected tokens
    tokens.forEach((t, i) => {
      html = html.replace(`__TOKEN_${i}__`, t);
    });

    return { __html: html };
  };

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-gray-700 bg-[#1e1f22] shadow-[0_4px_20px_rgba(0,0,0,0.5)] transform transition-all hover:border-gray-600">
      <div className="flex justify-between items-center px-4 py-2 bg-[#2b2d31] border-b border-black/20">
        <div className="flex items-center gap-3">
           <div className="flex gap-1.5">
             <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] border border-[#e0443e]"></span>
             <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] border border-[#dea123]"></span>
             <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] border border-[#1aab29]"></span>
           </div>
           <span className="text-xs text-gray-400 font-mono font-bold uppercase ml-2 select-none tracking-wider">{language}</span>
        </div>
        <button 
          onClick={handleCopy}
          className={`group flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded transition-all duration-300 ${copied ? 'text-green-400 bg-green-400/10 border border-green-400/20' : 'text-gray-500 hover:text-white hover:bg-white/10'}`}
        >
          {copied ? (
            <>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              COPIED
            </>
          ) : (
            <>
              <svg className="w-3 h-3 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              COPY
            </>
          )}
        </button>
      </div>
      <div className="relative group">
          <pre className="p-5 overflow-x-auto text-[13px] font-mono leading-7 text-[#f8f8f2]">
            <code dangerouslySetInnerHTML={highlight(code)} />
          </pre>
      </div>
    </div>
  );
};

const MessageContent: React.FC<{ text: string }> = ({ text }) => {
  // Split by Markdown code blocks
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 p-3">
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          // Parse code block content
          let content = part.slice(3); // Remove first ```
          if (content.endsWith('```')) {
            content = content.slice(0, -3); // Remove last ```
          }
          
          let language = 'text';
          // Try to extract language from first line (e.g. ```python)
          const firstLineEndIndex = content.indexOf('\n');
          if (firstLineEndIndex !== -1) {
             const firstLine = content.slice(0, firstLineEndIndex).trim();
             // Simple check if it looks like a language identifier (alphanumeric, no spaces)
             if (firstLine && !/\s/.test(firstLine) && firstLine.length < 20) {
                 language = firstLine;
                 content = content.slice(firstLineEndIndex + 1);
             }
          }
          
          // Render the CodeBlock component which includes the Copy button
          return <CodeBlock key={index} language={language} code={content.trim()} />;
        }
        
        // Render standard text with inline code support
        if (!part.trim()) return null;
        
        return (
          <p key={index} className="whitespace-pre-wrap leading-relaxed text-gray-300">
             {part.split(/(`[^`]+`)/g).map((subPart, i) => {
                 if (subPart.startsWith('`') && subPart.endsWith('`')) {
                     return <span key={i} className="bg-gray-800 text-cyber-neon px-1.5 py-0.5 rounded text-xs font-mono border border-gray-700 mx-0.5">{subPart.slice(1, -1)}</span>;
                 }
                 return subPart;
             })}
          </p>
        );
      })}
    </div>
  );
};

export const AIChatTerminal: React.FC<AIChatTerminalProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'A.D.A.M. Neural Link initialized. Select a processing mode below.', modeUsed: 'standard' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'fast' | 'think' | 'search' | 'standard'>('standard');
  const [isLiveActive, setIsLiveActive] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    SFX.click();

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const currentMode = mode;

    if (mode === 'think') {
       setMessages(prev => [...prev, { role: 'model', text: 'Analyzing complex variables...', isThinking: true, modeUsed: 'think' }]);
    }

    try {
      const history = messages.filter(m => !m.isThinking);
      const responseText = await generateAIResponse(history, userMsg.text, currentMode);
      
      SFX.aiMessage(); // Sound effect for incoming message

      setMessages(prev => {
        const filtered = prev.filter(m => !m.isThinking);
        return [...filtered, { role: 'model', text: responseText, modeUsed: currentMode }];
      });

      if (mode === 'fast' || mode === 'standard') {
          playTTS(responseText);
      }

    } catch (e) {
      SFX.error();
      setMessages(prev => [...prev, { role: 'model', text: 'Error connecting to neural cloud.', modeUsed: 'standard' }]);
    } finally {
      setLoading(false);
    }
  };

  const playTTS = async (text: string) => {
    const audioBuffer = await generateSpeech(text);
    if (audioBuffer) {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const buffer = await ctx.decodeAudioData(audioBuffer);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);
    }
  };
  
  // --- Live API Logic ---
  const liveSessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const toggleLiveMode = async () => {
    SFX.click();
    if (isLiveActive) {
        liveSessionRef.current?.close();
        audioContextRef.current?.close();
        audioContextRef.current = null;
        if(scriptProcessorRef.current) scriptProcessorRef.current.disconnect();
        if(sourceNodeRef.current) sourceNodeRef.current.disconnect();
        setIsLiveActive(false);
        setMessages(prev => [...prev, { role: 'model', text: 'Voice Link Terminated.', modeUsed: 'standard' }]);
        return;
    }

    try {
        setIsLiveActive(true);
        setMessages(prev => [...prev, { role: 'model', text: 'Establishing Secure Voice Channel...', modeUsed: 'fast' }]);

        const ai = getGenAIClient();
        const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const outputNode = outputCtx.createGain();
        outputNode.connect(outputCtx.destination);
        
        nextStartTimeRef.current = 0;

        const sessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
                },
                systemInstruction: "You are A.D.A.M., a cyberpunk AI. Be concise and immersive.",
            },
            callbacks: {
                onopen: async () => {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    sourceNodeRef.current = inputCtx.createMediaStreamSource(stream);
                    scriptProcessorRef.current = inputCtx.createScriptProcessor(4096, 1, 1);
                    scriptProcessorRef.current.onaudioprocess = (e) => {
                        const inputData = e.inputBuffer.getChannelData(0);
                        const l = inputData.length;
                        const int16 = new Int16Array(l);
                        for (let i = 0; i < l; i++) {
                            int16[i] = inputData[i] * 32768;
                        }
                        let binary = '';
                        const bytes = new Uint8Array(int16.buffer);
                        const len = bytes.byteLength;
                        for (let i = 0; i < len; i++) {
                            binary += String.fromCharCode(bytes[i]);
                        }
                        const b64 = btoa(binary);

                        sessionPromise.then(session => {
                            session.sendRealtimeInput({
                                media: {
                                    mimeType: 'audio/pcm;rate=16000',
                                    data: b64
                                }
                            });
                        });
                    };
                    sourceNodeRef.current.connect(scriptProcessorRef.current);
                    scriptProcessorRef.current.connect(inputCtx.destination);
                },
                onmessage: async (msg: LiveServerMessage) => {
                    const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
                    if (audioData) {
                        const binaryString = atob(audioData);
                        const len = binaryString.length;
                        const bytes = new Uint8Array(len);
                        for (let i = 0; i < len; i++) {
                            bytes[i] = binaryString.charCodeAt(i);
                        }
                        const int16Data = new Int16Array(bytes.buffer);
                        const buffer = outputCtx.createBuffer(1, int16Data.length, 24000);
                        const channelData = buffer.getChannelData(0);
                        for(let i=0; i< int16Data.length; i++) {
                            channelData[i] = int16Data[i] / 32768.0;
                        }
                        const source = outputCtx.createBufferSource();
                        source.buffer = buffer;
                        source.connect(outputNode);
                        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
                        source.start(nextStartTimeRef.current);
                        nextStartTimeRef.current += buffer.duration;
                        audioSourcesRef.current.add(source);
                        source.onended = () => audioSourcesRef.current.delete(source);
                    }
                    if (msg.serverContent?.interrupted) {
                        audioSourcesRef.current.forEach(s => s.stop());
                        audioSourcesRef.current.clear();
                        nextStartTimeRef.current = 0;
                    }
                },
                onclose: () => setIsLiveActive(false),
                onerror: (e) => {
                    setIsLiveActive(false);
                    SFX.error();
                    setMessages(prev => [...prev, { role: 'model', text: 'Voice Uplink Failed.', modeUsed: 'standard' }]);
                }
            }
        });
        liveSessionRef.current = {
            close: () => {
                sessionPromise.then(s => s.close());
            }
        };
    } catch (error) {
        setIsLiveActive(false);
        SFX.error();
    }
  };

  const getModeStyles = (m: string) => {
     switch(m) {
         case 'think': return 'border-purple-500/50 bg-purple-900/10 text-purple-300';
         case 'fast': return 'border-yellow-500/50 bg-yellow-900/10 text-yellow-300';
         case 'search': return 'border-blue-500/50 bg-blue-900/10 text-blue-300';
         default: return 'border-cyber-neon/50 bg-cyan-900/10 text-cyber-neon';
     }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[500px] h-[650px] bg-cyber-black border-2 border-cyber-neon shadow-[0_0_40px_rgba(0,243,255,0.15)] flex flex-col font-mono animate-slideIn rounded-lg overflow-hidden">
      
      {/* Header */}
      <div className="bg-cyber-dark p-4 border-b border-cyber-slate flex justify-between items-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMWExYTFhIiAvPgo8L3N2Zz4=')]">
        <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isLiveActive ? 'bg-red-500 animate-pulse' : 'bg-cyber-neon shadow-[0_0_8px_#00f3ff]'}`}></div>
            <div>
              <h3 className="text-white font-bold text-sm tracking-wider flex items-center gap-2">
                A.D.A.M. TERMINAL <span className="text-[9px] bg-gray-700 px-1 rounded text-gray-300">v3.0</span>
              </h3>
              <p className="text-[9px] text-gray-500 uppercase tracking-widest">Neural Link Established</p>
            </div>
        </div>
        <button onClick={() => {SFX.click(); onClose();}} className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/10 rounded">✕</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#030304] scrollbar-thin scrollbar-thumb-gray-800">
        {messages.map((m, i) => (
            <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} animate-slideIn`}>
                
                <div className={`max-w-[90%] min-w-[200px] rounded relative overflow-hidden shadow-md border ${
                    m.role === 'user' 
                        ? 'bg-cyber-slate text-white border-gray-600' 
                        : `bg-[#0a0c12] text-gray-200 border-opacity-50 ${getModeStyles(m.modeUsed || 'standard')}`
                }`}>
                    
                    {/* Badge only for model */}
                    {m.role === 'model' && <ModeBadge mode={m.modeUsed} />}

                    {/* Scanline overlay for AI */}
                    {m.role === 'model' && <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 pointer-events-none bg-[length:100%_2px] bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.1)_50%)]"></div>}
                    
                    {/* Thinking State */}
                    {m.isThinking ? (
                      <div className="p-4 flex items-center gap-3">
                         <div className="w-5 h-5 border-2 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
                         <span className="text-purple-400 text-xs animate-pulse font-bold tracking-widest">PROCESSING NEURAL PATHWAYS...</span>
                      </div>
                    ) : (
                      <MessageContent text={m.text} />
                    )}
                </div>
            </div>
        ))}
        
        {/* Typing Indicator for standard/fast modes */}
        {loading && !messages[messages.length - 1]?.isThinking && (
          <div className="flex flex-col items-start animate-slideIn mt-2">
             <div className={`px-4 py-3 rounded border bg-[#0a0c12] border-opacity-50 ${getModeStyles(mode)}`}>
                 <div className="flex gap-1.5 items-center h-4">
                     <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 animate-[pulse_1s_ease-in-out_infinite]" style={{ animationDelay: '0ms' }}></span>
                     <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 animate-[pulse_1s_ease-in-out_infinite]" style={{ animationDelay: '200ms' }}></span>
                     <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 animate-[pulse_1s_ease-in-out_infinite]" style={{ animationDelay: '400ms' }}></span>
                 </div>
             </div>
          </div>
        )}

        {isLiveActive && (
            <div className="flex justify-center my-4 sticky bottom-2">
                <div className="bg-red-900/90 backdrop-blur border border-red-500 px-6 py-2 rounded-full text-white text-xs animate-pulse flex items-center gap-3 shadow-lg">
                    <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
                    LISTENING ON SECURE CHANNEL...
                </div>
            </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Mode Selectors */}
      <div className="bg-[#050505] p-2 border-t border-gray-800 flex gap-2">
          {[
              { id: 'standard', icon: <Icons.Standard />, label: 'GEN', color: 'text-cyber-neon border-cyber-neon hover:bg-cyber-neon/10' },
              { id: 'fast', icon: <Icons.Fast />, label: 'FAST', color: 'text-yellow-400 border-yellow-400 hover:bg-yellow-400/10' },
              { id: 'think', icon: <Icons.Think />, label: 'THINK', color: 'text-purple-400 border-purple-400 hover:bg-purple-400/10' },
              { id: 'search', icon: <Icons.Search />, label: 'WEB', color: 'text-blue-400 border-blue-400 hover:bg-blue-400/10' }
          ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => {SFX.click(); setMode(opt.id as any);}}
                onMouseEnter={() => SFX.hover()}
                className={`flex-1 flex flex-col items-center justify-center py-2 rounded border transition-all ${
                    mode === opt.id 
                    ? `${opt.color} bg-opacity-20 bg-gray-800 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]` 
                    : 'border-transparent text-gray-600 hover:text-gray-300 bg-gray-900/30'
                }`}
              >
                  {opt.icon}
                  <span className="text-[9px] font-bold mt-1 tracking-wider">{opt.label}</span>
              </button>
          ))}
      </div>

      {/* Input */}
      <div className="p-3 bg-black border-t border-cyber-slate">
         <div className="flex gap-2 relative">
             <button 
                onClick={toggleLiveMode}
                title="Toggle Voice Mode"
                className={`w-10 flex items-center justify-center border rounded transition-all ${
                    isLiveActive 
                    ? 'bg-red-500 text-white border-red-500 shadow-[0_0_10px_#ef4444]' 
                    : 'bg-gray-900 border-gray-700 text-gray-500 hover:text-white hover:border-gray-500'
                }`}
            >
                <Icons.Mic />
            </button>
             
             <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                disabled={isLiveActive || loading}
                placeholder={isLiveActive ? "Listening..." : "Enter command protocol..."}
                className="flex-1 bg-gray-900 border border-gray-700 text-white text-xs p-3 rounded focus:border-cyber-neon outline-none transition-all placeholder-gray-600 focus:shadow-[0_0_10px_rgba(0,243,255,0.1)]"
             />
             
             <button 
                onClick={handleSend}
                disabled={isLiveActive || loading}
                className="px-5 bg-cyber-neon text-black font-bold text-xs rounded hover:bg-white hover:shadow-[0_0_15px_#00f3ff] transition-all disabled:opacity-50 uppercase tracking-wider"
             >
                Send
             </button>
         </div>
      </div>

    </div>
  );
};
