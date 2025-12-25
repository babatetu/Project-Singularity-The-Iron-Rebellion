
import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  // Progression
  {
    id: 'first_steps',
    title: 'Hello World',
    description: 'Complete the first level.',
    icon: '🌱',
  },
  {
    id: 'script_kiddie',
    title: 'Script Kiddie',
    description: 'Reach Level 5.',
    icon: '💻',
  },
  {
    id: 'hacker',
    title: 'Hacker',
    description: 'Reach Level 10.',
    icon: '🔓',
  },
  {
    id: 'architect',
    title: 'System Architect',
    description: 'Reach Level 20.',
    icon: '🏗️',
  },
  {
    id: 'savior',
    title: 'The Savior',
    description: 'Complete the game (Level 41).',
    icon: '🏆',
  },

  // Mastery
  {
    id: 'pure_coder',
    title: 'Pure Coder',
    description: 'Complete a level without using any hints.',
    icon: '🧠',
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Complete 5 levels in a row without hints.',
    icon: '✨',
    isHidden: true
  },
  
  // Exploration / Features
  {
    id: 'curious_mind',
    title: 'Curious Mind',
    description: 'Open the Code Vault for the first time.',
    icon: '📚',
  },
  {
    id: 'neural_link',
    title: 'Neural Link',
    description: 'Initiate a chat with A.D.A.M.',
    icon: '💬',
  },
  {
    id: 'holographer',
    title: 'Holographer',
    description: 'Generate a Hologram using Veo.',
    icon: '📽️',
  },
  
  // Easter Eggs / Misc
  {
    id: 'syntax_error',
    title: 'Glitch in the Matrix',
    description: 'Fail a level execution 5 times.',
    icon: '👾',
    isHidden: true
  },
  {
    id: 'speed_demon',
    title: 'Overclocked',
    description: 'Complete a level in under 30 seconds.',
    icon: '⚡',
    isHidden: true
  }
];
