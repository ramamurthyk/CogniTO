
export enum AppView {
  LOADING = 'LOADING',
  LANDING = 'LANDING',
  ASSESSMENT = 'ASSESSMENT',
  RESULTS = 'RESULTS',
  GAME_SELECTION = 'GAME_SELECTION',
  GAME = 'GAME',
  DASHBOARD = 'DASHBOARD',
}

export enum GameType {
  MEMORY_MATCH = 'MEMORY_MATCH',
  QUICK_MATH = 'QUICK_MATH',
}

export interface AssessmentScores {
  memoryNumbers: number; // 0-100% accuracy
  memoryWords: number;   // 0-100% accuracy
  speed: number;         // 0-100 score, where 100 is best reaction time
  logic: number;         // 0-100% accuracy
  workingMemory: number; // 0-100% accuracy
  profileMessage?: string; // AI generated message
}

export interface GameResult {
  score: number;
  accuracy?: number; // For games where applicable
  time?: number;     // For timed games
  date: string;
}

export interface UserData {
  name: string | null;
}

export const INITIAL_USER_DATA: UserData = {
  name: null,
};
