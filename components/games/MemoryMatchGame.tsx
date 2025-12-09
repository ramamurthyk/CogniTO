
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MEMORY_MATCH_CONFIG } from '../../constants';
import { GameResult } from '../../types';

interface MemoryMatchGameProps {
  onGameEnd: (result: GameResult) => void;
}

interface Card {
  id: number;
  icon: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ onGameEnd }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]); // indices of flipped cards
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(MEMORY_MATCH_CONFIG.GAME_DURATION_MS / 1000);
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef<number | null>(null);
  const flipTimeoutRef = useRef<number | null>(null);

  const initializeGame = useCallback(() => {
    const totalCards = MEMORY_MATCH_CONFIG.GRID_SIZE.rows * MEMORY_MATCH_CONFIG.GRID_SIZE.cols;
    const icons = MEMORY_MATCH_CONFIG.ICONS.slice(0, totalCards / 2);
    const shuffledIcons = [...icons, ...icons].sort(() => Math.random() - 0.5);

    const initialCards: Card[] = shuffledIcons.map((icon, index) => ({
      id: index,
      icon: icon,
      isFlipped: false,
      isMatched: false,
    }));

    setCards(initialCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setScore(0);
    setTimeRemaining(MEMORY_MATCH_CONFIG.GAME_DURATION_MS / 1000);
    setGameOver(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = window.setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerRef.current!);
          setGameOver(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    initializeGame();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  useEffect(() => {
    if (matchedPairs * 2 === cards.length && cards.length > 0) {
      // All pairs found
      setGameOver(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [matchedPairs, cards.length]);

  useEffect(() => {
    if (gameOver) {
      onGameEnd({
        score: score,
        time: (MEMORY_MATCH_CONFIG.GAME_DURATION_MS / 1000) - timeRemaining,
        accuracy: (matchedPairs / (cards.length / 2)) * 100, // % of pairs found
        date: new Date().toISOString(),
      });
    }
  }, [gameOver, score, timeRemaining, matchedPairs, cards.length, onGameEnd]);

  const handleCardClick = useCallback((index: number) => {
    if (gameOver || cards[index].isFlipped || cards[index].isMatched || flippedCards.length === 2) {
      return;
    }

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    setFlippedCards(prev => [...prev, index]);
  }, [cards, flippedCards.length, gameOver]);

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstIndex, secondIndex] = flippedCards;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.icon === secondCard.icon) {
        // Match found
        setScore(prevScore => prevScore + MEMORY_MATCH_CONFIG.MATCH_SCORE);
        setMatchedPairs(prevPairs => prevPairs + 1);
        setCards(prevCards => {
          const updatedCards = [...prevCards];
          updatedCards[firstIndex].isMatched = true;
          updatedCards[secondIndex].isMatched = true;
          return updatedCards;
        });
        setFlippedCards([]);
      } else {
        // No match, flip back after a delay
        flipTimeoutRef.current = window.setTimeout(() => {
          setCards(prevCards => {
            const updatedCards = [...prevCards];
            updatedCards[firstIndex].isFlipped = false;
            updatedCards[secondIndex].isFlipped = false;
            return updatedCards;
          });
          setFlippedCards([]);
        }, 1000);
      }
    }
    return () => {
      if (flipTimeoutRef.current) clearTimeout(flipTimeoutRef.current);
    };
  }, [flippedCards, cards, score]);

  const completionPercentage = cards.length > 0 ? (matchedPairs * 2 / cards.length) * 100 : 0;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl">
      <div className="flex justify-between w-full mb-6 text-body font-medium text-textDark dark:text-textLight">
        <span>Score: <span className="font-mono text-score">{score}</span></span>
        <span>Time: <span className="font-mono text-score">{timeRemaining}s</span></span>
      </div>
      <div className="w-full h-2 bg-border dark:bg-gray-700 rounded-full mb-6">
        <div
          className="bg-accent h-full rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${completionPercentage}%` }}
          role="progressbar"
          aria-valuenow={completionPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Game completion: ${Math.round(completionPercentage)} percent`}
        ></div>
      </div>
      <div
        className={`grid gap-4 w-full`}
        style={{
          gridTemplateColumns: `repeat(${MEMORY_MATCH_CONFIG.GRID_SIZE.cols}, 1fr)`,
          gridTemplateRows: `repeat(${MEMORY_MATCH_CONFIG.GRID_SIZE.rows}, 1fr)`,
        }}
      >
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`relative flex items-center justify-center p-4 aspect-square rounded-xl shadow-md cursor-pointer
                        transition-all duration-200 ease-in-out select-none
                        ${card.isFlipped || card.isMatched ? 'bg-primary dark:bg-primary-dark text-textLight' : 'bg-bgLight dark:bg-gray-700 text-secondary dark:text-textLight hover:bg-border dark:hover:bg-gray-600'}
                        ${card.isMatched ? 'opacity-50 pointer-events-none' : ''}`}
            disabled={card.isMatched || gameOver}
            aria-label={card.isFlipped || card.isMatched ? `Card showing ${card.icon}` : 'Hidden card, click to reveal'}
          >
            {(card.isFlipped || card.isMatched) && (
              <span className="text-4xl md:text-5xl font-bold">{card.icon}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MemoryMatchGame;
