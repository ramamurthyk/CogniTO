
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Button from '../Button';
import { ASSESSMENT_DATA } from '../../constants';

interface MemoryNumberTestProps {
  onComplete: (score: number) => void;
}

const MemoryNumberTest: React.FC<MemoryNumberTestProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'display' | 'recall' | 'finished'>('display');
  const [numbersToRemember, setNumbersToRemember] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const timeoutRef = useRef<number | null>(null);

  const generateNumbers = useCallback(() => {
    const numbers: string[] = [];
    for (let i = 0; i < ASSESSMENT_DATA.MEMORY_NUMBERS.COUNT; i++) {
      numbers.push(Math.floor(Math.random() * 9).toString()); // Single digits
    }
    setNumbersToRemember(numbers);
  }, []);

  useEffect(() => {
    if (phase === 'display') {
      generateNumbers();
      timeoutRef.current = window.setTimeout(() => {
        setPhase('recall');
      }, ASSESSMENT_DATA.MEMORY_NUMBERS.DISPLAY_TIME_MS);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [phase, generateNumbers]);

  const handleSubmit = useCallback(() => {
    // Calculate score (accuracy based on correct numbers in correct positions)
    const userNumbers = userInput.split('').filter(char => /\d/.test(char)); // Filter out non-digits
    let correctCount = 0;
    for (let i = 0; i < numbersToRemember.length; i++) {
      if (userNumbers[i] === numbersToRemember[i]) {
        correctCount++;
      }
    }
    const score = (correctCount / numbersToRemember.length) * 100;
    setPhase('finished');
    onComplete(score);
  }, [numbersToRemember, userInput, onComplete]);

  if (phase === 'display') {
    return (
      <div className="text-center p-6 bg-border dark:bg-gray-700 rounded-xl max-w-sm w-full">
        <p className="text-body text-textDark dark:text-textLight mb-4">Remember these numbers:</p>
        <div className="text-h1 font-mono font-bold text-primary dark:text-primary-dark tracking-widest text-6xl">
          {numbersToRemember.join('')}
        </div>
      </div>
    );
  }

  if (phase === 'recall') {
    return (
      <div className="flex flex-col items-center max-w-sm w-full">
        <p className="text-body text-textDark dark:text-textLight mb-4 text-center">Enter the numbers you remember, in order:</p>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          maxLength={ASSESSMENT_DATA.MEMORY_NUMBERS.COUNT}
          pattern="[0-9]*" // Restrict to numbers on mobile keyboards
          inputMode="numeric"
          className="px-6 py-3 rounded-xl border border-border bg-bgLight dark:bg-bgDark text-textDark dark:text-textLight w-full h-12 text-h2 font-mono text-center
                     focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark transition-all duration-200 ease-in-out mb-6"
          autoFocus
          aria-label="Enter numbers you remember"
        />
        <Button onClick={handleSubmit} variant="primary" className="w-full">
          Submit
        </Button>
      </div>
    );
  }

  return (
    <p className="text-body text-textDark dark:text-textLight">Calculating score...</p>
  );
};

export default MemoryNumberTest;
