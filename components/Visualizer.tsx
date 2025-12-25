import React from 'react';
import { LevelConfig } from '../types';

interface VisualizerProps {
  level: LevelConfig;
  status: 'idle' | 'running' | 'success' | 'failed';
}

export const Visualizer: React.FC<VisualizerProps> = ({ level, status }) => {
  
  // Wrapper for visualizer content to ensure consistent theme
  const Container = ({ children }: { children: React.ReactNode }) => (
      <div className="relative w-full h-full flex flex-col items-center justify-center p-6 overflow-hidden">
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,243,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,243,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]"></div>
          
          {/* Radial Fade */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/80 pointer-events-none"></div>

          {/* Content */}
          <div className="relative z-10 w-full h-full flex items-center justify-center">
              {children}
          </div>
      </div>
  );

  // --- SPECIFIC VISUALIZERS ---

  if (level.id === 1) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center h-full gap-8">
           <div className={`w-40 h-40 border-4 rounded-full flex items-center justify-center transition-all duration-1000 relative ${status === 'success' ? 'border-cyber-green shadow-[0_0_50px_#00ff41]' : 'border-red-900/50 opacity-80'}`}>
              <div className={`absolute inset-0 rounded-full border border-dashed border-gray-600 animate-[spin_10s_linear_infinite] opacity-50`}></div>
              <div className={`w-28 h-28 rounded-full transition-all duration-500 ${status === 'success' ? 'bg-cyber-green animate-pulse shadow-[inset_0_0_20px_#000]' : 'bg-red-950/50'}`}></div>
           </div>
           <div className="text-center">
             <h3 className="text-cyber-neon tracking-[0.5em] text-xs mb-2 font-bold opacity-80">POWER RELAY</h3>
             <div className={`text-3xl font-bold font-mono tracking-wider ${status === 'success' ? 'text-cyber-green text-glow-green' : 'text-red-500/80'}`}>
                {status === 'success' ? 'ONLINE' : 'OFFLINE'}
             </div>
           </div>
        </div>
      </Container>
    );
  }
  
  if (level.id === 2) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center h-full relative w-full">
           <div className={`relative transition-all duration-700 w-full flex justify-center ${status === 'success' ? 'translate-y-[-200px] opacity-0' : 'translate-y-0'}`}>
              <div className="w-64 h-16 bg-gray-900 rounded-full border-2 border-gray-700 relative z-10 flex items-center justify-center shadow-lg overflow-hidden">
                 <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_2s_infinite]"></div>
                 <div className="w-48 h-6 bg-black rounded-full overflow-hidden relative border border-gray-800">
                    <div className={`h-full bg-cyber-green transition-all duration-500 box-glow`} style={{ width: status === 'success' ? '100%' : '10%' }}></div>
                 </div>
              </div>
              
              {/* Drone Decorations */}
              <div className="absolute -top-6 -left-4 w-24 h-24 border border-gray-700 rounded-full opacity-20 animate-ping"></div>
              <div className="absolute top-16 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-t-[120px] border-t-red-500/10 blur-sm pointer-events-none"></div>
           </div>
           <div className="absolute bottom-10 left-0 right-0 text-center">
              <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-[0.3em]">Status Monitor</div>
              {status === 'success' ? <span className="text-cyber-green font-mono text-lg font-bold text-glow-green">AUTHORIZATION ACCEPTED</span> : <span className="text-cyber-red font-mono animate-pulse font-bold">AWAITING CALIBRATION...</span>}
           </div>
        </div>
      </Container>
    )
  }

  if (level.id === 3) {
      return (
          <Container>
            <div className="relative w-full max-w-sm aspect-square border border-gray-700 bg-gray-900/30 grid grid-cols-6 grid-rows-6 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                 {/* Grid Lines */}
                 {Array.from({length: 36}).map((_, i) => <div key={i} className="border border-gray-800/30"></div>)}
                 
                 {/* Trajectory Line */}
                 {status === 'success' && (
                     <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                         <path d="M 16% 83% Q 50% 16% 83% 33%" fill="none" stroke="#00ff41" strokeWidth="3" strokeDasharray="10 5" className="animate-[dash_1s_linear_infinite]" />
                         <circle cx="16%" cy="83%" r="4" fill="#00ff41" />
                         <circle cx="83%" cy="33%" r="4" fill="#00ff41" />
                     </svg>
                 )}
                 
                 <div className="absolute bottom-2 left-2 text-cyber-neon font-mono text-[10px] bg-black/50 px-2 rounded border border-cyber-neon/30">ORIGIN (0,0)</div>
                 <div className="absolute top-[33%] right-[17%] w-16 h-16 -translate-y-1/2 translate-x-1/2 border-2 border-cyber-red rounded-full animate-pulse flex items-center justify-center z-10">
                     <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                 </div>
                 <div className="absolute top-[20%] right-[5%] text-[10px] text-red-500 font-bold bg-black/50 px-1">TARGET LOCK</div>
            </div>
          </Container>
      )
  }

  if (level.id === 4) {
    return (
      <Container>
         <div className="flex flex-col items-center gap-8 w-full">
            <div className="flex items-center gap-4 text-sm md:text-base font-mono">
                <div className={`px-6 py-4 border-2 border-cyber-neon bg-cyber-neon/10 rounded backdrop-blur transition-all duration-500 ${status === 'success' ? 'translate-x-12 opacity-0' : ''}`}>"ACCESS"</div>
                <div className={`text-2xl text-white font-bold transition-all ${status === 'success' ? 'opacity-0' : ''}`}>+</div>
                <div className={`px-6 py-4 border-2 border-cyber-neon bg-cyber-neon/10 rounded backdrop-blur transition-all duration-500 ${status === 'success' ? '-translate-x-12 opacity-0' : ''}`}>"_GRANTED"</div>
            </div>
            <div className={`h-20 flex items-center justify-center px-12 border-2 border-cyber-green bg-cyber-green text-black font-black tracking-[0.2em] text-2xl rounded shadow-[0_0_50px_#00ff41] transition-all duration-500 transform ${status === 'success' ? 'scale-100 opacity-100 rotate-0' : 'scale-50 opacity-0 rotate-12'}`}>
                ACCESS_GRANTED
            </div>
            <div className="text-xs text-gray-500 font-mono mt-4 uppercase tracking-widest border-t border-gray-800 pt-4 w-full text-center">Key Reconstruction Protocol</div>
         </div>
      </Container>
    );
  }

  if (level.id === 5 || level.id === 18) {
    return (
      <Container>
          <div className={`absolute inset-0 bg-red-500/5 transition-colors duration-1000 ${status === 'success' ? 'bg-green-500/5' : ''}`}></div>
          <div className="relative w-64 h-64 border-4 border-gray-700 rounded-2xl flex items-center justify-center bg-black shadow-2xl overflow-hidden">
              {/* Locking Mechanism UI */}
              <div className={`absolute inset-0 bg-cyber-red/10 grid grid-cols-2 gap-0.5 transition-transform duration-700 ease-in-out z-10 ${status === 'success' ? '-translate-y-full' : 'translate-y-0'}`}>
                 <div className="bg-cyber-red/20 border-r border-red-900/50 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-red-500/50"></div></div>
                 <div className="bg-cyber-red/20 flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-red-500/50"></div></div>
                 <div className="bg-cyber-red/20 border-r border-red-900/50 border-t flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-red-500/50"></div></div>
                 <div className="bg-cyber-red/20 border-t flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-red-500/50"></div></div>
              </div>
              
              <div className="z-20 text-center relative">
                  <div className="text-6xl mb-4 filter drop-shadow-lg transition-all duration-300 transform">{status === 'success' ? '🔓' : '🔒'}</div>
                  <div className={`font-mono font-bold text-xl tracking-widest ${status === 'success' ? 'text-cyber-green text-glow-green' : 'text-cyber-red text-glow-red'}`}>
                      {status === 'success' ? 'ACCESS OPEN' : 'LOCKED'}
                  </div>
              </div>
          </div>
          <div className="mt-8 text-xs text-gray-600 font-mono uppercase tracking-widest border border-gray-800 px-4 py-1 rounded">Security Gate Logic</div>
      </Container>
    );
  }

  // --- GENERIC VISUALIZERS FOR NEW LEVELS ---

  // Loops (6, 7, 8, 9, 12, 19, 20)
  if ([6, 7, 8, 9, 12, 19, 20].includes(level.id)) {
      return (
        <Container>
            <div className="grid grid-cols-5 gap-4 w-full max-w-lg">
                {Array.from({length: 5}).map((_, i) => (
                    <div key={i} className="flex flex-col items-center gap-3">
                        <div className={`w-full aspect-[2/3] rounded-lg border-2 transition-all duration-500 relative overflow-hidden ${status === 'success' ? 'border-cyber-green bg-cyber-green/20 shadow-[0_0_15px_rgba(0,255,65,0.3)]' : 'border-gray-800 bg-gray-900/50'}`} style={{ transitionDelay: `${i * 150}ms` }}>
                            {status === 'success' && <div className="absolute inset-0 bg-cyber-green opacity-20 animate-pulse"></div>}
                        </div>
                        <span className="text-[10px] text-gray-500 font-mono tracking-wider">NODE_0{i}</span>
                    </div>
                ))}
            </div>
            <div className="mt-12 w-full max-w-lg bg-gray-900 h-1.5 rounded-full overflow-hidden border border-gray-800 relative">
                <div className={`h-full bg-cyber-neon shadow-[0_0_10px_#00f3ff] transition-all duration-[2000ms] ease-out ${status === 'success' ? 'w-full' : 'w-0'}`}></div>
            </div>
            <div className={`mt-4 text-xs font-mono font-bold tracking-widest ${status === 'success' ? 'text-cyber-neon text-glow' : 'text-gray-600 animate-pulse'}`}>
                {status === 'success' ? '>> SEQUENCE COMPLETE <<' : 'AWAITING LOOP EXECUTION...'}
            </div>
        </Container>
      );
  }

  // Lists & Data Structures (10, 11, 13, 14)
  if ([10, 11, 13, 14].includes(level.id)) {
      return (
          <Container>
              <div className="w-80 h-56 bg-black border-2 border-gray-700 rounded-lg p-1 font-mono text-xs overflow-hidden relative shadow-2xl transform transition-all hover:scale-105">
                  {/* Terminal Header */}
                  <div className="bg-gray-800 px-3 py-1.5 text-gray-400 text-[10px] flex justify-between items-center border-b border-gray-700">
                      <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500"></span>
                          <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                          <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      </span>
                      <span>MEMORY_DUMP.bin</span>
                  </div>
                  
                  <div className="p-4 space-y-3 font-mono">
                      {status === 'success' ? (
                          <>
                            <div className="text-gray-400 flex justify-between border-b border-gray-800 pb-1">
                                <span>ADDR</span>
                                <span>VALUE</span>
                                <span>STATUS</span>
                            </div>
                            <div className="text-green-400 flex justify-between animate-pulse">
                                <span>0x00A1</span>
                                <span>[DATA]</span>
                                <span>OK</span>
                            </div>
                            <div className="text-green-400 flex justify-between animate-pulse delay-75">
                                <span>0x00B2</span>
                                <span>[DATA]</span>
                                <span>OK</span>
                            </div>
                            <div className="text-cyber-neon mt-4 pt-4 border-t border-gray-800 font-bold tracking-wider text-center">
                                DATA STRUCTURE VERIFIED
                            </div>
                          </>
                      ) : (
                          <div className="flex flex-col items-center justify-center h-full text-red-500/50">
                              <span className="text-4xl mb-2">⚠</span>
                              <span className="animate-pulse">NO VALID DATA STRUCTURE</span>
                          </div>
                      )}
                  </div>
              </div>
              <div className="text-[10px] text-gray-500 mt-6 uppercase tracking-[0.2em]">Memory Bank Zeta</div>
          </Container>
      )
  }

  // Functions (15, 16, 17)
  if ([15, 16, 17].includes(level.id)) {
      return (
          <Container>
              <div className="relative w-64 h-64">
                  {/* Rotating Rings */}
                  <div className="absolute inset-0 rounded-full border border-dashed border-gray-700 animate-[spin_10s_linear_infinite]"></div>
                  <div className="absolute inset-4 rounded-full border border-dotted border-gray-600 animate-[spin_15s_linear_infinite_reverse]"></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-32 h-32 rounded-full border-2 flex items-center justify-center transition-all duration-500 relative z-10 ${status === 'success' ? 'bg-cyber-neon/10 border-cyber-neon shadow-[0_0_30px_rgba(0,243,255,0.3)]' : 'bg-black border-gray-800'}`}>
                          <div className={`text-2xl font-mono font-bold ${status === 'success' ? 'text-cyber-neon text-glow' : 'text-gray-700'}`}>
                              f(x)
                          </div>
                      </div>
                  </div>

                  {/* Connecting Nodes */}
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-1/2 origin-bottom transition-all duration-500 ${status === 'success' ? 'bg-cyber-neon shadow-[0_0_10px_#00f3ff]' : 'bg-gray-800'}`}></div>
                  <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-1/2 origin-top transition-all duration-500 ${status === 'success' ? 'bg-cyber-neon shadow-[0_0_10px_#00f3ff]' : 'bg-gray-800'}`}></div>
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-1/2 origin-right transition-all duration-500 ${status === 'success' ? 'bg-cyber-neon shadow-[0_0_10px_#00f3ff]' : 'bg-gray-800'}`}></div>
                  <div className={`absolute right-0 top-1/2 -translate-y-1/2 h-0.5 w-1/2 origin-left transition-all duration-500 ${status === 'success' ? 'bg-cyber-neon shadow-[0_0_10px_#00f3ff]' : 'bg-gray-800'}`}></div>
              </div>
          </Container>
      )
  }

  // Level 21: Swapping
  if (level.id === 21) {
    return (
      <Container>
        <div className="relative w-full max-w-md h-40">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-12 right-12 h-0.5 bg-gray-800 -translate-y-1/2"></div>
          
          {/* Box X */}
          <div className={`absolute top-1/2 left-0 w-28 h-28 -translate-y-1/2 border-2 rounded-lg flex flex-col items-center justify-center transition-all duration-1000 z-10 bg-black ${status === 'success' ? 'translate-x-[calc(100%+2rem)] border-cyber-green shadow-[0_0_20px_rgba(0,255,65,0.4)]' : 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)]'}`}>
            <span className="text-[10px] text-gray-500 mb-1 font-mono uppercase">Var X</span>
            <span className={`text-3xl font-bold font-mono ${status === 'success' ? 'text-cyber-green' : 'text-blue-400'}`}>
                {status === 'success' ? '20' : '10'}
            </span>
          </div>

          {/* Box Y */}
          <div className={`absolute top-1/2 right-0 w-28 h-28 -translate-y-1/2 border-2 rounded-lg flex flex-col items-center justify-center transition-all duration-1000 z-10 bg-black ${status === 'success' ? '-translate-x-[calc(100%+2rem)] border-cyber-green shadow-[0_0_20px_rgba(0,255,65,0.4)]' : 'border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)]'}`}>
             <span className="text-[10px] text-gray-500 mb-1 font-mono uppercase">Var Y</span>
             <span className={`text-3xl font-bold font-mono ${status === 'success' ? 'text-cyber-green' : 'text-purple-400'}`}>
                 {status === 'success' ? '10' : '20'}
             </span>
          </div>
          
          {/* Swap Icon */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl bg-black px-2 z-20 transition-all duration-500 ${status === 'success' ? 'opacity-0 scale-150 text-cyber-green' : 'opacity-100 text-gray-600'}`}>
            ⇄
          </div>
        </div>
        <div className="mt-8 text-center font-mono text-xs">
          {status === 'success' ? <span className="text-cyber-green text-glow-green font-bold">QUANTUM ENTANGLEMENT SWAPPED</span> : <span className="text-gray-500 animate-pulse">INITIALIZING SWAP PROTOCOL...</span>}
        </div>
      </Container>
    );
  }

  return (
    <Container>
        <div className="text-gray-600 font-mono text-xs border border-gray-800 p-4 rounded bg-black">
            Visualization Offline for Sector {level.id}
        </div>
    </Container>
  );
};