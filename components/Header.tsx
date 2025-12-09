
import React from 'react';
import Button from './Button'; // Assuming Button component can be used for navigation

interface HeaderProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  userName: string | null;
  assessmentCompleted: boolean;
  onNavigateToDashboard: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, onToggleDarkMode, userName, assessmentCompleted, onNavigateToDashboard }) => {
  const showDashboardLink = userName && assessmentCompleted;

  return (
    <header className="bg-secondary text-textLight p-4 shadow-md z-10">
      <div className="container mx-auto flex justify-between items-center max-w-screen-xl">
        <div className="flex items-center gap-4">
          <h1 className="text-h2 font-bold tracking-wide text-primary-dark sm:text-h1">CogniTO</h1>
          {showDashboardLink && (
            <Button
              variant="outline"
              size="small"
              onClick={onNavigateToDashboard}
              className="hidden sm:inline-flex text-textLight border-textLight hover:bg-primary-dark/20 dark:text-textLight dark:border-primary-dark hover:dark:bg-primary-dark/20"
              aria-label="Go to Dashboard"
            >
              Dashboard
            </Button>
          )}
        </div>
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-full bg-primary-dark hover:bg-primary-dark/90 focus:ring-primary-dark/50"
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <svg
            className="w-6 h-6 text-textLight"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isDarkMode ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h1M2 12h1m15.325 5.825l.707.707m-12.728-12.728l.707.707M18.707 6.293l.707-.707m-12.728 12.728l.707-.707M12 18a6 6 0 100-12 6 6 0 000 12z"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            )}
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;