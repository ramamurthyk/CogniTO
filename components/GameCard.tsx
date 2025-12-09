
import React from 'react';
import Button from './Button';
import { GameType } from '../types';

interface GameCardProps {
  gameType: GameType;
  title: string;
  description: string;
  icon: string;
  onStart: (gameType: GameType) => void;
}

const GameCard: React.FC<GameCardProps> = ({ gameType, title, description, icon, onStart }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-bgLight dark:bg-gray-700 rounded-xl shadow-md border border-border dark:border-gray-600">
      <div className="text-5xl text-primary dark:text-primary-dark mb-4" role="img" aria-label={`${title} icon`}>
        {icon}
      </div>
      <h3 className="text-h2 font-bold text-secondary dark:text-textLight mb-2">{title}</h3>
      <p className="text-body text-textDark dark:text-textLight mb-6 flex-grow">{description}</p>
      <Button onClick={() => onStart(gameType)} variant="primary" size="medium" className="w-full sm:w-auto mt-auto">
        Start Game
      </Button>
    </div>
  );
};

export default GameCard;
