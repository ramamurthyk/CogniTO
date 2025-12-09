
import React, { useState, useCallback } from 'react';
import MemoryNumberTest from '../components/tests/MemoryNumberTest';
import WordRecallTest from '../components/tests/WordRecallTest';
import ReactionTimeTest from '../components/tests/ReactionTimeTest';
import PatternTest from '../components/tests/PatternTest';
import MathTest from '../components/tests/MathTest';
import Button from '../components/Button';
import { AssessmentScores } from '../types';

interface AssessmentFlowProps {
  onAssessmentComplete: (scores: AssessmentScores) => void;
  onBack: () => void; // New prop for back navigation
}

const AssessmentFlow: React.FC<AssessmentFlowProps> = ({ onAssessmentComplete, onBack }) => {
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [testScores, setTestScores] = useState<Partial<AssessmentScores>>({});
  const [isFinishing, setIsFinishing] = useState(false);

  const testComponents = [
    {
      title: 'Memory Test: Number Recall',
      component: MemoryNumberTest,
      scoreKey: 'memoryNumbers',
    },
    {
      title: 'Memory Test: Word Recall',
      component: WordRecallTest,
      scoreKey: 'memoryWords',
    },
    {
      title: 'Speed Test: Reaction Time',
      component: ReactionTimeTest,
      scoreKey: 'speed',
    },
    {
      title: 'Logic Test: Find the Pattern',
      component: PatternTest,
      scoreKey: 'logic',
    },
    {
      title: 'Working Memory Test: Quick Math',
      component: MathTest,
      scoreKey: 'workingMemory',
    },
  ];

  const handleTestComplete = useCallback((score: number) => {
    setTestScores(prevScores => ({
      ...prevScores,
      [testComponents[currentTestIndex].scoreKey]: score,
    }));

    if (currentTestIndex < testComponents.length - 1) {
      setCurrentTestIndex(prevIndex => prevIndex + 1);
    } else {
      setIsFinishing(true);
      // All tests completed, now send results
      const finalScores: AssessmentScores = {
        memoryNumbers: testScores.memoryNumbers || 0,
        memoryWords: testScores.memoryWords || 0,
        speed: testScores.speed || 0,
        logic: testScores.logic || 0,
        workingMemory: testScores.workingMemory || 0,
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
      onAssessmentComplete(finalScores);
    }
  }, [currentTestIndex, testComponents, testScores, onAssessmentComplete]); // eslint-disable-next-line react-hooks/exhaustive-deps

  const CurrentTestComponent = testComponents[currentTestIndex].component;
  const currentTestTitle = testComponents[currentTestIndex].title;

  if (isFinishing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
        <h2 className="text-h1 text-secondary dark:text-textLight mb-6">Completing Assessment...</h2>
        <p className="text-body text-textDark dark:text-textLight">Calculating your personalized cognitive profile.</p>
        <div className="mt-8">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary dark:border-primary-dark border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-white dark:bg-secondary rounded-xl shadow-lg p-6 md:p-8 max-w-2xl mx-auto flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6">
        <Button onClick={onBack} variant="outline" size="small" className="w-auto">
          &larr; Back
        </Button>
        <span className="text-label font-medium text-textDark dark:text-textLight">Test {currentTestIndex + 1} of {testComponents.length}</span>
      </div>
      <h2 className="text-h2 text-secondary dark:text-textLight mb-6 text-center">{currentTestTitle}</h2>
      <div className="w-full bg-border rounded-full h-2 mb-8">
          <div
            className="bg-primary dark:bg-primary-dark h-2 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${((currentTestIndex + 1) / testComponents.length) * 100}%` }}
          ></div>
        </div>
      <div className="w-full flex-grow flex items-center justify-center">
        <CurrentTestComponent onComplete={handleTestComplete} />
      </div>
    </section>
  );
};

export default AssessmentFlow;