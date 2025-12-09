
import { UserData, AssessmentScores, GameResult, GameType } from '../types';

const USER_DATA_KEY = 'cognitrain_user_data';
const ASSESSMENT_RESULTS_KEY = 'cognitrain_assessment_results';
const GAME_RESULTS_KEY_PREFIX = 'cognitrain_game_results_'; // _[GameType]
const LAST_PLAYED_DATE_KEY = 'cognitrain_last_played_date';
const GAMES_PLAYED_KEY = 'cognitrain_games_played';
const CURRENT_STREAK_KEY = 'cognitrain_current_streak';
const SETTINGS_KEY_PREFIX = 'cognitrain_setting_';

// --- User Data ---
export const saveUserData = (data: UserData) => {
  try {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving user data to localStorage:', error);
  }
};

export const loadUserData = (): UserData | null => {
  try {
    const data = localStorage.getItem(USER_DATA_KEY);
    return data ? (JSON.parse(data) as UserData) : null;
  } catch (error) {
    console.error('Error loading user data from localStorage:', error);
    return null;
  }
};

// --- Assessment Results ---
export const saveAssessmentResults = (data: AssessmentScores) => {
  try {
    localStorage.setItem(ASSESSMENT_RESULTS_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving assessment results to localStorage:', error);
  }
};

export const loadAssessmentResults = (): AssessmentScores | null => {
  try {
    const data = localStorage.getItem(ASSESSMENT_RESULTS_KEY);
    return data ? (JSON.parse(data) as AssessmentScores) : null;
  } catch (error) {
    console.error('Error loading assessment results from localStorage:', error);
    return null;
  }
};

// --- Game Results ---
export const saveGameResult = (gameType: GameType, result: GameResult) => {
  try {
    const key = `${GAME_RESULTS_KEY_PREFIX}${gameType}`;
    const existingResults = loadGameResultsForType(gameType);
    const updatedResults = [...existingResults, result];
    localStorage.setItem(key, JSON.stringify(updatedResults));
  } catch (error) {
    console.error(`Error saving game results for ${gameType} to localStorage:`, error);
  }
};

export const loadGameResultsForType = (gameType: GameType): GameResult[] => {
  try {
    const key = `${GAME_RESULTS_KEY_PREFIX}${gameType}`;
    const data = localStorage.getItem(key);
    return data ? (JSON.parse(data) as GameResult[]) : [];
  } catch (error) {
    console.error(`Error loading game results for ${gameType} from localStorage:`, error);
    return [];
  }
};

export const loadGameResults = (): Record<GameType, GameResult[]> => {
  const allResults: Record<GameType, GameResult[]> = {
    [GameType.MEMORY_MATCH]: [],
    [GameType.QUICK_MATH]: [],
  };
  for (const gameType of Object.values(GameType)) {
    allResults[gameType] = loadGameResultsForType(gameType);
  }
  return allResults;
};

// --- Game Stats (Games Played, Streak) ---
export const updateGameStats = () => {
  try {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const lastPlayedDate = localStorage.getItem(LAST_PLAYED_DATE_KEY);
    let currentStreak = parseInt(localStorage.getItem(CURRENT_STREAK_KEY) || '0', 10);
    let gamesPlayed = parseInt(localStorage.getItem(GAMES_PLAYED_KEY) || '0', 10);

    // Increment total games played
    gamesPlayed++;
    localStorage.setItem(GAMES_PLAYED_KEY, gamesPlayed.toString());

    if (!lastPlayedDate) {
      // First game ever
      currentStreak = 1;
    } else if (lastPlayedDate === today) {
      // Played multiple times today, streak doesn't change
      // No action needed for streak, already counted
    } else {
      // Check if it's consecutive day
      const lastDate = new Date(lastPlayedDate);
      const todayDate = new Date(today);
      const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day
        currentStreak++;
      } else {
        // Gap in playing, reset streak
        currentStreak = 1;
      }
    }

    localStorage.setItem(LAST_PLAYED_DATE_KEY, today);
    localStorage.setItem(CURRENT_STREAK_KEY, currentStreak.toString());

  } catch (error) {
    console.error('Error updating game stats to localStorage:', error);
  }
};

export const getGameStats = () => {
  try {
    const gamesPlayed = parseInt(localStorage.getItem(GAMES_PLAYED_KEY) || '0', 10);
    const currentStreak = parseInt(localStorage.getItem(CURRENT_STREAK_KEY) || '0', 10);
    return { gamesPlayed, currentStreak };
  } catch (error) {
    console.error('Error getting game stats from localStorage:', error);
    return { gamesPlayed: 0, currentStreak: 0 };
  }
};

// --- Settings (e.g., dark mode) ---
export const saveSetting = <T>(key: string, value: T) => {
  try {
    localStorage.setItem(`${SETTINGS_KEY_PREFIX}${key}`, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving setting '${key}' to localStorage:`, error);
  }
};

export const loadSetting = <T>(key: string): T | null => {
  try {
    const data = localStorage.getItem(`${SETTINGS_KEY_PREFIX}${key}`);
    return data ? (JSON.parse(data) as T) : null;
  } catch (error) {
    console.error(`Error loading setting '${key}' from localStorage:`, error);
    return null;
  }
};

// --- Clear all data ---
export const clearAllData = () => {
  try {
    localStorage.clear();
    console.log('All localStorage data cleared.');
  } catch (error) {
    console.error('Error clearing all localStorage data:', error);
  }
};
