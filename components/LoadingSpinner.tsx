import React from 'react';

const LoadingSpinner: React.FC<{ message?: string }> = ({ message = "Whipping up your results..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-8 min-h-[calc(100vh-200px)]">
      <div className="relative flex justify-center items-center">
        <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-brand-primary dark:border-dark-brand-primary"></div>
        <div className="absolute animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-brand-accent dark:border-dark-brand-accent" style={{animationDelay: '0.1s', animationDirection: 'reverse'}}></div>
      </div>
      <p className="text-xl font-semibold text-brand-text-primary dark:text-dark-brand-text-primary">{message}</p>
      <p className="text-sm text-brand-text-secondary dark:text-dark-brand-text-secondary">Please wait a moment.</p>
    </div>
  );
};

export default LoadingSpinner;
