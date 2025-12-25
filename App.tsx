
import React, { useState, useEffect, useRef } from 'react';
import { GameState, LogEntry, MessageType, SkillLevel, StorySegment, TutorialPhase, UserProfile, LevelConfig, Achievement } from './types';
import { LEVELS } from './data/levels';
import { HINTS_DATABASE, CODE_VAULT } from './data/tutorialData';
import { ACHIEVEMENTS } from './data/achievements';
import { executeCode } from './services/mockPython';
import { saveGameState, loadGameState, logoutUser } from './services/firebase';
import { CodeEditor } from './components/CodeEditor';
import { Console } from './components/Console';
import { Visualizer } from './components/Visualizer';
import { StoryOverlay } from './components/StoryOverlay';
import { PreAssessment } from './components/PreAssessment';
import { HintSystem } from './components/HintSystem';
import { CodeVault } from './components/CodeVault';
import { LoginModal } from './components/LoginModal';
import { AIChatTerminal } from './components/AIChatTerminal';
import { AchievementToast } from './components/AchievementToast';
import { AchievementModal } from './components/AchievementModal';
import { SFX, toggleMute } from './services/audioService';

const STORAGE_KEY = 'PROJECT_SINGULARITY_SAVE_V1';

const App: React.FC = () => {
  // --- STATE INITIALIZATION ---
  
  // Lazy initialization to check local storage
  const [gameState, setGameState] = useState<GameState>(() => {
    const defaultState: GameState = {
      currentLevelId: 1,
      maxReachedLevel: 1,
      xp: 0,
      isStoryOpen: true,
      currentStorySegment: 0,
      storyQueue: LEVELS[0].storyStart,
      isLevelComplete: false,
      code: LEVELS[0].initialCode,
      logs: [{
        id: 'init',
        type: MessageType.SYSTEM,
        content: 'Connecting to Global Defense Grid...',
        timestamp: new Date().toLocaleTimeString()
      }],
      status: 'idle',
      skillLevel: 'beginner',
      tutorialPhase: 'NONE',
      hintsUsed: 0,
      assessmentComplete: false,
      vaultUnlocked: false,
      user: null,
      unlockedAchievements: []
    };

    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        // Ensure maxReachedLevel is populated for legacy saves
        const restoredMax = parsed.maxReachedLevel || parsed.currentLevelId || 1;
        
        return {
          ...defaultState,
          ...parsed,
          maxReachedLevel: restoredMax,
          unlockedAchievements: parsed.unlockedAchievements || [],
          status: 'idle',
          isStoryOpen: false, 
          logs: [
            {
              id: 'load-sys',
              type: MessageType.SYSTEM,
              content: 'SYSTEM RESTORED FROM LOCAL MEMORY.',
              timestamp: new Date().toLocaleTimeString()
            },
            {
              id: 'load-welcome',
              type: MessageType.SYSTEM,
              content: `Welcome back, ${parsed.user ? parsed.user.name : 'Cipher'}. Level: ${parsed.currentLevelId}`,
              timestamp: new Date().toLocaleTimeString()
            }
          ]
        };
      }
    } catch (e) {
      console.error("Save file corrupted", e);
    }

    return defaultState;
  });

  const [examModalOpen, setExamModalOpen] = useState(false);
  const [vaultOpen, setVaultOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  
  // Audio State
  const [muted, setMuted] = useState(false);

  // Achievement Toast
  const [activeAchievement, setActiveAchievement] = useState<Achievement | null>(null);
  
  // New AI Feature States
  const [chatOpen, setChatOpen] = useState(false);
  
  // Tutorial System State
  const [idleTime, setIdleTime] = useState(0);
  const [activeHintTier, setActiveHintTier] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);

  const idleIntervalRef = useRef<number | null>(null);
  const tutorialIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const currentLevel = LEVELS.find(l => l.id === gameState.currentLevelId) || LEVELS[0];

  // Helper to get correct code template based on skill/difficulty
  const getInitialCodeForLevel = (level: LevelConfig, skill: SkillLevel): string => {
      if (skill === 'beginner' && level.initialCodeEasy) return level.initialCodeEasy;
      if (skill === 'advanced' && level.initialCodeHard !== undefined) return level.initialCodeHard; // Check undefined to allow empty string
      return level.initialCode;
  };

  const getDifficultyMultiplier = (skill: SkillLevel): number => {
      switch(skill) {
          case 'beginner': return 0.8;
          case 'intermediate': return 1.0;
          case 'advanced': return 1.5;
          default: return 1.0;
      }
  }

  // --- LOGIC ---

  const addLog = (type: MessageType, content: string) => {
    setGameState(prev => ({
      ...prev,
      logs: [...prev.logs, {
        id: Math.random().toString(36).substr(2, 9),
        type,
        content,
        timestamp: new Date().toLocaleTimeString()
      }]
    }));
  };

  // --- ACHIEVEMENT LOGIC ---

  const checkAndUnlockAchievement = (id: string) => {
      setGameState(prev => {
          if (prev.unlockedAchievements.includes(id)) return prev;
          
          const achievement = ACHIEVEMENTS.find(a => a.id === id);
          if (achievement) {
              setActiveAchievement(achievement);
              SFX.success(); // Sound effect
          }

          return {
              ...prev,
              unlockedAchievements: [...prev.unlockedAchievements, id]
          };
      });
  };

  useEffect(() => {
     // Check level-based achievements whenever level updates
     if (gameState.currentLevelId > 1) checkAndUnlockAchievement('first_steps');
     if (gameState.maxReachedLevel >= 5) checkAndUnlockAchievement('script_kiddie');
     if (gameState.maxReachedLevel >= 10) checkAndUnlockAchievement('hacker');
     if (gameState.maxReachedLevel >= 20) checkAndUnlockAchievement('architect');
     if (gameState.maxReachedLevel >= 41) checkAndUnlockAchievement('savior');
  }, [gameState.currentLevelId, gameState.maxReachedLevel]);

  // --- SAVE & AUTH SYSTEM ---

  const handleLogin = async (user: UserProfile) => {
    setGameState(prev => ({ ...prev, user }));
    setLoginModalOpen(false);
    SFX.success();
    addLog(MessageType.SUCCESS, `NEURAL LINK ESTABLISHED: ${user.email}`);
    
    addLog(MessageType.SYSTEM, "SYNCING WITH GLOBAL DEFENSE GRID (CLOUD)...");
    
    try {
        const cloudState = await loadGameState(user.id);
        
        if (cloudState) {
            const cloudMax = cloudState.maxReachedLevel || 1;
            const localMax = gameState.maxReachedLevel;

            if (cloudMax > localMax) {
                setGameState(prev => ({
                    ...prev,
                    currentLevelId: cloudState.currentLevelId || 1,
                    maxReachedLevel: cloudMax,
                    xp: cloudState.xp || 0,
                    skillLevel: cloudState.skillLevel || 'beginner',
                    code: cloudState.code || prev.code,
                    hintsUsed: cloudState.hintsUsed || 0,
                    assessmentComplete: true,
                    unlockedAchievements: cloudState.unlockedAchievements || prev.unlockedAchievements,
                    user: user,
                    logs: [...prev.logs, {
                        id: 'cloud-restore',
                        type: MessageType.SUCCESS,
                        content: `DATA RESTORED FROM CLOUD. SECTOR ${cloudMax} UNLOCKED.`,
                        timestamp: new Date().toLocaleTimeString()
                    }]
                }));
            } else {
                await saveProgress(false, user);
                addLog(MessageType.SUCCESS, "CLOUD RECORD UPDATED.");
            }
        } else {
            await saveProgress(false, user);
            addLog(MessageType.SUCCESS, "NEW PILOT RECORD CREATED IN CLOUD.");
        }
    } catch (e) {
        addLog(MessageType.ERROR, "CLOUD SYNC FAILED. USING LOCAL CACHE.");
    }
  };

  const handleLogout = async () => {
    SFX.click();
    await logoutUser();
    setGameState(prev => ({ ...prev, user: null }));
    addLog(MessageType.SYSTEM, "DISCONNECTED FROM CLOUD.");
  };

  const saveProgress = async (manual = false, overrideUser: UserProfile | null = null) => {
    const currentUser = overrideUser || gameState.user;
    
    const dataToSave = {
        currentLevelId: gameState.currentLevelId,
        maxReachedLevel: gameState.maxReachedLevel,
        xp: gameState.xp,
        skillLevel: gameState.skillLevel,
        code: gameState.code,
        hintsUsed: gameState.hintsUsed,
        assessmentComplete: gameState.assessmentComplete,
        tutorialPhase: gameState.tutorialPhase,
        unlockedAchievements: gameState.unlockedAchievements,
        user: currentUser
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      if (manual && !currentUser) {
          SFX.click();
          addLog(MessageType.SUCCESS, "LOCAL SAVE COMPLETE.");
      }
    } catch (e) {
      addLog(MessageType.ERROR, "LOCAL SAVE ERROR.");
    }

    if (currentUser) {
        if (manual) addLog(MessageType.SYSTEM, "UPLOADING TO CLOUD...");
        const success = await saveGameState(currentUser, dataToSave);
        if (manual) {
            if (success) {
                SFX.success();
                addLog(MessageType.SUCCESS, "CLOUD SYNC VERIFIED.");
            } else {
                SFX.error();
                addLog(MessageType.ERROR, "CLOUD UPLOAD FAILED.");
            }
        }
    }
  };

  const resetProgress = () => {
    SFX.click();
    if (confirm("WARNING: This will wipe all progress and restart the simulation. Are you sure?")) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  };

  useEffect(() => {
    if (gameState.currentLevelId > 1 || gameState.xp > 0 || gameState.unlockedAchievements.length > 0) {
      saveProgress(false);
    }
  }, [gameState.currentLevelId, gameState.xp, gameState.skillLevel, gameState.user, gameState.maxReachedLevel, gameState.unlockedAchievements]);


  // --- TUTORIAL ENGINE ---

  useEffect(() => {
    if (gameState.isStoryOpen || !gameState.assessmentComplete || gameState.isLevelComplete) return;
    if (gameState.tutorialPhase === 'IDO') return; 

    idleIntervalRef.current = window.setInterval(() => {
      setIdleTime(prev => {
        const newTime = prev + 1;
        checkHintTriggers(newTime);
        return newTime;
      });
    }, 1000);

    return () => {
      if (idleIntervalRef.current) clearInterval(idleIntervalRef.current);
    };
  }, [gameState.isStoryOpen, gameState.assessmentComplete, gameState.isLevelComplete, gameState.tutorialPhase, gameState.skillLevel]);

  useEffect(() => {
    // Reset start time on new level
    startTimeRef.current = Date.now();
    setFailedAttempts(0);
    return () => {
      if (tutorialIntervalRef.current) clearInterval(tutorialIntervalRef.current);
    }
  }, [gameState.currentLevelId]);

  const checkHintTriggers = (time: number) => {
    const thresholds = gameState.skillLevel === 'beginner' 
      ? { t1: 10, t2: 25, t3: 45, t4: 70 }
      : gameState.skillLevel === 'intermediate'
      ? { t1: 30, t2: 60, t3: 120, t4: 180 }
      : { t1: 999, t2: 999, t3: 999, t4: 999 }; 

    if (time === thresholds.t1) setActiveHintTier(1);
    if (time === thresholds.t2) setActiveHintTier(2);
    if (time === thresholds.t3) setActiveHintTier(3);
    if (time === thresholds.t4) setActiveHintTier(4);
  };

  const resetIdleTimer = () => {
    setIdleTime(0);
  };

  const handleAssessmentComplete = (skill: SkillLevel) => {
    SFX.success();
    const levelCode = getInitialCodeForLevel(currentLevel, skill);
    setGameState(prev => ({
      ...prev,
      skillLevel: skill,
      assessmentComplete: true,
      tutorialPhase: (skill !== 'advanced' && prev.currentLevelId === 1) ? 'IDO' : 'NONE',
      code: levelCode
    }));

    if (skill !== 'advanced' && gameState.currentLevelId === 1) {
       startIDoSequence();
    }
  };

  const handleDifficultyChange = (newLevel: SkillLevel) => {
      SFX.click();
      setGameState(prev => ({ ...prev, skillLevel: newLevel }));
      addLog(MessageType.SYSTEM, `DIFFICULTY ADJUSTED TO: ${newLevel.toUpperCase()}`);
  }

  const startIDoSequence = () => {
    if (tutorialIntervalRef.current) clearInterval(tutorialIntervalRef.current);

    setGameState(prev => ({...prev, logs: [], code: ""}));
    addLog(MessageType.SYSTEM, "A.D.A.M.: Watch closely. I will demonstrate the print command.");
    
    const targetCode = 'print("System booting...")';
    let charIndex = 0;

    tutorialIntervalRef.current = window.setInterval(() => {
      if (charIndex <= targetCode.length) {
        setGameState(prev => ({ ...prev, code: targetCode.substring(0, charIndex) }));
        if (Math.random() > 0.5) SFX.typing();
        charIndex++;
      } else {
        if (tutorialIntervalRef.current) clearInterval(tutorialIntervalRef.current);
        
        setTimeout(() => {
          handleRunCode(true); 
          setTimeout(() => {
             setGameState(prev => ({
               ...prev,
               tutorialPhase: 'WEDO',
               code: '', 
               logs: [...prev.logs, { id: 'sys-prompt', type: MessageType.SYSTEM, content: "A.D.A.M.: Now you try. Type: print(\"POWER_CORE_ONLINE\")", timestamp: ""}]
             }));
          }, 2000);
        }, 500);
      }
    }, 50);
  };

  const handleLevelSelect = (id: number) => {
    if (id === gameState.currentLevelId) return;
    SFX.click();
    SFX.levelStart();
    const level = LEVELS.find(l => l.id === id);
    if (!level) return;

    setGameState(prev => ({
        ...prev,
        currentLevelId: id,
        isLevelComplete: false,
        storyQueue: level.storyStart,
        isStoryOpen: true, 
        currentStorySegment: 0,
        code: getInitialCodeForLevel(level, prev.skillLevel),
        status: 'idle',
        logs: [{
          id: `warp-${Date.now()}`,
          type: MessageType.SYSTEM,
          content: `JUMPING TO SECTOR ${id}...`,
          timestamp: new Date().toLocaleTimeString()
        }],
        hintsUsed: 0,
        tutorialPhase: 'NONE'
    }));
    setActiveHintTier(0);
    setIdleTime(0);
    setFailedAttempts(0);
    startTimeRef.current = Date.now();
  };

  const handleStoryNext = () => {
    if (gameState.currentStorySegment < gameState.storyQueue.length - 1) {
      setGameState(prev => ({ ...prev, currentStorySegment: prev.currentStorySegment + 1 }));
    } else {
      setGameState(prev => ({ ...prev, isStoryOpen: false, currentStorySegment: 0 }));
      
      if (gameState.isLevelComplete) {
         if (gameState.currentLevelId < LEVELS.length) {
            const nextLevelId = gameState.currentLevelId + 1;
            const nextLevel = LEVELS.find(l => l.id === nextLevelId);
            if (nextLevel) {
                const nextCode = getInitialCodeForLevel(nextLevel, gameState.skillLevel);

                setGameState(prev => ({
                    ...prev,
                    currentLevelId: nextLevelId,
                    maxReachedLevel: Math.max(prev.maxReachedLevel, nextLevelId), 
                    isLevelComplete: false,
                    storyQueue: nextLevel.storyStart,
                    isStoryOpen: true,
                    code: nextCode,
                    status: 'idle',
                    logs: [],
                    hintsUsed: 0,
                    tutorialPhase: 'NONE'
                }));
                setActiveHintTier(0);
                setIdleTime(0);
                setFailedAttempts(0);
                startTimeRef.current = Date.now();
                SFX.levelStart();
            }
         } else {
             addLog(MessageType.SYSTEM, "ALL MODULES COMPLETE. STANDBY FOR EXPANSION.");
         }
      }
    }
  };

  const handleResetCode = () => {
      SFX.click();
      if (gameState.tutorialPhase === 'IDO') return;
      const resetCode = getInitialCodeForLevel(currentLevel, gameState.skillLevel);
      setGameState(prev => ({...prev, code: resetCode, status: 'idle'}));
      addLog(MessageType.SYSTEM, "Code reset to current difficulty template.");
  };

  const handleRunCode = (isSimulation = false) => {
    if (!isSimulation) SFX.click();
    setGameState(prev => ({ ...prev, status: 'running' }));
    if (!isSimulation) addLog(MessageType.USER, 'Executing script...');

    setTimeout(() => {
      if (gameState.tutorialPhase === 'WEDO' && !isSimulation) {
         const normalized = gameState.code.replace(/\s/g, '').replace(/'/g, '"');
         if (normalized.includes('print("POWER_CORE_ONLINE")')) {
             setGameState(prev => ({ ...prev, tutorialPhase: 'YOUDO', code: '' }));
             addLog(MessageType.SUCCESS, "A.D.A.M.: Excellent syntax. Now apply it to the mission objective.");
             addLog(MessageType.SYSTEM, "MISSION UPDATE: Print \"SYSTEM ONLINE\" to finish.");
             setGameState(prev => ({...prev, status: 'idle'}));
             SFX.success();
             return;
         }
      }

      const result = executeCode(gameState.code, currentLevel);
      
      if (result.success) {
        if (!isSimulation) SFX.success();
        setGameState(prev => ({ ...prev, status: 'success', isLevelComplete: true }));
        addLog(MessageType.SUCCESS, result.message);
        if (result.output) addLog(MessageType.SYSTEM, `OUTPUT: ${result.output}`);
        
        // --- Achievement Checks ---
        if (!isSimulation) {
            if (gameState.hintsUsed === 0 && activeHintTier === 0) {
                checkAndUnlockAchievement('pure_coder');
                // Check consecutive no hints could go here with a counter in state
            }
            const timeTaken = (Date.now() - startTimeRef.current) / 1000;
            if (timeTaken < 30) {
                checkAndUnlockAchievement('speed_demon');
            }
        }

        const baseXP = 100;
        const penalty = (g: GameState) => g.hintsUsed * 10;
        const multiplier = getDifficultyMultiplier(gameState.skillLevel);
        const xpGain = Math.floor((baseXP - penalty(gameState)) * multiplier);

        setTimeout(() => {
           setGameState(prev => ({
               ...prev,
               isStoryOpen: true,
               storyQueue: currentLevel.storyEnd,
               currentStorySegment: 0,
               xp: prev.xp + Math.max(0, xpGain)
           }));
           setExamModalOpen(true);
        }, 1500);

      } else {
        if (!isSimulation) SFX.error();
        setGameState(prev => ({ ...prev, status: 'failed' }));
        addLog(MessageType.ERROR, result.message);
        
        if (!isSimulation) {
            setFailedAttempts(prev => {
                const newVal = prev + 1;
                if (newVal >= 5) checkAndUnlockAchievement('syntax_error');
                return newVal;
            });

            if (gameState.skillLevel === 'beginner') {
                setActiveHintTier(Math.max(activeHintTier, 2));
            }
        }
      }
    }, 800); 
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
        if (gameState.isStoryOpen) {
            if (e.key === 'Enter' || e.key === ' ') {
                handleStoryNext();
            }
        }

        const isCmdOrCtrl = e.ctrlKey || e.metaKey;

        if (isCmdOrCtrl && !e.shiftKey && e.key.toLowerCase() === 'r') {
            e.preventDefault();
            if (gameState.status !== 'running' && gameState.tutorialPhase !== 'IDO') {
                handleRunCode(false);
            }
        }

        if (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'r') {
            e.preventDefault();
            handleResetCode();
        }

        if (isCmdOrCtrl && e.key.toLowerCase() === 'b') {
            e.preventDefault();
            setVaultOpen(prev => !prev);
        }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameState.isStoryOpen, gameState.currentStorySegment, gameState.status, gameState.tutorialPhase, gameState.code, gameState.skillLevel, currentLevel]);

  const handleMuteToggle = () => {
    const isMuted = toggleMute();
    setMuted(isMuted);
  };

  return (
    <div className="flex h-screen w-screen bg-cyber-black text-gray-200 font-sans selection:bg-cyber-neon selection:text-black overflow-hidden relative bg-cyber-grid bg-[length:40px_40px]">
      
      {/* Visual Effects */}
      <div className="absolute inset-0 pointer-events-none bg-scanline bg-[length:100%_4px] animate-scan opacity-20 z-0"></div>
      <div className="absolute inset-0 z-50 pointer-events-none crt-overlay opacity-30"></div>

      {/* MODALS & OVERLAYS */}
      {loginModalOpen && <LoginModal onLogin={handleLogin} onClose={() => setLoginModalOpen(false)} />}
      
      {chatOpen && <AIChatTerminal onClose={() => setChatOpen(false)} />}
      
      {achievementsOpen && (
          <AchievementModal 
            unlockedIds={gameState.unlockedAchievements} 
            onClose={() => setAchievementsOpen(false)} 
          />
      )}
      
      {activeAchievement && (
          <AchievementToast 
            achievement={activeAchievement} 
            onClose={() => setActiveAchievement(null)} 
          />
      )}

      {gameState.isStoryOpen && (
        <StoryOverlay 
          segment={gameState.storyQueue[gameState.currentStorySegment]} 
          onNext={handleStoryNext} 
          isLast={gameState.currentStorySegment === gameState.storyQueue.length - 1}
        />
      )}

      {!gameState.isStoryOpen && !gameState.assessmentComplete && (
         <PreAssessment onComplete={handleAssessmentComplete} />
      )}

      {vaultOpen && (
        <CodeVault 
          unlockedLevel={gameState.currentLevelId} 
          onClose={() => setVaultOpen(false)}
          onCopy={(code) => setGameState(prev => ({...prev, code: code}))}
        />
      )}

      <HintSystem 
        hintData={HINTS_DATABASE[gameState.currentLevelId]}
        activeTier={activeHintTier}
        tutorialPhase={gameState.tutorialPhase}
        onDismiss={() => setActiveHintTier(0)}
        onUseSolution={() => {
           const solution = HINTS_DATABASE[gameState.currentLevelId].tier4.replace("Solution:", "").trim();
           setGameState(prev => ({...prev, code: solution, hintsUsed: prev.hintsUsed + 1}));
           setActiveHintTier(0);
        }}
      />

      {examModalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setExamModalOpen(false)}>
            <div className="bg-white text-black p-8 max-w-lg rounded shadow-2xl border-l-8 border-yellow-500 animate-[slideIn_0.3s]" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <span className="text-yellow-600">⚠</span> ICSE EXAM ALERT
                </h2>
                <div className="mb-4">
                    <h3 className="font-bold text-gray-700 uppercase text-sm mb-1">Topic</h3>
                    <p className="text-gray-900">{currentLevel.icseTopic}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                    <p className="font-serif italic text-lg mb-2">"{currentLevel.icseQuestion.question}"</p>
                    <div className="flex justify-between items-center mt-4">
                        <span className="text-xs font-bold bg-yellow-200 px-2 py-1 rounded text-yellow-800">
                            {currentLevel.icseQuestion.marks} Marks
                        </span>
                        <button 
                            className="text-sm underline text-blue-600 hover:text-blue-800"
                            onClick={() => alert(`Answer: ${currentLevel.icseQuestion.answer}`)}
                        >
                            Reveal Answer
                        </button>
                    </div>
                </div>
                <button 
                    className="mt-6 w-full bg-gray-900 text-white py-2 font-bold hover:bg-gray-800 transition"
                    onClick={() => {SFX.click(); setExamModalOpen(false);}}
                >
                    Dismiss & Continue
                </button>
            </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-64 bg-cyber-dark/95 backdrop-blur-sm border-r border-cyber-slate flex flex-col justify-between hidden md:flex z-10 relative">
        <div className="relative">
          <div className="absolute top-0 right-0 w-2 h-2 bg-cyber-neon shadow-[0_0_10px_#00f3ff]"></div>
          <div className="p-6 border-b border-cyber-slate/50">
            <h1 className="text-xl font-bold text-white tracking-tighter italic">PROJECT <span className="text-cyber-neon text-glow">SINGULARITY</span></h1>
            <div className="text-xs text-gray-500 mt-1">v1.1.0 // IRON REBELLION</div>
          </div>
          
          <div className="p-6">
            <div className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-bold">Pilot Stats</div>
            
            {gameState.user ? (
                <div className="bg-gray-800/50 p-3 rounded border border-gray-600 mb-4 animate-[slideIn_0.3s] box-glow">
                    <div className="flex items-center gap-3 mb-2">
                        {gameState.user.avatarUrl ? (
                            <div className="w-8 h-8 rounded-full bg-white overflow-hidden border border-cyber-neon">
                                <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-bold">
                                    {gameState.user.name.charAt(0)}
                                </div>
                            </div>
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-cyber-slate border border-gray-600"></div>
                        )}
                        <div className="overflow-hidden">
                             <div className="text-sm font-bold truncate text-cyber-neon">{gameState.user.name}</div>
                             <div className="text-[10px] text-gray-500 truncate">{gameState.user.email}</div>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="text-[10px] text-red-500 hover:text-red-400 w-full text-left uppercase font-bold tracking-wider">
                        Disconnect
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-3 mb-4 p-2 border border-transparent hover:border-gray-700 rounded transition-all">
                    <div className="w-10 h-10 rounded-full bg-cyber-slate border border-gray-600 flex items-center justify-center font-mono font-bold text-cyber-neon shadow-[0_0_5px_rgba(0,243,255,0.3)]">
                    {gameState.skillLevel.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="font-bold text-gray-300">Guest Pilot</div>
                        <div className="text-xs text-gray-500">Unregistered Link</div>
                    </div>
                </div>
            )}

            {/* Difficulty Selector */}
            <div className="mb-4">
                <div className="text-xs uppercase tracking-widest text-gray-500 mb-1 font-bold">Difficulty Mode</div>
                <div className="flex gap-1">
                   {(['beginner', 'intermediate', 'advanced'] as SkillLevel[]).map(skill => (
                       <button
                         key={skill}
                         onClick={() => handleDifficultyChange(skill)}
                         onMouseEnter={() => SFX.hover()}
                         className={`flex-1 py-1 text-[10px] uppercase font-bold border transition-all ${gameState.skillLevel === skill ? 'bg-cyber-neon text-black border-cyber-neon shadow-[0_0_10px_rgba(0,243,255,0.4)]' : 'bg-transparent text-gray-600 border-gray-800 hover:border-gray-500 hover:text-gray-400'}`}
                       >
                         {skill === 'beginner' ? 'Easy' : skill === 'intermediate' ? 'Med' : 'Hard'}
                       </button>
                   ))}
                </div>
                <div className="text-[9px] text-gray-500 mt-1 flex justify-between">
                    <span>Reward Factor:</span>
                    <span className="text-cyber-gold font-bold">x{getDifficultyMultiplier(gameState.skillLevel)}</span>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex justify-between items-end mb-1">
                     <span className="text-xs text-cyber-gold font-bold">{gameState.xp} XP</span>
                     <span className="text-[9px] text-gray-600">LEVEL PROGRESS</span>
                </div>
                <div className="w-full bg-gray-900 h-1.5 rounded-full overflow-hidden border border-gray-800">
                    <div className="bg-cyber-gold h-full rounded-full shadow-[0_0_8px_#ffd700]" style={{width: `${Math.min(gameState.xp / 10, 100)}%`}}></div>
                </div>
            </div>

            <div className="space-y-1 max-h-[250px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 pr-1">
                <div className="text-xs uppercase tracking-widest text-gray-500 mt-2 mb-2 font-bold sticky top-0 bg-cyber-dark z-10 py-1">Mission Log</div>
                {LEVELS.map(l => {
                    const isUnlocked = l.id <= gameState.maxReachedLevel;
                    const isActive = l.id === gameState.currentLevelId;
                    return (
                        <button
                            key={l.id}
                            disabled={!isUnlocked}
                            onClick={() => handleLevelSelect(l.id)}
                            onMouseEnter={() => isUnlocked && SFX.hover()}
                            className={`w-full text-left p-2 text-xs border-l-2 pl-3 transition-all flex justify-between items-center group relative ${
                                isActive ? 'border-cyber-neon bg-cyber-neon/10 text-white shadow-[inset_10px_0_20px_-10px_rgba(0,243,255,0.2)]' : 
                                isUnlocked ? 'border-gray-700 text-gray-400 hover:text-white hover:bg-white/5 hover:border-gray-500' : 
                                'border-gray-900 text-gray-800 cursor-not-allowed'
                            }`}
                        >
                            <span className="truncate font-mono">{l.id.toString().padStart(2, '0')} // {l.title.replace(`Level ${l.id}: `, '')}</span>
                            {!isUnlocked && <span className="text-[10px] opacity-30">🔒</span>}
                            {isUnlocked && !isActive && <span className="text-[10px] opacity-0 group-hover:opacity-100 text-cyber-neon">▶</span>}
                        </button>
                    );
                })}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-cyber-slate/50 space-y-2 bg-black/40 backdrop-blur-md">
           {/* Sound Toggle */}
           <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase">System Audio</span>
              <button onClick={handleMuteToggle} className="text-xs text-cyber-neon hover:text-white transition-colors">
                  {muted ? '🔇 MUTED' : '🔊 ACTIVE'}
              </button>
           </div>

           {/* New AI Features */}
           <div className="mb-2 pb-2 border-b border-gray-800">
               <button 
                onClick={() => {
                    SFX.click();
                    setChatOpen(!chatOpen);
                    checkAndUnlockAchievement('neural_link');
                }}
                className={`w-full py-2 text-[10px] font-bold uppercase tracking-wider border transition-all ${chatOpen ? 'bg-cyber-neon text-black border-cyber-neon shadow-[0_0_10px_rgba(0,243,255,0.4)]' : 'bg-gray-900 text-gray-300 border-gray-700 hover:text-white hover:border-gray-500'}`}
               >
                 💬 A.D.A.M. Neural Chat
               </button>
           </div>

           <button 
             onClick={() => {
                 SFX.click();
                 setVaultOpen(true);
                 checkAndUnlockAchievement('curious_mind');
             }}
             title="Ctrl + B"
             className="w-full py-2 bg-gray-900 border border-gray-700 text-gray-400 hover:bg-cyber-neon/10 hover:text-white hover:border-cyber-neon transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 group"
           >
             <span className="group-hover:text-cyber-neon transition-colors">📚</span> Code Vault
           </button>
           <button 
             onClick={() => { SFX.click(); setAchievementsOpen(true); }}
             className="w-full py-2 bg-cyber-gold/10 border border-cyber-gold/50 text-cyber-gold hover:bg-cyber-gold hover:text-black hover:border-cyber-gold transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
           >
             <span>🏆</span> Achievements
           </button>
           
           <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-800">
              {gameState.user ? (
                   <button 
                    onClick={() => saveProgress(true)}
                    className="col-span-1 py-2 bg-blue-900/10 border border-blue-900/50 text-blue-500 hover:bg-blue-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider flex flex-col items-center leading-none justify-center gap-1"
                  >
                    <span>☁️ SYNC</span>
                  </button>
              ) : (
                  <button 
                    onClick={() => { SFX.click(); setLoginModalOpen(true); }}
                    className="col-span-1 py-2 bg-cyber-neon/5 border border-cyber-neon/50 text-cyber-neon hover:bg-cyber-neon hover:text-black transition-all text-[10px] font-bold uppercase tracking-wider"
                  >
                    LOGIN
                  </button>
              )}
             
              <button 
                onClick={resetProgress}
                className="py-2 bg-red-900/10 border border-red-900/50 text-red-600 hover:bg-red-600 hover:text-black transition-all text-[10px] font-bold uppercase tracking-wider"
              >
                RESET
              </button>
           </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 z-10 bg-black/80 backdrop-blur-sm relative">
        <header className="h-16 bg-cyber-dark/80 border-b border-cyber-slate/50 flex items-center justify-between px-6 backdrop-blur-md sticky top-0 z-20">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-3 tracking-wide">
                <span className={`w-2 h-2 bg-cyber-neon rounded-full shadow-[0_0_8px_#00f3ff] ${gameState.status === 'running' ? 'animate-pulse' : ''}`}></span>
                <span className="text-glow">{currentLevel.title}</span>
            </h2>
            <p className="text-xs text-gray-500 font-mono mt-0.5 ml-5">{currentLevel.subTitle}</p>
          </div>
          <div className="flex items-center gap-4">
              <div className="px-3 py-1 border border-gray-700 rounded bg-black/50 text-xs text-gray-400 font-mono">
                  DIFFICULTY: <span className="text-white uppercase font-bold">{gameState.skillLevel}</span>
              </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col md:flex-row min-h-0">
          <div className="flex-1 flex flex-col min-w-0 border-r border-cyber-slate/50 relative">
            <div className="p-4 bg-cyber-dark/50 border-b border-cyber-slate/50">
                <p className="text-sm text-gray-300 leading-relaxed font-sans">{currentLevel.description}</p>
                <div className="mt-3 text-xs text-cyber-neon bg-cyber-neon/5 p-3 rounded-r-lg border-l-2 border-cyber-neon relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-1 opacity-20">🎯</div>
                    <span className="font-bold tracking-wider mr-2">MISSION OBJECTIVE:</span> 
                    <span className="text-gray-300">{currentLevel.objective}</span>
                </div>
            </div>

            <div className="flex-1 min-h-[300px] flex flex-col">
                <CodeEditor 
                    code={gameState.code} 
                    onChange={(val) => {
                      if (gameState.tutorialPhase === 'IDO') return; 
                      setGameState(prev => ({ ...prev, code: val }));
                      resetIdleTimer();
                    }} 
                    readOnly={gameState.tutorialPhase === 'IDO'}
                />
            </div>

            <div className="h-14 bg-cyber-black border-y border-cyber-slate/50 flex items-center justify-end px-4 gap-3 bg-black/50">
                <button 
                    onClick={handleResetCode}
                    disabled={gameState.tutorialPhase === 'IDO'}
                    title="Ctrl + Shift + R"
                    className="px-4 py-1 text-xs text-gray-500 hover:text-white transition-colors disabled:opacity-30 uppercase tracking-wider font-bold"
                >
                    Reset Code
                </button>
                <button 
                    onClick={() => handleRunCode(false)}
                    disabled={gameState.status === 'running' || gameState.tutorialPhase === 'IDO'}
                    id="run-button"
                    title="Ctrl + R"
                    onMouseEnter={() => SFX.hover()}
                    className={`px-6 py-2 bg-cyber-neon text-black font-bold font-mono text-sm uppercase tracking-wider hover:bg-white hover:shadow-[0_0_20px_#00f3ff] transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-transparent`}
                >
                    {gameState.status === 'running' ? 'EXECUTING...' : 'RUN SCRIPT_'}
                </button>
            </div>

            <div className="h-48 border-t border-cyber-slate/30 bg-black/90">
                <Console logs={gameState.logs} />
            </div>
          </div>

          <div className="w-full md:w-[400px] bg-black/40 flex flex-col border-l border-cyber-slate/30">
              <div className="flex-1 relative flex flex-col">
                  <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-black/80 border border-gray-800 text-[9px] text-gray-500 uppercase tracking-widest font-bold rounded">
                      Holographic Projection
                  </div>
                  <Visualizer level={currentLevel} status={gameState.status} />
              </div>
              
              <div className="h-48 bg-cyber-dark/80 border-t border-cyber-slate/50 p-4 overflow-y-auto">
                  <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                      A.D.A.M. Neural Link
                  </h3>
                  <div className="flex gap-3">
                      <button 
                        onClick={() => { SFX.click(); setActiveHintTier(prev => Math.min(prev + 1, 4)); }}
                        className="flex-1 border border-gray-700 bg-black/50 p-3 rounded hover:bg-gray-800 hover:border-gray-600 text-left group transition-all"
                      >
                         <div className="text-xs text-cyber-neon mb-1 group-hover:text-white font-bold tracking-wide">Request Neural Hint</div>
                         <div className="text-[10px] text-gray-500 font-mono">
                             {gameState.skillLevel === 'advanced' ? 'Auto-Hint: DISABLED' : `Latency: ${idleTime}ms`}
                         </div>
                      </button>
                      <button 
                         onClick={() => { SFX.click(); setActiveHintTier(4); }}
                         className="px-4 border border-red-900/50 bg-red-900/10 text-red-500 text-xs rounded hover:bg-red-900/30 hover:border-red-500 hover:text-red-400 transition-all font-bold tracking-widest"
                      >
                        SOS
                      </button>
                  </div>
              </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;
