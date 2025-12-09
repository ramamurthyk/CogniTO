
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Button from '../Button';
import { ASSESSMENT_DATA } from '../../constants';

interface WordRecallTestProps {
  onComplete: (score: number) => void;
}

const WordRecallTest: React.FC<WordRecallTestProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'display' | 'recall' | 'finished'>('display');
  const [wordsToRemember, setWordsToRemember] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string>('');
  const timeoutRef = useRef<number | null>(null);

  const generateWords = useCallback(() => {
    // Shuffle and pick 10 unique words
    const shuffled = [...ASSESSMENT_DATA.MEMORY_WORDS.WORDS].sort(() => 0.5 - Math.random());
    setWordsToRemember(shuffled.slice(0, 10));
  }, []);

  useEffect(() => {
    if (phase === 'display') {
      generateWords();
      timeoutRef.current = window.setTimeout(() => {
        setPhase('recall');
      }, ASSESSMENT_DATA.MEMORY_WORDS.DISPLAY_TIME_MS);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [phase, generateWords]);

  const handleSubmit = useCallback(() => {
    const recalledWords = userInput.toLowerCase().split(/[,\s]+/).filter(word => word.length > 0);
    let correctCount = 0;
    const rememberedSet = new Set(wordsToRemember.map(word => word.toLowerCase()));

    for (const word of recalledWords) {
      if (rememberedSet.has(word)) {
        correctCount++;
        rememberedSet.delete(word); // Prevent double counting
      }
    }

    const score = (correctCount / wordsToRemember.length) * 100;
    setPhase('finished');
    onComplete(score);
  }, [wordsToRemember, userInput, onComplete]);

  if (phase === 'display') {
    return (
      <div className="text-center p-6 bg-border dark:bg-gray-700 rounded-xl max-w-sm w-full">
        <p className="text-body text-textDark dark:text-textLight mb-4">Remember these words:</p>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-h2 font-bold text-primary dark:text-primary-dark mb-4 list-none p-0">
          {wordsToRemember.map((word, index) => (
            <li key={index} className="text-center">{word}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (phase === 'recall') {
    return (
      <div className="flex flex-col items-center max-w-sm w-full">
        <p className="text-body text-textDark dark:text-textLight mb-4 text-center">List the words you remember, separated by commas or spaces:</p>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          rows={5}
          className="px-6 py-3 rounded-xl border border-border bg-bgLight dark:bg-bgDark text-textDark dark:text-textLight w-full text-body
                     focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark transition-all duration-200 ease-in-out mb-6 resize-none"
          placeholder="Type words here..."
          autoFocus
          aria-label="Enter words you remember"
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

export default WordRecallTest;
