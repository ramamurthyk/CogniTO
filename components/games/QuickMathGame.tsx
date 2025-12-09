
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { QUICK_MATH_CONFIG } from '../../constants';
import { GameResult } from '../../types';
import Button from '../Button';

interface QuickMathGameProps {
  onGameEnd: (result: GameResult) => void;
}

interface MathProblem {
  problem: string;
  actualAnswer: number;
  displayAnswer: number;
}

const QuickMathGame: React.FC<QuickMathGameProps> = ({ onGameEnd }) => {
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0); // Time for current problem
  const [overallTimeElapsed, setOverallTimeElapsed] = useState(0);
  const problemTimerRef = useRef<number | null>(null);
  const overallTimerRef = useRef<number | null>(null);

  const initializeGame = useCallback(() => {
    const generatedProblems: MathProblem[] = [];
    for (let i = 0; i < QUICK_MATH_CONFIG.PROBLEM_COUNT; i++) {
      generatedProblems.push(QUICK_MATH_CONFIG.GENERATE_PROBLEM());
    }
    setProblems(generatedProblems);
    setCurrentProblemIndex(0);
    setScore(0);
    setCorrectCount(0);
    setTimeRemaining(QUICK_MATH_CONFIG.TIME_PER_PROBLEM_MS / 1000);
    setOverallTimeElapsed(0);

    if (problemTimerRef.current) clearInterval(problemTimerRef.current);
    if (overallTimerRef.current) clearInterval(overallTimerRef.current);

    // Start overall game timer
    overallTimerRef.current = window.setInterval(() => {
      setOverallTimeElapsed(prev => prev + 1);
    }, 1000);

    // Start problem timer for the first problem
    problemTimerRef.current = window.setInterval(() => {
      setTimeRemaining(prevTime => {
        if (prevTime <= 1) {
          // Time's up for this problem
          handleAnswer(false); // Count as incorrect
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

  }, [onGameEnd]); // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    initializeGame();
    return () => {
      if (problemTimerRef.current) clearInterval(problemTimerRef.current);
      if (overallTimerRef.current) clearInterval(overallTimerRef.current);
    };
  }, [initializeGame]);

  const handleAnswer = useCallback((isUserCorrect: boolean) => {
    let newScore = score;
    let newCorrectCount = correctCount;

    if (isUserCorrect) {
      newScore += QUICK_MATH_CONFIG.CORRECT_SCORE;
      newCorrectCount++;
    } else {
      newScore += QUICK_MATH_CONFIG.INCORRECT_PENALTY;
    }
    setScore(newScore);
    setCorrectCount(newCorrectCount);

    if (currentProblemIndex < QUICK_MATH_CONFIG.PROBLEM_COUNT - 1) {
      setCurrentProblemIndex(prevIndex => prevIndex + 1);
      // Reset timer for the next problem
      setTimeRemaining(QUICK_MATH_CONFIG.TIME_PER_PROBLEM_MS / 1000);
      if (problemTimerRef.current) clearInterval(problemTimerRef.current);
      problemTimerRef.current = window.setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 1) {
            handleAnswer(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      // Game over
      if (problemTimerRef.current) clearInterval(problemTimerRef.current);
      if (overallTimerRef.current) clearInterval(overallTimerRef.current);
      onGameEnd({
        score: newScore,
        accuracy: (newCorrectCount / QUICK_MATH_CONFIG.PROBLEM_COUNT) * 100,
        time: overallTimeElapsed,
        date: new Date().toISOString(),
      });
    }
  }, [score, correctCount, currentProblemIndex, overallTimeElapsed, onGameEnd]); // eslint-disable-next-line react-hooks/exhaustive-deps


  const currentProblem = problems[currentProblemIndex];
  if (!currentProblem) return null; // Or a loading state

  const completionPercentage = (currentProblemIndex / QUICK_MATH_CONFIG.PROBLEM_COUNT) * 100;

  return (
    <div className="flex flex-col items-center w-full max-w-md">
      <div className="flex justify-between w-full mb-6 text-body font-medium text-textDark dark:text-textLight">
        <span>Score: <span className="font-mono text-score">{score}</span></span>
        <span>Time Left: <span className="font-mono text-score">{timeRemaining}s</span></span>
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

      <div className="p-6 bg-border dark:bg-gray-700 rounded-xl mb-6 w-full text-center">
        <p className="text-body text-textDark dark:text-textLight mb-2">What is:</p>
        <p className="text-h1 font-bold text-primary dark:text-primary-dark mb-4">{currentProblem.problem}</p>
        <p className="text-body text-textDark dark:text-textLight">Is it:</p>
        <p className="text-h1 font-bold text-secondary dark:text-textLight">{currentProblem.displayAnswer}?</p>
      </div>

      <div className="flex gap-4 w-full justify-center">
        <Button onClick={() => handleAnswer(currentProblem.displayAnswer === currentProblem.actualAnswer)} variant="primary" className="flex-1">
          True
        </Button>
        <Button onClick={() => handleAnswer(currentProblem.displayAnswer !== currentProblem.actualAnswer)} variant="secondary" className="flex-1">
          False
        </Button>
      </div>

      <p className="text-label text-textDark dark:text-textLight mt-6">Problem {currentProblemIndex + 1} of {QUICK_MATH_CONFIG.PROBLEM_COUNT}</p>
    </div>
  );
};

export default QuickMathGame;
