
import React, { useState, useCallback, useMemo } from 'react';
import Button from '../Button';
import { ASSESSMENT_DATA } from '../../constants';

interface PatternTestProps {
  onComplete: (score: number) => void;
}

const PatternTest: React.FC<PatternTestProps> = ({ onComplete }) => {
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrectChoice, setIsCorrectChoice] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const patterns = useMemo(() => {
    // Shuffle patterns for variety
    return [...ASSESSMENT_DATA.LOGIC_PATTERNS].sort(() => 0.5 - Math.random());
  }, []);

  const currentPattern = patterns[currentPatternIndex];

  const handleAnswer = useCallback((userAnswer: string) => {
    setSelectedChoice(userAnswer);
    const isAnswerCorrect = userAnswer === currentPattern.next;
    setIsCorrectChoice(isAnswerCorrect);
    setShowFeedback(true);

    if (isAnswerCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }

    // Move to next pattern after a short delay for feedback
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedChoice(null);
      if (currentPatternIndex < patterns.length - 1) {
        setCurrentPatternIndex(prev => prev + 1);
      } else {
        // All patterns completed
        const score = (correctAnswers / patterns.length) * 100;
        onComplete(score);
      }
    }, 1500); // Show feedback for 1.5 seconds
  }, [currentPattern, currentPatternIndex, patterns.length, correctAnswers, onComplete]);

  if (!currentPattern) {
    return (
      <p className="text-body text-textDark dark:text-textLight">Calculating score...</p>
    );
  }

  return (
    <div className="flex flex-col items-center max-w-md w-full">
      <p className="text-body text-textDark dark:text-textLight mb-4 text-center">What comes next in the sequence?</p>
      <div className="flex flex-wrap justify-center items-center gap-4 p-6 bg-border dark:bg-gray-700 rounded-xl mb-6">
        {currentPattern.sequence.map((item, index) => (
          <span key={index} className="text-h2 font-bold text-primary dark:text-primary-dark">{item}</span>
        ))}
        <span className="text-h2 font-bold text-textDark dark:text-textLight">?</span>
      </div>

      {showFeedback ? (
        <p className={`text-body font-bold mb-4 ${isCorrectChoice ? 'text-green-600' : 'text-red-600'}`}>
          {isCorrectChoice ? 'Correct!' : 'Incorrect.'}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 w-full">
          {currentPattern.choices.map((choice, index) => (
            <Button
              key={index}
              onClick={() => handleAnswer(choice)}
              variant={selectedChoice === choice ? (isCorrectChoice ? 'primary' : 'secondary') : 'outline'}
              className={`flex-1 ${selectedChoice === choice ? 'ring-2' : ''}`}
              disabled={showFeedback}
            >
              {choice}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatternTest;