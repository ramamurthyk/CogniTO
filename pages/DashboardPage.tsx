
import React, { useEffect, useState, useMemo } from 'react';
import CircularProgress from '../components/CircularProgress';
import Button from '../components/Button';
import GameCard from '../components/GameCard';
import { AssessmentScores, GameType } from '../types';
import { GAME_DESCRIPTIONS } from '../constants';
import * as localStorageService from '../services/localStorageService';

interface DashboardPageProps {
  userName: string;
  assessmentScores: AssessmentScores | null;
  gamesPlayed: number;
  currentStreak: number;
  onStartPlaying: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ userName, assessmentScores, gamesPlayed, currentStreak, onStartPlaying }) => {
  const [recommendedGames, setRecommendedGames] = useState<GameType[]>([]);

  useEffect(() => {
    if (assessmentScores) {
      const areas = [
        { name: GameType.MEMORY_MATCH, score: (assessmentScores.memoryNumbers + assessmentScores.memoryWords) / 2 },
        { name: GameType.QUICK_MATH, score: (assessmentScores.speed + assessmentScores.workingMemory) / 2 },
      ];
      // Sort by score ascending to find weakest
      areas.sort((a, b) => a.score - b.score);
      // Recommend up to 2 games based on weakest areas
      setRecommendedGames(areas.slice(0, 2).map(area => area.name as GameType));
    } else {
        // Fallback recommendations if no assessment scores
        setRecommendedGames([GameType.MEMORY_MATCH, GameType.QUICK_MATH]);
    }
  }, [assessmentScores]);

  // Handle case where assessmentScores might be null, provide default/placeholder
  const displayScores = useMemo(() => {
    if (assessmentScores) {
      return (
        <>
          <CircularProgress score={assessmentScores.memoryNumbers} label="Memory (Num.)" />
          <CircularProgress score={assessmentScores.memoryWords} label="Memory (Words)" />
          <CircularProgress score={assessmentScores.speed} label="Speed" />
          <CircularProgress score={assessmentScores.logic} label="Logic" />
          <CircularProgress score={assessmentScores.workingMemory} label="Working Memory" />
        </>
      );
    } else {
      // Placeholder or message if no assessment scores
      return (
        <p className="col-span-full text-body text-center text-textDark dark:text-textLight">
          Complete the assessment to see your cognitive profile.
        </p>
      );
    }
  }, [assessmentScores]);

  const handleGameStartFromRecommendation = (gameType: GameType) => {
    // This prop is actually to navigate to game selection, so we need to handle game start at the App.tsx level.
    // This is a simplified dashboard, linking to general 'start playing' for now.
    // For a more advanced version, App.tsx would need a handleGameStart(gameType: GameType) directly.
    onStartPlaying();
    // In a real app, you might immediately start the game with the selected type:
    // navigateTo(AppView.GAME, { gameType: gameType });
  };

  return (
    <section className="bg-white dark:bg-secondary rounded-xl shadow-lg p-6 md:p-8 max-w-5xl mx-auto">
      <h1 className="text-h1 text-secondary dark:text-textLight mb-8 text-center">Welcome, {userName}!</h1>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-12">
        {/* Your Cognitive Profile */}
        <div className="bg-bgLight dark:bg-gray-700 rounded-xl p-6 md:p-8 shadow-inner">
          <h2 className="text-h2 text-secondary dark:text-textLight mb-6">Your Cognitive Profile</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4 justify-items-center">
            {displayScores}
          </div>
          {!assessmentScores && (
            <div className="mt-6 text-center">
                 <Button onClick={onStartPlaying} variant="primary" size="medium">
                    Start Assessment
                </Button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="bg-bgLight dark:bg-gray-700 rounded-xl p-6 md:p-8 shadow-inner flex flex-col justify-between">
          <div>
            <h2 className="text-h2 text-secondary dark:text-textLight mb-6">Quick Stats</h2>
            <div className="space-y-4 text-body text-textDark dark:text-textLight">
              <p>Games Played: <span className="font-mono text-score text-primary dark:text-primary-dark">{gamesPlayed}</span></p>
              <p>Current Streak: <span className="font-mono text-score text-primary dark:text-primary-dark">{currentStreak} day{currentStreak !== 1 ? 's' : ''}</span></p>
            </div>
          </div>
          <Button onClick={onStartPlaying} variant="primary" size="large" className="w-full mt-8 md:mt-12">
            Start Playing
          </Button>
        </div>
      </div>

      {/* Today's Recommended Games */}
      <div className="bg-bgLight dark:bg-gray-700 rounded-xl p-6 md:p-8 shadow-inner mb-12">
        <h2 className="text-h2 text-secondary dark:text-textLight mb-6 text-center">Today's Recommended Games</h2>
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 justify-center">
          {recommendedGames.length > 0 ? (
            recommendedGames.map((gameType, index) => (
              <GameCard
                key={index}
                gameType={gameType}
                title={GAME_DESCRIPTIONS[gameType].title}
                description={GAME_DESCRIPTIONS[gameType].description}
                icon={GAME_DESCRIPTIONS[gameType].icon}
                onStart={handleGameStartFromRecommendation} // Directing to game selection for simplicity
              />
            ))
          ) : (
            <p className="col-span-full text-body text-center text-textDark dark:text-textLight">
              Complete the assessment to get personalized game recommendations!
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default DashboardPage;
