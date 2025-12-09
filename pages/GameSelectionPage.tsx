
import React from 'react';
import GameCard from '../components/GameCard';
import Button from '../components/Button';
import { GameType } from '../types';
import { GAME_DESCRIPTIONS } from '../constants';

interface GameSelectionPageProps {
  onGameStart: (gameType: GameType) => void;
  onBack: () => void; // New prop for back navigation (to Dashboard)
}

const GameSelectionPage: React.FC<GameSelectionPageProps> = ({ onGameStart, onBack }) => {
  return (
    <section className="bg-white dark:bg-secondary rounded-xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto text-center">
      <div className="w-full flex justify-start mb-6">
        <Button onClick={onBack} variant="outline" size="small" className="w-auto">
          &larr; Back to Dashboard
        </Button>
      </div>
      <h1 className="text-h1 text-secondary dark:text-textLight mb-8">Choose Your Game</h1>
      <p className="text-body text-textDark dark:text-textLight mb-12 max-w-prose mx-auto">
        Select a game to start your brain training journey. Each game targets different cognitive skills.
      </p>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12 justify-center">
        <GameCard
          gameType={GameType.MEMORY_MATCH}
          title={GAME_DESCRIPTIONS[GameType.MEMORY_MATCH].title}
          description={GAME_DESCRIPTIONS[GameType.MEMORY_MATCH].description}
          icon={GAME_DESCRIPTIONS[GameType.MEMORY_MATCH].icon}
          onStart={onGameStart}
        />
        <GameCard
          gameType={GameType.QUICK_MATH}
          title={GAME_DESCRIPTIONS[GameType.QUICK_MATH].title}
          description={GAME_DESCRIPTIONS[GameType.QUICK_MATH].description}
          icon={GAME_DESCRIPTIONS[GameType.QUICK_MATH].icon}
          onStart={onGameStart}
        />
      </div>
    </section>
  );
};

export default GameSelectionPage;