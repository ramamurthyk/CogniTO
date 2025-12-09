
import React, { useState, useCallback, useMemo } from 'react';
import Button from '../Button';
import { ASSESSMENT_DATA } from '../../constants';

interface MathTestProps {
  onComplete: (score: number) => void;
}

const MathTest: React.FC<MathTestProps> = ({ onComplete }) => {
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectChoice, setIsCorrectChoice] = useState(false);

  const problems = useMemo(() => {
    // Shuffle problems for variety
    return [...ASSESSMENT_DATA.WORKING_MEMORY_MATH].sort(() => 0.5 - Math.random());
  }, []);

  const currentProblem = problems[currentProblemIndex];

  const handleAnswer = useCallback((userAnswer: boolean) => {
    const isAnswerCorrect = userAnswer === currentProblem.answer;
    setIsCorrectChoice(isAnswerCorrect);
    setShowFeedback(true);

    if (isAnswerCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }

    // Move to next problem after a short delay for feedback
    setTimeout(() => {
      setShowFeedback(false);
      if (currentProblemIndex < problems.length - 1) {
        setCurrentProblemIndex(prev => prev + 1);
      } else {
        // All problems completed
        const score = (correctAnswers / problems.length) * 100;
        onComplete(score);
      }
    }, 1500); // Show feedback for 1.5 seconds
  }, [currentProblem.answer, currentProblemIndex, problems.length, correctAnswers, onComplete]); // eslint-disable-next-line react-hooks/exhaustive-deps


  if (!currentProblem) {
    return (
      <p className="text-body text-textDark dark:text-textLight">Calculating score...</p>
    );
  }

  return (
    <div className="flex flex-col items-center max-w-sm w-full">
      <p className="text-body text-textDark dark:text-textLight mb-4 text-center">Is this equation correct?</p>
      <div className="p-6 bg-border dark:bg-gray-700 rounded-xl mb-6 w-full">
        <p className="text-h2 font-bold text-primary dark:text-primary-dark text-center">{currentProblem.problem}</p>
      </div>

      {showFeedback ? (
        <p className={`text-body font-bold mb-4 ${isCorrectChoice ? 'text-green-600' : 'text-red-600'}`}>
          {isCorrectChoice ? 'Correct!' : 'Incorrect.'}
        </p>
      ) : (
        <div className="flex gap-4 w-full">
          <Button onClick={() => handleAnswer(true)} variant="primary" className="flex-1" disabled={showFeedback}>
            True
          </Button>
          <Button onClick={() => handleAnswer(false)} variant="secondary" className="flex-1" disabled={showFeedback}>
            False
          </Button>
        </div>
      )}
    </div>
  );
};

export default MathTest;
