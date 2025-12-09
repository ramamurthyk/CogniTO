
import React, { useState } from 'react';
import Button from '../components/Button';

interface LandingPageProps {
  onStartAssessment: (name: string) => void;
  showBackButton: boolean;
  onBack: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStartAssessment, showBackButton, onBack }) => {
  const [userName, setUserName] = useState<string>('');
  const [showInput, setShowInput] = useState<boolean>(false);

  const handleCTAClick = () => {
    setShowInput(true);
  };

  const handleSubmitName = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      onStartAssessment(userName.trim());
    }
  };

  return (
    <section className="min-h-[calc(100vh-160px)] flex flex-col items-center justify-center p-4">
      {/* Back button, only visible if we have a history to go back to and on the name input phase */}
      {(showInput && showBackButton) && (
        <div className="w-full max-w-4xl flex justify-start mb-4">
          <Button onClick={() => setShowInput(false)} variant="outline" size="small" className="w-auto">
            &larr; Back
          </Button>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative z-0 flex flex-col items-center justify-center text-center pb-12 pt-8 md:py-20 rounded-xl overflow-hidden mb-12 w-full max-w-4xl
                      bg-gradient-to-br from-primary/10 to-transparent dark:from-primary-dark/10 dark:to-transparent">
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-h1 text-secondary dark:text-textLight mb-4 md:mb-6 font-bold">
            Train Your Brain. Stay Sharp.
          </h1>
          <p className="text-body text-textDark dark:text-textLight max-w-2xl mx-auto mb-8">
            Personalized cognitive exercises in 3 minutes a day. Enhance your memory, speed, and focus.
          </p>
          {!showInput ? (
            <Button onClick={handleCTAClick} variant="primary" size="large" className="w-full sm:w-auto min-w-[200px]">
              Start Free Assessment
            </Button>
          ) : (
            <form onSubmit={handleSubmitName} className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in max-w-full">
              <label htmlFor="userName" className="sr-only">Enter your name</label>
              <input
                id="userName"
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="px-6 py-3 rounded-xl border border-border bg-bgLight dark:bg-bgDark text-textDark dark:text-textLight w-full sm:w-64 h-12 text-body
                           focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark transition-all duration-200 ease-in-out"
                aria-required="true"
                maxLength={50}
              />
              <Button type="submit" variant="primary" size="medium" className="w-full sm:w-auto min-w-[120px]">
                Begin
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="grid md:grid-cols-3 gap-8 md:gap-12 mt-8 md:mt-16 w-full max-w-4xl">
        <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-secondary rounded-xl shadow-lg transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-xl">
          <span className="text-5xl text-primary dark:text-primary-dark mb-4" role="img" aria-label="Brain icon">🧠</span>
          <h3 className="text-h2 font-bold text-secondary dark:text-textLight mb-2">Personalized Training</h3>
          <p className="text-body text-textDark dark:text-textLight">Exercises tailored to your unique cognitive profile.</p>
        </div>
        <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-secondary rounded-xl shadow-lg transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-xl">
          <span className="text-5xl text-primary dark:text-primary-dark mb-4" role="img" aria-label="Clock icon">⏱️</span>
          <h3 className="text-h2 font-bold text-secondary dark:text-textLight mb-2">Quick & Effective</h3>
          <p className="text-body text-textDark dark:text-textLight">Short, engaging sessions designed for busy schedules.</p>
        </div>
        <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-secondary rounded-xl shadow-lg transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-xl">
          <span className="text-5xl text-primary dark:text-primary-dark mb-4" role="img" aria-label="Graph icon">📈</span>
          <h3 className="text-h2 font-bold text-secondary dark:text-textLight mb-2">Track Your Progress</h3>
          <p className="text-body text-textDark dark:text-textLight">Monitor improvements and celebrate your cognitive gains.</p>
        </div>
      </div>
    </section>
  );
};

export default LandingPage;