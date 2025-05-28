import React, { useRef } from 'react';
import { GeneratedMealPlan, MealSuggestion, DailyPlan, GeneratedIngredientMeals } from '../types';
import { SparklesIcon, DownloadIcon, RefreshCwIcon, LeafIcon, DropletIcon, ProteinIcon, ZapIcon, LightbulbIcon, HomeIcon } from './icons'; // Added HomeIcon
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MEAL_IMAGE_FALLBACK_URL } from '../constants';

type PlanData = GeneratedMealPlan | GeneratedIngredientMeals;
type PlanContext = "profile" | "ingredients"; // To differentiate button actions

interface MealPlanDisplayProps {
  planData: PlanData;
  onGenerateNewPlan: () => void; // Context-dependent: opens profile plan generator or ingredient input
  onGoHome: () => void;
  planContext: PlanContext; 
}

const MealImage: React.FC<{ query?: string; mealName: string }> = ({ query, mealName }) => {
  const [imgSrc, setImgSrc] = React.useState(() => 
    query ? `https://source.unsplash.com/400x300/?${encodeURIComponent(query)}` : MEAL_IMAGE_FALLBACK_URL
  );

  const handleError = () => {
    setImgSrc(MEAL_IMAGE_FALLBACK_URL); // Fallback if Unsplash image fails or query is bad
  };

  return (
    <img 
      src={imgSrc} 
      alt={`Image of ${mealName}`} 
      className="w-full h-40 object-cover rounded-t-lg mb-2" 
      onError={handleError}
      loading="lazy"
    />
  );
};


const MealCard: React.FC<{ meal: MealSuggestion, delay: number }> = ({ meal, delay }) => (
  <motion.div 
    className="bg-brand-surface-alt dark:bg-dark-brand-surface-alt rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: delay * 0.05, duration: 0.3 }} 
  >
    <MealImage query={meal.imageSearchQuery} mealName={meal.mealName} />
    <div className="p-3 flex-grow flex flex-col">
      <h4 className="text-md font-semibold text-brand-primary dark:text-dark-brand-primary mb-1">{meal.mealName}</h4>
      <p className="text-xs text-brand-text-secondary dark:text-dark-brand-text-secondary mb-1.5 flex-grow">{meal.description}</p>
    
      <div className="flex flex-wrap gap-x-2 gap-y-0.5 text-xs mb-1.5 mt-auto">
        {meal.estimatedCalories !== undefined && (
          <span className="flex items-center text-brand-text-muted dark:text-dark-brand-text-muted">
            <ZapIcon className="w-3 h-3 mr-0.5 text-yellow-500 dark:text-yellow-400"/> {meal.estimatedCalories} kcal
          </span>
        )}
        {meal.estimatedProtein !== undefined && (
          <span className="flex items-center text-brand-text-muted dark:text-dark-brand-text-muted">
            <ProteinIcon className="w-3 h-3 mr-0.5 text-red-500 dark:text-red-400"/> {meal.estimatedProtein}g P
          </span>
        )}
        {meal.estimatedCarbs !== undefined && (
          <span className="flex items-center text-brand-text-muted dark:text-dark-brand-text-muted">
            <LeafIcon className="w-3 h-3 mr-0.5 text-green-500 dark:text-green-400"/> {meal.estimatedCarbs}g C
          </span>
        )}
        {meal.estimatedFats !== undefined && (
          <span className="flex items-center text-brand-text-muted dark:text-dark-brand-text-muted">
            <DropletIcon className="w-3 h-3 mr-0.5 text-sky-500 dark:text-sky-400"/> {meal.estimatedFats}g F
          </span>
        )}
      </div>

      {meal.keyIngredients && meal.keyIngredients.length > 0 && (
        <div className="mb-1">
          <p className="text-xs font-medium text-brand-text-secondary dark:text-dark-brand-text-secondary">Key Ingredients:</p>
          <p className="text-xs text-brand-text-muted dark:text-dark-brand-text-muted">{meal.keyIngredients.join(', ')}</p>
        </div>
      )}
      {meal.recipeHighlights && meal.recipeHighlights.length > 0 && (
        <div>
          <p className="text-xs font-medium text-brand-text-secondary dark:text-dark-brand-text-secondary">Recipe Notes:</p>
          <ul className="list-disc list-inside pl-1 text-xs text-brand-text-muted dark:text-dark-brand-text-muted">
            {meal.recipeHighlights.map((highlight, i) => <li key={i}>{highlight}</li>)}
          </ul>
        </div>
      )}
      {meal.notes && (
          <p className="mt-1.5 text-xs italic text-brand-text-muted dark:text-dark-brand-text-muted">{meal.notes}</p>
        )}
    </div>
  </motion.div>
);

const DailyPlanCard: React.FC<{ dailyPlan: DailyPlan, dayIndex: number }> = ({ dailyPlan, dayIndex }) => (
  <motion.div 
    className="bg-brand-surface dark:bg-dark-brand-surface p-4 md:p-5 rounded-xl shadow-lg"
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: dayIndex * 0.15, duration: 0.4 }} 
  >
    {dailyPlan.dayOfWeek && <h3 className="text-xl font-bold text-brand-primary dark:text-dark-brand-primary mb-3">{dailyPlan.dayOfWeek}</h3>}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {dailyPlan.meals.map((meal, mealIndex) => (
        <MealCard key={mealIndex} meal={meal} delay={mealIndex} />
      ))}
    </div>
    {dailyPlan.dailyTotals && (
      <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700 text-right">
        <p className="text-xs sm:text-sm font-semibold text-brand-text-secondary dark:text-dark-brand-text-secondary">
          Daily Totals (Approx.): 
          {dailyPlan.dailyTotals.calories && ` ${dailyPlan.dailyTotals.calories} kcal`}
          {dailyPlan.dailyTotals.protein && `, ${dailyPlan.dailyTotals.protein}g Protein`}
        </p>
      </div>
    )}
  </motion.div>
);

const MealPlanDisplay: React.FC<MealPlanDisplayProps> = ({ planData, onGenerateNewPlan, onGoHome, planContext }) => {
  const { planTitle, notes } = planData;
  const targetCaloriesPerDay = 'targetCaloriesPerDay' in planData ? planData.targetCaloriesPerDay : undefined;
  const planType = 'planType' in planData ? planData.planType : undefined; // For GeneratedMealPlan

  const mealPlanContentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleDownloadPdf = async () => {
    const contentToCapture = mealPlanContentRef.current;
    if (!contentToCapture) return;

    setIsDownloading(true);
    try {
      contentToCapture.style.transform = 'scale(1.2)';
      contentToCapture.style.transformOrigin = 'top left';
      await new Promise(resolve => setTimeout(resolve, 100)); 

      const canvas = await html2canvas(contentToCapture, {
        scale: 2, useCORS: true, logging: false,
        width: contentToCapture.scrollWidth, height: contentToCapture.scrollHeight,
        windowWidth: contentToCapture.scrollWidth, windowHeight: contentToCapture.scrollHeight,
      });
      
      contentToCapture.style.transform = '';
      contentToCapture.style.transformOrigin = '';

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${planTitle.replace(/\s+/g, '_') || 'meal_ideas'}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Sorry, there was an error generating the PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } } };
  const headerVariants = { hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } } };
  
  let contentToRender;
  if ('planType' in planData && planData.planType) { // It's a GeneratedMealPlan
      const mealPlan = planData as GeneratedMealPlan;
      if (mealPlan.planType === 'single_meal' && mealPlan.content) {
        contentToRender = <MealCard meal={mealPlan.content as MealSuggestion} delay={0} />;
      } else if (mealPlan.planType === 'daily' && mealPlan.content) {
        contentToRender = <DailyPlanCard dailyPlan={mealPlan.content as DailyPlan} dayIndex={0} />;
      } else if (mealPlan.planType === 'weekly' && Array.isArray(mealPlan.content)) {
        contentToRender = (
          <div className="space-y-4">
            {(mealPlan.content as DailyPlan[]).map((dailyPlan, index) => (
              <DailyPlanCard key={index} dailyPlan={dailyPlan} dayIndex={index} />
            ))}
          </div>
        );
      }
  } else if ('userInputIngredients' in planData) { // It's a GeneratedIngredientMeals
      const ingredientMeals = planData as GeneratedIngredientMeals;
      contentToRender = (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(ingredientMeals.content as MealSuggestion[]).map((meal, index) => (
                  <MealCard key={index} meal={meal} delay={index} />
              ))}
          </div>
      );
  }


  return (
    <motion.div 
      className="max-w-3xl mx-auto p-2 md:p-0 space-y-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div ref={mealPlanContentRef} className="p-2 bg-brand-background dark:bg-dark-brand-background rounded-lg">
        <motion.div variants={headerVariants} className="text-center mb-5 pt-2">
           {planContext === "profile" ? 
             <SparklesIcon className="w-10 h-10 text-brand-accent dark:text-dark-brand-accent mx-auto mb-1.5" /> :
             <LightbulbIcon className="w-10 h-10 text-brand-accent dark:text-dark-brand-accent mx-auto mb-1.5" />
            }
          <h2 className="text-2xl md:text-3xl font-bold text-brand-text-primary dark:text-dark-brand-text-primary">{planTitle}</h2>
          {targetCaloriesPerDay && (
            <p className="text-sm text-brand-text-secondary dark:text-dark-brand-text-secondary mt-0.5">
              Targeting approx. {targetCaloriesPerDay} kcal/day
            </p>
          )}
          {'userInputIngredients' in planData && (planData as GeneratedIngredientMeals).userInputIngredients.length > 0 && (
             <p className="text-xs text-brand-text-muted dark:text-dark-brand-text-muted mt-1">
                Based on: <em>{(planData as GeneratedIngredientMeals).userInputIngredients.join(', ')}</em>
             </p>
          )}
        </motion.div>
        
        {contentToRender}
        
        {notes && (
          <motion.p 
            className="mt-3 text-xs text-center italic text-brand-text-muted dark:text-dark-brand-text-muted p-2 bg-brand-surface-alt dark:bg-dark-brand-surface-alt/50 rounded-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }} // Generic delay
          >
            {notes}
          </motion.p>
        )}
      </div>

      <div className="text-center mt-6 mb-6 space-y-3 sm:space-y-0 sm:flex sm:flex-wrap sm:justify-center sm:gap-3">
        <button
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-5 rounded-full shadow-lg hover:shadow-xl transition-all-smooth transform hover:scale-105 flex items-center justify-center text-md disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <DownloadIcon className="w-5 h-5 inline mr-2" />
          {isDownloading ? 'Downloading...' : 'Download PDF'}
        </button>
        <button
          onClick={onGenerateNewPlan}
          className="bg-brand-accent hover:bg-brand-accent-hover dark:bg-dark-brand-accent dark:hover:bg-dark-brand-accent-hover text-brand-text-primary font-semibold py-2.5 px-5 rounded-full shadow-lg hover:shadow-xl transition-all-smooth transform hover:scale-105 flex items-center justify-center text-md"
        >
          {planContext === "profile" ? <SparklesIcon className="w-5 h-5 inline mr-2" /> : <LightbulbIcon className="w-5 h-5 inline mr-2" />}
          New Ideas
        </button>
        <button
          onClick={onGoHome}
          className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-brand-text-primary dark:text-dark-brand-text-primary font-semibold py-2.5 px-5 rounded-full shadow-lg hover:shadow-xl transition-all-smooth transform hover:scale-105 flex items-center justify-center text-md"
        >
          <HomeIcon className="w-5 h-5 inline mr-2" />
          Go Home
        </button>
      </div>
    </motion.div>
  );
};

export default MealPlanDisplay;
