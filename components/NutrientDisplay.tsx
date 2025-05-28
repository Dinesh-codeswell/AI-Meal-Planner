import React from 'react';
import { NutrientData, NutrientValue } from '../types';
import { ZapIcon, ProteinIcon, LeafIcon, DropletIcon, AlertTriangleIcon, CheckCircleIcon, AtomIcon } from './icons';
import { FALLBACK_IMAGE_URL } from '../constants';
import { motion } from 'framer-motion';

interface NutrientDisplayProps {
  data: NutrientData;
  imageSrc: string | null;
}

const MacroNutrientCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value?: number;
  unit?: string;
  colorClass: string; // e.g., bg-orange-500
  textColorClass: string; // e.g., text-orange-700
  totalValue?: number; // For progress bar calculation
}> = ({ icon, label, value = 0, unit = 'g', colorClass, textColorClass, totalValue }) => {
  const percentage = totalValue && totalValue > 0 && value > 0 ? (value / totalValue) * 100 : 0;

  return (
    <motion.div 
      className="bg-brand-surface dark:bg-dark-brand-surface p-4 rounded-xl shadow-lg transition-all-smooth hover:shadow-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-2">
        <div className={`p-2.5 rounded-full ${colorClass} mr-3`}>
          {icon}
        </div>
        <div>
          <p className={`text-lg font-semibold ${textColorClass} dark:text-white`}>{label}</p>
          <p className="text-2xl font-bold text-brand-text-primary dark:text-dark-brand-text-primary">
            {value.toFixed(1)} <span className="text-sm font-medium">{unit}</span>
          </p>
        </div>
      </div>
      {totalValue !== undefined && ( // Only show progress if totalValue is provided
        <div className="mt-2">
          <div className="h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full w-full">
            <motion.div 
              className={`h-2.5 rounded-full ${colorClass}`}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(percentage, 100)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};


const NutrientDisplay: React.FC<NutrientDisplayProps> = ({ data, imageSrc }) => {
  const { mealName, description, calories, macronutrients, micronutrients, confidenceScore, warnings } = data;

  // Calculate total grams for macronutrient progress bars (simple sum, could be more nuanced)
  const totalMacros = (macronutrients?.protein?.value || 0) + 
                      (macronutrients?.carbohydrates?.value || 0) + 
                      (macronutrients?.fats?.value || 0);


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease:"easeOut" } }
  };

  return (
    <motion.div 
      className="max-w-2xl mx-auto p-2 md:p-0 space-y-6 md:space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="bg-brand-surface dark:bg-dark-brand-surface rounded-2xl shadow-xl overflow-hidden transform hover:scale-[1.01] transition-all-smooth">
        <img 
          src={imageSrc || FALLBACK_IMAGE_URL} 
          alt={mealName || 'Captured meal'} 
          className="w-full h-72 object-cover"
          onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE_URL)}
        />
        <div className="p-6">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-primary dark:text-dark-brand-primary mb-2">{mealName || "Analyzed Meal"}</h2>
          <p className="text-brand-text-secondary dark:text-dark-brand-text-secondary mb-4 text-base">{description || "No description available."}</p>
          
          {confidenceScore !== undefined && (
            <motion.div 
              initial={{opacity:0, x: -20}} animate={{opacity:1, x:0}} transition={{delay:0.2}}
              className={`mb-4 flex items-center text-sm font-medium p-2.5 rounded-md
                ${confidenceScore > 0.7 ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 
                  confidenceScore > 0.4 ? 'bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-300' : 
                  'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'}`}
            >
              {confidenceScore > 0.7 ? <CheckCircleIcon className="w-5 h-5 mr-2" /> : <AlertTriangleIcon className="w-5 h-5 mr-2" />}
              <span>Analysis Confidence: <span className="font-bold">{(confidenceScore * 100).toFixed(0)}%</span></span>
            </motion.div>
          )}

          {warnings && warnings.length > 0 && (
            <motion.div 
              initial={{opacity:0, x: -20}} animate={{opacity:1, x:0}} transition={{delay:0.3}}
              className="mb-4 p-3.5 bg-amber-100 dark:bg-amber-800 border-l-4 border-amber-500 dark:border-amber-400 rounded-md"
            >
              <h4 className="font-semibold text-amber-800 dark:text-amber-100 mb-1.5 flex items-center">
                <AlertTriangleIcon className="w-5 h-5 mr-2 text-amber-600 dark:text-amber-300"/>
                Important Notes
              </h4>
              <ul className="list-disc list-inside text-sm text-amber-700 dark:text-amber-200 pl-2 space-y-1">
                {warnings.map((warning, index) => <li key={index}>{warning}</li>)}
              </ul>
            </motion.div>
          )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-brand-surface dark:bg-dark-brand-surface rounded-2xl shadow-xl p-6 transform hover:scale-[1.01] transition-all-smooth">
        <h3 className="text-2xl md:text-3xl font-bold text-brand-text-primary dark:text-dark-brand-text-primary mb-5">Nutritional Overview</h3>
        
        {calories && (
          <motion.div 
            className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-800 rounded-lg shadow-inner flex items-center justify-between"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <div className="flex items-center">
              <div className="p-2.5 bg-yellow-400 dark:bg-yellow-500 rounded-full mr-3">
                <ZapIcon className="w-7 h-7 text-white"/>
              </div>
              <div>
                <p className="text-lg font-semibold text-yellow-700 dark:text-yellow-200">Total Calories</p>
              </div>
            </div>
            <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-300">
                {calories.value.toFixed(0)} <span className="text-base font-medium">{calories.unit}</span>
            </p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {macronutrients?.protein && (
            <MacroNutrientCard 
              icon={<ProteinIcon className="w-6 h-6 text-white"/>} 
              label="Protein" 
              value={macronutrients.protein.value} 
              unit={macronutrients.protein.unit}
              colorClass="bg-red-500 dark:bg-red-600"
              textColorClass="text-red-600 dark:text-red-300"
              totalValue={totalMacros}
            />
          )}
          {macronutrients?.carbohydrates && (
            <MacroNutrientCard 
              icon={<LeafIcon className="w-6 h-6 text-white"/>} 
              label="Carbs" 
              value={macronutrients.carbohydrates.value} 
              unit={macronutrients.carbohydrates.unit}
              colorClass="bg-green-500 dark:bg-green-600"
              textColorClass="text-green-600 dark:text-green-300"
              totalValue={totalMacros}
            />
          )}
          {macronutrients?.fats && (
            <MacroNutrientCard 
              icon={<DropletIcon className="w-6 h-6 text-white"/>} 
              label="Fats" 
              value={macronutrients.fats.value} 
              unit={macronutrients.fats.unit}
              colorClass="bg-sky-500 dark:bg-sky-600"
              textColorClass="text-sky-600 dark:text-sky-300"
              totalValue={totalMacros}
            />
          )}
        </div>
      </motion.div>

      {micronutrients && micronutrients.length > 0 && (
        <motion.div variants={itemVariants} className="bg-brand-surface dark:bg-dark-brand-surface rounded-2xl shadow-xl p-6 transform hover:scale-[1.01] transition-all-smooth">
          <h3 className="text-2xl md:text-3xl font-bold text-brand-text-primary dark:text-dark-brand-text-primary mb-5 flex items-center">
            <AtomIcon className="w-8 h-8 mr-2 text-brand-primary dark:text-dark-brand-primary"/>
            Micronutrients
          </h3>
          <div className="max-h-72 overflow-y-auto pr-2 space-y-2.5 custom-scrollbar">
            {micronutrients.map((micro, index) => (
              <motion.li 
                key={index} 
                className="flex justify-between items-center p-3.5 bg-amber-50 dark:bg-amber-800/50 rounded-lg text-sm transition-all-smooth hover:bg-amber-100 dark:hover:bg-amber-700/70"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <span className="font-semibold text-brand-text-secondary dark:text-dark-brand-text-secondary">{micro.name}</span>
                <span className="text-brand-text-primary dark:text-dark-brand-text-primary font-medium">
                  {typeof micro.amount === 'number' ? micro.amount.toFixed(1) : micro.amount} {micro.unit !== "N/A" ? micro.unit : ""}
                </span>
              </motion.li>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default NutrientDisplay;
