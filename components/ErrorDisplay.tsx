import React from 'react';
import { AlertTriangleIcon, RefreshCwIcon } from './icons';

interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-500 dark:border-red-600 text-red-700 dark:text-red-200 p-6 rounded-xl shadow-lg max-w-md mx-auto my-10" role="alert">
      <div className="flex items-center mb-4">
        <AlertTriangleIcon className="w-10 h-10 mr-4 text-red-500 dark:text-red-400 flex-shrink-0" />
        <div>
          <p className="font-bold text-xl">Oops! Something Went Wrong</p>
          <p className="text-sm mt-1">{message}</p>
        </div>
      </div>
      {onRetry && (
        <div className="mt-6 text-right">
          <button
            onClick={onRetry}
            className="flex items-center justify-center px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all-smooth text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <RefreshCwIcon className="w-4 h-4 mr-2"/>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorDisplay;
