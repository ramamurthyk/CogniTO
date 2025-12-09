
import React, { useState } from 'react';
import MemoryMatchGame from '../components/games/MemoryMatchGame';
import QuickMathGame from '../components/games/QuickMathGame';
import Button from '../components/Button';
import { GameType, GameResult } from '../types';

interface GameScreenProps {
  gameType: GameType;
  onGameEnd: (result: GameResult) => void;
  onBackToGames: () => void;
  onCancelGame: () => void; // New prop for canceling the game
}

const GameScreen: React.FC<GameScreenProps> = ({ gameType, onGameEnd, onBackToGames, onCancelGame }) => {
  const [gameEnded, setGameEnded] = useState(false);
  const [lastGameResult, setLastGameResult] = useState<GameResult | null>(null);

  const handleGameEndInternal = (result: GameResult) => {
    setLastGameResult(result);
    setGameEnded(true);
    onGameEnd(result); // Pass result up to App.tsx
  };

  const handlePlayAgain = () => {
    setGameEnded(false);
    setLastGameResult(null);
    // Re-initialize the game component by changing its key or remounting
    // For simplicity, we just reset the state; the child game components
    // should re-initialize themselves when `gameEnded` is false again.
  };

  const renderGameComponent = () => {
    switch (gameType) {
      case GameType.MEMORY_MATCH:
        return <MemoryMatchGame onGameEnd={handleGameEndInternal} />;
      case GameType.QUICK_MATH:
        return <QuickMathGame onGameEnd={handleGameEndInternal} />;
      default:
        return <p className="text-body text-textDark dark:text-textLight">Game not found.</p>;
    }
  };

  if (gameEnded && lastGameResult) {
    return (
      <div className="flex flex-col items-center justify-center bg-white dark:bg-secondary rounded-xl shadow-lg p-6 md:p-8 max-w-md mx-auto text-center">
        <h2 className="text-h1 text-primary dark:text-primary-dark mb-6">Game Over!</h2>
        <p className="text-h2 text-secondary dark:text-textLight mb-4">Score: <span className="font-mono">{lastGameResult.score}</span></p>
        {lastGameResult.accuracy !== undefined && (
          <p className="text-body text-textDark dark:text-textLight mb-4">Accuracy: <span className="font-mono">{Math.round(lastGameResult.accuracy)}%</span></p>
        )}
        {lastGameResult.time !== undefined && (
          <p className="text-body text-textDark dark:text-textLight mb-6">Time: <span className="font-mono">{lastGameResult.time}s</span></p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Button onClick={handlePlayAgain} variant="primary" size="medium" className="w-full sm:w-auto">
            Play Again
          </Button>
          <Button onClick={onBackToGames} variant="outline" size="medium" className="w-full sm:w-auto">
            Back to Games
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white dark:bg-secondary rounded-xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6">
        <h1 className="text-h1 text-secondary dark:text-textLight text-center flex-grow">
          {gameType === GameType.MEMORY_MATCH ? 'Memory Match' : 'Quick Math'}
        </h1>
        {/* Only show cancel button if game is active */}
        {!gameEnded && (
          <Button onClick={onCancelGame} variant="outline" size="small" className="ml-auto w-auto">
            Cancel Game
          </Button>
        )}
      </div>
      <div className="w-full flex-grow flex items-center justify-center">
        {renderGameComponent()}
      </div>
    </section>
  );
};

export default GameScreen;