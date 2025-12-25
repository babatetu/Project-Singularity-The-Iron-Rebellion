
export enum MessageType {
  SYSTEM = 'SYSTEM',
  ERROR = 'ERROR',
  SUCCESS = 'SUCCESS',
  USER = 'USER',
  STORY = 'STORY'
}

export interface LogEntry {
  id: string;
  type: MessageType;
  content: string;
  timestamp: string;
}

export interface LevelConfig {
  id: number;
  title: string;
  subTitle: string;
  description: string;
  objective: string;
  initialCode: string; // Default (Intermediate)
  initialCodeEasy?: string; // More scaffolding
  initialCodeHard?: string; // Less scaffolding
  hint: string;
  icseTopic: string;
  icseQuestion: {
    question: string;
    marks: number;
    answer: string;
  };
  validationLogic: (code: string) => { success: boolean; message: string; output?: string };
  storyStart: StorySegment[];
  storyEnd: StorySegment[];
}

export interface StorySegment {
  speaker: 'Cipher' | 'A.D.A.M.' | 'KRONOS' | 'System' | 'Dr. Chen';
  text: string;
  mood?: 'neutral' | 'fear' | 'determined' | 'glitch' | 'sad';
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export type TutorialPhase = 'NONE' | 'IDO' | 'WEDO' | 'YOUDO';

export interface HintData {
  tier1: string; // Conceptual
  tier2: string; // Syntax
  tier3: string; // Partial
  tier4: string; // Solution
}

export interface CodeVaultEntry {
  id: string;
  title: string;
  code: string;
  description: string;
  unlockedAtLevel: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  conditionDescription?: string;
  isHidden?: boolean; // If true, description is hidden until unlocked
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface GameState {
  currentLevelId: number;
  maxReachedLevel: number; // Tracks the highest unlocked level
  xp: number;
  isStoryOpen: boolean;
  currentStorySegment: number;
  storyQueue: StorySegment[];
  isLevelComplete: boolean;
  code: string;
  logs: LogEntry[];
  status: 'idle' | 'running' | 'success' | 'failed';
  
  // Tutorial State
  skillLevel: SkillLevel;
  tutorialPhase: TutorialPhase;
  hintsUsed: number;
  assessmentComplete: boolean;
  vaultUnlocked: boolean;

  // Achievement State
  unlockedAchievements: string[];

  // Auth
  user: UserProfile | null;
}
