
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import AssessmentFlow from './pages/AssessmentFlow';
import ResultsPage from './pages/ResultsPage';
import GameSelectionPage from './pages/GameSelectionPage';
import GameScreen from './pages/GameScreen';
import DashboardPage from './pages/DashboardPage';
import * as localStorageService from './services/localStorageService';
import { AppView, AssessmentScores, GameType, GameResult, UserData, INITIAL_USER_DATA } from './types';
import { generateCognitiveProfileMessage } from './services/geminiService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.LOADING);
  const [userData, setUserData] = useState<UserData>(INITIAL_USER_DATA);
  const [assessmentScores, setAssessmentScores] = useState<AssessmentScores | null>(null);
  const [gameResults, setGameResults] = useState<Record<GameType, GameResult[]>>({
    [GameType.MEMORY_MATCH]: [],
    [GameType.QUICK_MATH]: [],
  });
  const [currentGameType, setCurrentGameType] = useState<GameType | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedMode = localStorageService.loadSetting<boolean>('isDarkMode');
    return savedMode !== null ? savedMode : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [navigationStack, setNavigationStack] = useState<AppView[]>([]); // New state for navigation history

  // Apply dark mode class to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorageService.saveSetting('isDarkMode', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prevMode => !prevMode);
  }, []);

  // Navigation functions
  const navigateTo = useCallback((view: AppView) => {
    setNavigationStack(prevStack => [...prevStack, currentView]); // Push current view to stack
    setCurrentView(view);
  }, [currentView]);

  const goBack = useCallback(() => {
    setNavigationStack(prevStack => {
      const newStack = [...prevStack];
      const previousView = newStack.pop(); // Pop the last view
      if (previousView) {
        setCurrentView(previousView); // Go to previous view
      } else {
        // If stack is empty, go to a default view (e.g., Landing or Dashboard)
        if (assessmentScores && userData.name) {
          setCurrentView(AppView.DASHBOARD);
        } else {
          setCurrentView(AppView.LANDING);
        }
      }
      return newStack;
    });
  }, [assessmentScores, userData.name]);

  // Load initial data from localStorage
  useEffect(() => {
    const loadedUserData = localStorageService.loadUserData();
    const loadedAssessmentScores = localStorageService.loadAssessmentResults();
    const loadedGameResults = localStorageService.loadGameResults();

    setUserData(loadedUserData || INITIAL_USER_DATA);
    setAssessmentScores(loadedAssessmentScores);
    setGameResults(loadedGameResults);

    // Determine initial view and set initial navigation stack
    if (loadedAssessmentScores && loadedUserData?.name) {
      setCurrentView(AppView.DASHBOARD);
      setNavigationStack([AppView.DASHBOARD]); // Start stack with dashboard if logged in
    } else {
      setCurrentView(AppView.LANDING);
      setNavigationStack([AppView.LANDING]); // Start stack with landing
    }
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  const handleStartAssessment = useCallback((name: string) => {
    const updatedUserData = { ...userData, name: name };
    setUserData(updatedUserData);
    localStorageService.saveUserData(updatedUserData);
    navigateTo(AppView.ASSESSMENT);
  }, [userData, navigateTo]);

  const handleAssessmentComplete = useCallback(async (scores: AssessmentScores) => {
    setAssessmentScores(scores);
    localStorageService.saveAssessmentResults(scores);

    // Generate personalized message using Gemini API
    try {
      const message = await generateCognitiveProfileMessage(scores);
      const updatedScores = { ...scores, profileMessage: message };
      setAssessmentScores(updatedScores);
      localStorageService.saveAssessmentResults(updatedScores); // Save with message
    } catch (error) {
      console.error('Error generating AI message:', error);
      // Fallback or display error message to user
    }
    navigateTo(AppView.RESULTS);
  }, [navigateTo]);

  const handleGameStart = useCallback((gameType: GameType) => {
    setCurrentGameType(gameType);
    navigateTo(AppView.GAME);
  }, [navigateTo]);

  const handleGameEnd = useCallback((result: GameResult) => {
    if (currentGameType) {
      localStorageService.saveGameResult(currentGameType, result);
      localStorageService.updateGameStats();
      setGameResults(localStorageService.loadGameResults());
      setCurrentGameType(null);
    }
    navigateTo(AppView.GAME_SELECTION);
  }, [currentGameType, navigateTo]);

  const handleGameCancel = useCallback(() => {
    // Just go back to game selection without saving results
    setCurrentGameType(null);
    goBack(); // This will effectively pop GAME and show GAME_SELECTION
  }, [goBack]);

  const currentMaxGamesPlayed = localStorageService.loadSetting<number>('gamesPlayed') || 0;
  const currentStreak = localStorageService.loadSetting<number>('currentStreak') || 0;

  let content;
  if (currentView === AppView.LOADING) {
    content = <div className="flex justify-center items-center flex-grow py-12 text-h2 text-primary">Loading...</div>;
  } else {
    switch (currentView) {
      case AppView.LANDING:
        content = <LandingPage onStartAssessment={handleStartAssessment} showBackButton={navigationStack.length > 0} onBack={goBack} />;
        break;
      case AppView.ASSESSMENT:
        content = <AssessmentFlow onAssessmentComplete={handleAssessmentComplete} onBack={goBack} />;
        break;
      case AppView.RESULTS:
        content = assessmentScores ? (
          <ResultsPage
            scores={assessmentScores}
            onPlayGames={() => navigateTo(AppView.GAME_SELECTION)}
            onViewDashboard={() => navigateTo(AppView.DASHBOARD)}
          />
        ) : (
          <p className="p-8 text-center">No assessment results available. Please complete the assessment.</p>
        );
        break;
      case AppView.GAME_SELECTION:
        content = <GameSelectionPage onGameStart={handleGameStart} onBack={goBack} />;
        break;
      case AppView.GAME:
        content = currentGameType ? (
          <GameScreen gameType={currentGameType} onGameEnd={handleGameEnd} onBackToGames={() => navigateTo(AppView.GAME_SELECTION)} onCancelGame={handleGameCancel} />
        ) : (
          <p className="p-8 text-center">No game selected. Please choose a game.</p>
        );
        break;
      case AppView.DASHBOARD:
        content = (
          <DashboardPage
            userName={userData.name || 'User'}
            assessmentScores={assessmentScores}
            gamesPlayed={currentMaxGamesPlayed}
            currentStreak={currentStreak}
            onStartPlaying={() => navigateTo(AppView.GAME_SELECTION)}
          />
        );
        break;
      default:
        content = <LandingPage onStartAssessment={handleStartAssessment} showBackButton={navigationStack.length > 0} onBack={goBack} />;
    }
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} userName={userData.name} assessmentCompleted={!!assessmentScores} onNavigateToDashboard={() => navigateTo(AppView.DASHBOARD)} />
      <main className="flex-grow container mx-auto px-4 py-8 md:p-8 lg:px-12 max-w-screen-xl relative">
        {/* Added key and animation for page transitions */}
        <div key={currentView} className="animation-fade-in">
          {content}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;