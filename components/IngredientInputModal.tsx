import React, { useState } from 'react';
import { XCircleIcon, LightbulbIcon } from './icons';
import { motion } from 'framer-motion';

interface IngredientInputModalProps {
  onSubmit: (ingredients: string) => void;
  onClose: () => void;
}

const commonTextareaClasses = "w-full px-3 py-2.5 bg-brand-surface dark:bg-dark-brand-surface-alt text-brand-text-primary dark:text-dark-brand-text-primary border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/50 placeholder-slate-400 dark:placeholder-slate-500";

const IngredientInputModal: React.FC<IngredientInputModalProps> = ({ onSubmit, onClose }) => {
  const [ingredients, setIngredients] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredients.trim() === '') {
      setError('Please enter at least one ingredient.');
      return;
    }
    setError(null);
    onSubmit(ingredients.trim());
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ingredient-modal-title"
    >
      <motion.div
        className="bg-brand-background dark:bg-dark-brand-background text-brand-text-primary dark:text-dark-brand-text-primary p-6 md:p-8 rounded-xl shadow-2xl max-w-lg w-full relative"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-brand-text-secondary dark:text-dark-brand-text-secondary hover:text-brand-primary dark:hover:text-dark-brand-primary transition-colors"
          aria-label="Close ingredient input"
        >
          <XCircleIcon className="w-8 h-8" />
        </button>

        <div className="text-center mb-6">
          <LightbulbIcon className="w-16 h-16 text-brand-accent dark:text-dark-brand-accent mx-auto mb-3" />
          <h2 id="ingredient-modal-title" className="text-2xl font-bold text-brand-primary dark:text-dark-brand-primary">What's In Your Kitchen?</h2>
          <p className="text-sm text-brand-text-secondary dark:text-dark-brand-text-secondary mt-1">
            Enter ingredients you have, and we'll suggest some meal ideas!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="ingredients" className="block text-sm font-medium text-brand-text-secondary dark:text-dark-brand-text-secondary mb-1">
              List your ingredients (comma or new line separated):
            </label>
            <textarea
              id="ingredients"
              name="ingredients"
              value={ingredients}
              onChange={(e) => {
                setIngredients(e.target.value);
                if (error) setError(null);
              }}
              rows={5}
              className={commonTextareaClasses}
              placeholder="e.g., Chicken breast, broccoli, soy sauce, garlic&#10;Eggs, spinach, cheese&#10;Tomatoes, pasta, onion"
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>
          
          <div className="mt-8 pt-5 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg text-brand-text-secondary dark:text-dark-brand-text-secondary hover:bg-slate-100 dark:hover:bg-dark-brand-surface-alt transition-all-smooth font-medium">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-lg shadow-md hover:shadow-lg transition-all-smooth font-semibold flex items-center justify-center">
              <LightbulbIcon className="w-5 h-5 mr-2" />
              Get Meal Ideas
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default IngredientInputModal;
