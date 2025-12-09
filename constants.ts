
import { GameType } from './types';

export const COLOR_PALETTE = {
  primary: '#2B9BA5',
  primaryDark: '#3FA3B0', // Slightly lighter for dark mode
  secondary: '#1C3A47',
  accent: '#E8916A',
  bgLight: '#F5F7F6',
  bgDark: '#0F1419',
  textDark: '#1A1A1A',
  textLight: '#FFFFFF',
  border: '#E0E4E3',
};

// Assessment Test Data
export const ASSESSMENT_DATA = {
  MEMORY_NUMBERS: {
    COUNT: 5,
    DISPLAY_TIME_MS: 3000,
  },
  MEMORY_WORDS: {
    WORDS: [
      'apple', 'house', 'river', 'cloud', 'chair',
      'music', 'dream', 'light', 'ocean', 'happy',
    ],
    DISPLAY_TIME_MS: 5000,
  },
  SPEED: {
    MIN_DELAY_MS: 1000,
    MAX_DELAY_MS: 3000,
    TRIALS: 3,
  },
  LOGIC_PATTERNS: [
    {
      sequence: ['A', 'B', 'C', 'D'],
      next: 'E',
      hint: 'Alphabetical sequence',
      choices: ['C', 'F', 'E', 'Z']
    },
    {
      sequence: ['2', '4', '6', '8'],
      next: '10',
      hint: 'Even numbers',
      choices: ['9', '11', '10', '12']
    },
    {
      sequence: ['▲', '△', '▲', '△'],
      next: '▲',
      hint: 'Alternating shapes',
      choices: ['▲', '△', '◼︎', '◻︎']
    },
    {
      sequence: ['1', '1', '2', '3', '5'],
      next: '8',
      hint: 'Fibonacci sequence',
      choices: ['7', '8', '9', '13']
    },
    {
      sequence: ['Sun', 'Mon', 'Tue'],
      next: 'Wed',
      hint: 'Days of the week',
      choices: ['Sat', 'Thur', 'Wed', 'Fri']
    },
  ],
  WORKING_MEMORY_MATH: [
    { problem: '8 + 5 - 3 = 10', answer: true },
    { problem: '12 - 4 + 7 = 15', answer: true },
    { problem: '9 + 6 - 2 = 12', answer: false },
    { problem: '7 + 3 - 5 = 5', answer: true },
    { problem: '15 - 8 + 1 = 6', answer: false },
  ],
};

// Game Specific Constants
export const MEMORY_MATCH_CONFIG = {
  GRID_SIZE: { rows: 4, cols: 2 }, // Total 8 cards
  ICONS: [
    '🧠', '💡', '🌟', '🧩', '⏳', '✨', '🔎', '🔗'
  ],
  GAME_DURATION_MS: 60000, // 60 seconds
  MATCH_SCORE: 100,
};

export const QUICK_MATH_CONFIG = {
  PROBLEM_COUNT: 10,
  GENERATE_PROBLEM: () => {
    const num1 = Math.floor(Math.random() * 20) + 1;
    const num2 = Math.floor(Math.random() * 20) + 1;
    const operator = Math.random() < 0.5 ? '+' : '-';
    const actualAnswer = operator === '+' ? num1 + num2 : num1 - num2;
    const isCorrect = Math.random() < 0.7; // 70% chance of correct answer for variety
    const displayAnswer = isCorrect ? actualAnswer : actualAnswer + (Math.random() < 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 1);
    return {
      problem: `${num1} ${operator} ${num2}`,
      actualAnswer: actualAnswer,
      displayAnswer: displayAnswer,
    };
  },
  TIME_PER_PROBLEM_MS: 10000, // 10 seconds per problem
  CORRECT_SCORE: 100,
  INCORRECT_PENALTY: -50,
};

export const GAME_DESCRIPTIONS: Record<GameType, { title: string; description: string; icon: string }> = {
  [GameType.MEMORY_MATCH]: {
    title: 'Memory Match',
    description: 'Flip cards to find matching pairs and sharpen your visual memory.',
    icon: '🧠',
  },
  [GameType.QUICK_MATH]: {
    title: 'Quick Math',
    description: 'Solve arithmetic problems rapidly to boost your numerical processing speed.',
    icon: '🧮',
  },
};
