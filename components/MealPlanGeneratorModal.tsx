import React, { useState } from 'react';
import { PlanType, MealType } from '../types';
import { XCircleIcon, SparklesIcon, ChevronDownIcon } from './icons';
import { motion } from 'framer-motion';

interface MealPlanGeneratorModalProps {
  onSubmit: (planType: PlanType, mealType?: MealType) => void;
  onClose: () => void;
}

const commonSelectClasses = "w-full px-3 py-2.5 bg-brand-surface dark:bg-dark-brand-surface-alt text-brand-text-primary dark:text-dark-brand-text-primary border border-slate-300 dark:border-slate-600 rounded-lg shadow-sm focus:ring-brand-primary focus:border-brand-primary appearance-none pr-8";


const MealPlanGeneratorModal: React.FC<MealPlanGeneratorModalProps> = ({ onSubmit, onClose }) => {
  const [planType, setPlanType] = useState<PlanType>('daily');
  const [mealType, setMealType] = useState<MealType>('breakfast');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(planType, planType === 'single_meal' ? mealType : undefined);
  };

  const planTypeOptions: { value: PlanType; label: string }[] = [
    { value: 'single_meal', label: 'Single Meal Idea' },
    { value: 'daily', label: 'Full Day Plan (3 meals + snack)' },
    { value: 'weekly', label: 'Full Week Plan (7 days)' },
  ];

  const mealTypeOptions: { value: MealType; label: string }[] = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snack', label: 'Snack' },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        className="bg-brand-background dark:bg-dark-brand-background text-brand-text-primary dark:text-dark-brand-text-primary p-6 md:p-8 rounded-xl shadow-2xl max-w-md w-full relative"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-brand-text-secondary dark:text-dark-brand-text-secondary hover:text-brand-primary dark:hover:text-dark-brand-primary transition-colors"
          aria-label="Close meal plan generator"
        >
          <XCircleIcon className="w-8 h-8" />
        </button>

        <div className="text-center mb-6">
          <SparklesIcon className="w-16 h-16 text-brand-accent dark:text-dark-brand-accent mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-brand-primary dark:text-dark-brand-primary">Generate Meal Ideas</h2>
          <p className="text-sm text-brand-text-secondary dark:text-dark-brand-text-secondary mt-1">
            Let AI craft a personalized plan for you!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="planType" className="block text-sm font-medium text-brand-text-secondary dark:text-dark-brand-text-secondary mb-1">
              What kind of plan do you need?
            </label>
            <div className="relative">
              <select
                id="planType"
                name="planType"
                value={planType}
                onChange={(e) => setPlanType(e.target.value as PlanType)}
                className={commonSelectClasses}
              >
                {planTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
              <ChevronDownIcon className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {planType === 'single_meal' && (
            <div>
              <label htmlFor="mealType" className="block text-sm font-medium text-brand-text-secondary dark:text-dark-brand-text-secondary mb-1">
                Which meal?
              </label>
              <div className="relative">
                <select
                  id="mealType"
                  name="mealType"
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as MealType)}
                  className={commonSelectClasses}
                >
                  {mealTypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <ChevronDownIcon className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
          )}
          
          <div className="mt-8 pt-5 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-lg text-brand-text-secondary dark:text-dark-brand-text-secondary hover:bg-slate-100 dark:hover:bg-dark-brand-surface-alt transition-all-smooth font-medium">
              Cancel
            </button>
            <button type="submit" className="px-6 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-lg shadow-md hover:shadow-lg transition-all-smooth font-semibold flex items-center justify-center">
              <SparklesIcon className="w-5 h-5 mr-2" />
              Generate Plan
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default MealPlanGeneratorModal;
