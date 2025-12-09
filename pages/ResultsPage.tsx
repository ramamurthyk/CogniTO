
import React, { useEffect, useState } from 'react';
import CircularProgress from '../components/CircularProgress';
import Button from '../components/Button';
import { AssessmentScores } from '../types';

interface ResultsPageProps {
  scores: AssessmentScores;
  onPlayGames: () => void;
  onViewDashboard: () => void;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ scores, onPlayGames, onViewDashboard }) => {
  const [strongestArea, setStrongestArea] = useState<string>('');
  const [weakestArea, setWeakestArea] = useState<string>('');
  const [isLoadingMessage, setIsLoadingMessage] = useState(true);

  useEffect(() => {
    if (scores.profileMessage) {
      setIsLoadingMessage(false);
    } else {
      // If message is still null, it might be loading or failed
      const checkMessage = setTimeout(() => {
        if (!scores.profileMessage) {
          setIsLoadingMessage(false); // Stop loading if no message after a delay
        }
      }, 5000); // Arbitrary delay
      return () => clearTimeout(checkMessage);
    }
  }, [scores.profileMessage]);

  useEffect(() => {
    const areaScores = [
      { name: 'Memory (Numbers)', score: scores.memoryNumbers },
      { name: 'Memory (Words)', score: scores.memoryWords },
      { name: 'Speed', score: scores.speed },
      { name: 'Logic', score: scores.logic },
      { name: 'Working Memory', score: scores.workingMemory },
    ];

    areaScores.sort((a, b) => b.score - a.score); // Sort descending

    setStrongestArea(areaScores[0].name);
    setWeakestArea(areaScores[areaScores.length - 1].name);
  }, [scores]);

  return (
    <section className="bg-white dark:bg-secondary rounded-xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto text-center">
      <h1 className="text-h1 text-secondary dark:text-textLight mb-8">Your Cognitive Profile</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-y-8 gap-x-4 md:gap-x-6 justify-items-center mb-12">
        <CircularProgress score={scores.memoryNumbers} label="Memory (Num.)" />
        <CircularProgress score={scores.memoryWords} label="Memory (Words)" />
        <CircularProgress score={scores.speed} label="Speed" />
        <CircularProgress score={scores.logic} label="Logic" />
        <CircularProgress score={scores.workingMemory} label="Working Memory" />
      </div>

      <div className="mb-12">
        <h2 className="text-h2 text-secondary dark:text-textLight mb-4">Highlights</h2>
        <div className="text-body text-textDark dark:text-textLight space-y-2">
          <p>Your strongest cognitive area is: <span className="font-bold text-primary dark:text-primary-dark">{strongestArea}</span></p>
          <p>An area for growth is: <span className="font-bold text-accent">{weakestArea}</span></p>
        </div>
      </div>

      <div className="bg-bgLight dark:bg-gray-700 rounded-xl p-6 mb-12 text-left">
        <h2 className="text-h2 text-secondary dark:text-textLight mb-4 text-center">Personalized Insight</h2>
        {isLoadingMessage ? (
          <div className="flex justify-center items-center h-24">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary dark:border-primary-dark border-t-transparent"></div>
          </div>
        ) : (
          <p className="text-body text-textDark dark:text-textLight leading-relaxed">
            {scores.profileMessage || `Based on your assessment, you're on a great path to cognitive fitness! Continue to challenge yourself with varied exercises to maintain and improve your brain health.`}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onPlayGames} variant="primary" size="medium" className="w-full sm:w-auto">
          Play Games
        </Button>
        <Button onClick={onViewDashboard} variant="outline" size="medium" className="w-full sm:w-auto">
          View Dashboard
        </Button>
      </div>
    </section>
  );
};

export default ResultsPage;
