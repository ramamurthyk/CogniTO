
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Button from '../Button';
import { ASSESSMENT_DATA } from '../../constants';

interface ReactionTimeTestProps {
  onComplete: (score: number) => void; // Score is ms (lower is better)
}

const ReactionTimeTest: React.FC<ReactionTimeTestProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'intro' | 'waiting' | 'ready' | 'reaction' | 'finished'>('intro');
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [currentTrial, setCurrentTrial] = useState(0);
  const startTimeRef = useRef<number>(0);
  const timeoutRef = useRef<number | null>(null);

  const startWaitingPhase = useCallback(() => {
    setPhase('waiting');
    const delay = Math.random() * (ASSESSMENT_DATA.SPEED.MAX_DELAY_MS - ASSESSMENT_DATA.SPEED.MIN_DELAY_MS) + ASSESSMENT_DATA.SPEED.MIN_DELAY_MS;
    timeoutRef.current = window.setTimeout(() => {
      setPhase('ready');
      startTimeRef.current = performance.now();
    }, delay);
  }, []);

  useEffect(() => {
    if (phase === 'waiting') {
      startWaitingPhase();
    } else if (phase === 'reaction' && currentTrial < ASSESSMENT_DATA.SPEED.TRIALS) {
      startWaitingPhase();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [phase, currentTrial, startWaitingPhase]);

  const handleClick = useCallback(() => {
    if (phase === 'ready') {
      const reactionTime = performance.now() - startTimeRef.current;
      setReactionTimes(prevTimes => [...prevTimes, reactionTime]);
      setCurrentTrial(prevTrial => prevTrial + 1);
      if (currentTrial + 1 >= ASSESSMENT_DATA.SPEED.TRIALS) {
        // All trials completed
        const averageReactionTime = reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length;
        // Convert to a 0-100 score: lower reaction time is better, so 0ms reaction time is 100 score, max around 1000ms is 0 score
        // A simple linear conversion: score = 100 * (1 - (avgRT / MAX_POSSIBLE_RT))
        // Let's assume Max_RT for score scaling is 500ms for a fair range
        const MAX_REACTION_TIME_FOR_SCORE = 500;
        const score = Math.max(0, 100 * (1 - (averageReactionTime / MAX_REACTION_TIME_FOR_SCORE)));
        setPhase('finished');
        onComplete(score);
      } else {
        setPhase('reaction'); // Move to next trial
      }
    } else if (phase === 'waiting') {
      // Clicked too early
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setReactionTimes(prevTimes => [...prevTimes, 1000]); // Penalize early click
      setCurrentTrial(prevTrial => prevTrial + 1);
      if (currentTrial + 1 >= ASSESSMENT_DATA.SPEED.TRIALS) {
         const averageReactionTime = reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length;
         const MAX_REACTION_TIME_FOR_SCORE = 500;
         const score = Math.max(0, 100 * (1 - (averageReactionTime / MAX_REACTION_TIME_FOR_SCORE)));
         setPhase('finished');
         onComplete(score);
      } else {
        setPhase('reaction');
      }
    }
  }, [phase, reactionTimes, currentTrial, onComplete]);

  if (phase === 'intro') {
    return (
      <div className="text-center p-6 bg-white dark:bg-secondary rounded-xl max-w-sm w-full">
        <p className="text-body text-textDark dark:text-textLight mb-4">
          Click the screen as fast as you can when the square turns red.
        </p>
        <p className="text-label text-textDark dark:text-textLight mb-6">
          There will be {ASSESSMENT_DATA.SPEED.TRIALS} trials.
        </p>
        <Button onClick={() => setPhase('waiting')} variant="primary" className="w-full">
          Start
        </Button>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`relative w-64 h-64 rounded-xl flex items-center justify-center cursor-pointer transition-colors duration-200 ease-in-out select-none
                  ${phase === 'ready' ? 'bg-accent' : 'bg-primary dark:bg-primary-dark'}
                  ${phase === 'waiting' || phase === 'reaction' ? 'hover:bg-primary/90 dark:hover:bg-primary-dark/90' : ''}`}
      aria-label="Reaction test area"
    >
      {phase === 'waiting' && <span className="text-body text-textLight">Wait for red...</span>}
      {phase === 'ready' && <span className="text-h2 font-bold text-textLight animate-pulse">CLICK!</span>}
      {(phase === 'reaction' || phase === 'finished') && (
        <span className="text-h2 font-bold text-textLight">
          {currentTrial < ASSESSMENT_DATA.SPEED.TRIALS ? `Trial ${currentTrial + 1}` : 'Done!'}
        </span>
      )}
      {phase === 'waiting' && currentTrial > 0 && (
        <span className="absolute bottom-4 text-label text-textLight opacity-80">
          Trial {currentTrial} of {ASSESSMENT_DATA.SPEED.TRIALS}
        </span>
      )}
    </button>
  );
};

export default ReactionTimeTest;
