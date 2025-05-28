
import React, { useState, useCallback, useEffect } from 'react';
import CameraCapture from './components/CameraCapture';
import NutrientDisplay from './components/NutrientDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import InfoModal from './components/InfoModal';
import OnboardingModal from './components/OnboardingModal';
import MealPlanGeneratorModal from './components/MealPlanGeneratorModal';
import MealPlanDisplay from './components/MealPlanDisplay';
import IngredientInputModal from './components/IngredientInputModal'; // New
import { NutrientData, UserData, GeneratedMealPlan, PlanType, MealType, GeneratedIngredientMeals } from './types';
import { analyzeMealImage, generateMealPlan, generateMealsFromIngredients } from './services/geminiService';
import { CameraIcon, RefreshCwIcon, InfoIcon, SunIcon, MoonIcon, UserIcon, SparklesIcon, ClipboardListIcon, FoodPlateIcon, DownloadIcon, LightbulbIcon } from './components/icons';
import { AnimatePresence, motion } from 'framer-motion';
import { USER_DATA_KEY } from './constants';

const App: React.FC = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [nutrientData, setNutrientData] = useState<NutrientData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("Analyzing your meal...");
  const [error, setError] = useState<string | null>(null);
  
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Onboarding State
  const [showOnboardingModal, setShowOnboardingModal] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(false);

  // Meal Plan State (Profile-based)
  const [showMealPlanGeneratorModal, setShowMealPlanGeneratorModal] = useState<boolean>(false);
  const [generatedMealPlan, setGeneratedMealPlan] = useState<GeneratedMealPlan | null>(null);
  const [isMealPlanLoading, setIsMealPlanLoading] = useState<boolean>(false);
  const [mealPlanError, setMealPlanError] = useState<string | null>(null);

  // Ingredient Meal State
  const [showIngredientInputModal, setShowIngredientInputModal] = useState<boolean>(false);
  const [generatedIngredientMeals, setGeneratedIngredientMeals] = useState<GeneratedIngredientMeals | null>(null);
  const [isIngredientMealsLoading, setIsIngredientMealsLoading] = useState<boolean>(false);
  const [ingredientMealsError, setIngredientMealsError] = useState<string | null>(null);


  const [currentView, setCurrentView] = useState<'welcome' | 'camera' | 'loading' | 'error' | 'results' | 'meal_plan_results' | 'ingredient_meals_results'>('welcome');

  // Load user data and determine initial state
  useEffect(() => {
    const storedUserData = localStorage.getItem(USER_DATA_KEY);
    if (storedUserData) {
      const parsedData = JSON.parse(storedUserData) as UserData;
      setUserData(parsedData);
      setIsOnboardingComplete(parsedData.onboardingCompleted);
    }
  }, []);
  
  useEffect(() => {
    if (showCamera) setCurrentView('camera');
    else if (isLoading || isMealPlanLoading || isIngredientMealsLoading) setCurrentView('loading');
    else if (error || mealPlanError || ingredientMealsError) setCurrentView('error');
    else if (nutrientData) setCurrentView('results');
    else if (generatedMealPlan) setCurrentView('meal_plan_results');
    else if (generatedIngredientMeals) setCurrentView('ingredient_meals_results');
    else setCurrentView('welcome');
  }, [showCamera, isLoading, error, nutrientData, isMealPlanLoading, mealPlanError, generatedMealPlan, isIngredientMealsLoading, ingredientMealsError, generatedIngredientMeals]);


  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      // CSS variables for dark mode are now primarily set in index.html <style>
    } else {
      root.classList.remove('dark');
      // CSS variables for light mode are now primarily set in index.html <style>
    }
  }, [isDarkMode]);

  const handleUserDataSave = (data: UserData) => {
    setUserData(data);
    setIsOnboardingComplete(data.onboardingCompleted);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
    setShowOnboardingModal(false);
  };

  const clearAllResults = () => {
    setNutrientData(null);
    setGeneratedMealPlan(null);
    setGeneratedIngredientMeals(null);
    setError(null);
    setMealPlanError(null);
    setIngredientMealsError(null);
  }

  const handleImageCapture = useCallback(async (imageDataUrl: string) => {
    setCapturedImage(imageDataUrl);
    setShowCamera(false);
    setIsLoading(true);
    setLoadingMessage("Analyzing your delicious meal...");
    clearAllResults();

    try {
      const data = await analyzeMealImage(imageDataUrl);
      setNutrientData(data);
    } catch (err) {
      handleGenericError(err, 'nutrientAnalysis');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGenerateMealPlan = useCallback(async (planType: PlanType, mealType?: MealType) => {
    if (!userData || !userData.onboardingCompleted) {
      setMealPlanError("Please complete your profile first to get personalized meal plans.");
      setShowOnboardingModal(true);
      return;
    }
    setShowMealPlanGeneratorModal(false);
    setIsMealPlanLoading(true);
    setLoadingMessage("Crafting your personalized meal plan...");
    clearAllResults();

    try {
      const plan = await generateMealPlan(userData, planType, mealType);
      setGeneratedMealPlan(plan);
    } catch (err) {
      handleGenericError(err, 'mealPlan');
    } finally {
      setIsMealPlanLoading(false);
    }
  }, [userData]);

  const handleGenerateMealsFromIngredients = useCallback(async (ingredients: string) => {
    setShowIngredientInputModal(false);
    setIsIngredientMealsLoading(true);
    setLoadingMessage("Whipping up ideas from your ingredients...");
    clearAllResults();

    try {
      const meals = await generateMealsFromIngredients(ingredients);
      setGeneratedIngredientMeals(meals);
    } catch (err) {
      handleGenericError(err, 'ingredientMeals');
    } finally {
      setIsIngredientMealsLoading(false);
    }
  }, []);
  
  const handleGenericError = (err: unknown, type: 'nutrientAnalysis' | 'mealPlan' | 'ingredientMeals') => {
    let message = "An unknown error occurred.";
    if (err instanceof Error) {
      message = err.message;
    }
    console.error(`${type} error:`, err);

    switch (type) {
      case 'nutrientAnalysis': setError(message); break;
      case 'mealPlan': setMealPlanError(message); break;
      case 'ingredientMeals': setIngredientMealsError(message); break;
    }
  };


  const resetToWelcome = () => {
    setCapturedImage(null);
    clearAllResults();
    setIsLoading(false);
    setIsMealPlanLoading(false);
    setIsIngredientMealsLoading(false);
    setShowCamera(false);
    setCurrentView('welcome');
  };

  const handleScanNewMeal = useCallback(() => {
    resetToWelcome();
    setShowCamera(true);
  }, []);
  
  const handleCloseCamera = useCallback(() => {
    setShowCamera(false);
    if (!capturedImage && !nutrientData && !generatedMealPlan && !generatedIngredientMeals) { 
      resetToWelcome();
    }
  }, [capturedImage, nutrientData, generatedMealPlan, generatedIngredientMeals]);

  const openCamera = useCallback(() => {
    clearAllResults();
    setShowCamera(true); 
  }, []);

  const toggleInfoModal = useCallback(() => setShowInfoModal(prev => !prev), []);
  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const openOnboarding = () => {
    clearAllResults();
    setShowOnboardingModal(true);
  };
  
  const handleOpenMealPlanGeneratorFromResults = () => {
    clearAllResults();
    setShowMealPlanGeneratorModal(true);
  };
  
  const handleOpenIngredientModalFromResults = () => {
    clearAllResults();
    setShowIngredientInputModal(true);
  }

  const pageVariants = {
    initial: { opacity: 0, y: 30 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -30 },
  };

  const pageTransition = { type: "tween", ease: "anticipate", duration: 0.5 };

  const renderContent = () => {
    switch (currentView) {
      case 'camera':
        return <CameraCapture onCapture={handleImageCapture} onClose={handleCloseCamera} />;
      case 'loading':
        return <LoadingSpinner message={loadingMessage} />;
      case 'error':
        const specificError = error || mealPlanError || ingredientMealsError || "An unknown error occurred.";
        const retryAction = () => {
            if (error && capturedImage) handleImageCapture(capturedImage);
            else if (mealPlanError) setShowMealPlanGeneratorModal(true);
            else if (ingredientMealsError) setShowIngredientInputModal(true);
            else resetToWelcome();
        };
        return <ErrorDisplay message={specificError} onRetry={retryAction} />;
      case 'results':
        if (nutrientData && capturedImage) {
          return (
            <motion.div key="results-view" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full">
              <NutrientDisplay data={nutrientData} imageSrc={capturedImage} />
              <div className="text-center mt-8 mb-8 space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleScanNewMeal}
                  className="bg-brand-primary hover:bg-brand-primary-hover dark:bg-dark-brand-primary dark:hover:bg-dark-brand-primary-hover text-white font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all-smooth transform hover:scale-105 flex items-center justify-center mx-auto sm:mx-0 sm:inline-flex text-lg"
                >
                  <RefreshCwIcon className="w-5 h-5 inline mr-2" />
                  Scan Another
                </button>
                 <button
                  onClick={resetToWelcome}
                  className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-brand-text-primary dark:text-dark-brand-text-primary font-semibold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transition-all-smooth transform hover:scale-105 flex items-center justify-center mx-auto sm:mx-0 sm:inline-flex text-lg"
                >
                  Go Home
                </button>
              </div>
            </motion.div>
          );
        }
        return null;
      case 'meal_plan_results':
        if (generatedMealPlan) {
          return (
            <motion.div key="meal_plan_results_view" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full">
              <MealPlanDisplay 
                planData={generatedMealPlan} 
                onGenerateNewPlan={handleOpenMealPlanGeneratorFromResults}
                onGoHome={resetToWelcome}
                planContext="profile"
              />
            </motion.div>
          );
        }
        return null;
      case 'ingredient_meals_results':
        if (generatedIngredientMeals) {
          return (
            <motion.div key="ingredient_meals_results_view" initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="w-full">
              <MealPlanDisplay 
                planData={generatedIngredientMeals}
                onGenerateNewPlan={handleOpenIngredientModalFromResults} // Opens ingredient modal again
                onGoHome={resetToWelcome}
                planContext="ingredients"
              />
            </motion.div>
          );
        }
        return null;
      case 'welcome':
      default:
        return (
          <motion.div 
            key="welcome-view"
            initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}
            className="flex flex-col items-center justify-center text-center p-4 md:p-6 min-h-[calc(100vh-200px)]"
          >
            <div className="bg-brand-surface dark:bg-dark-brand-surface p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl max-w-xl w-full transform hover:scale-[1.01] transition-all-smooth">
              <motion.div initial={{ scale:0.5, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}>
                 <FoodPlateIcon className="w-24 h-24 text-brand-primary dark:text-dark-brand-primary mx-auto mb-6" />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold text-brand-text-primary dark:text-dark-brand-text-primary mb-3">
                NutriSnap AI
              </h1>
              <p className="text-brand-text-secondary dark:text-dark-brand-text-secondary mb-8 text-lg">
                Your AI companion for smarter eating.
              </p>
              <div className="space-y-4">
                <button
                  onClick={openCamera}
                  className="w-full bg-brand-primary hover:bg-brand-primary-hover dark:bg-dark-brand-primary dark:hover:bg-dark-brand-primary-hover text-white font-bold py-3.5 px-8 rounded-full shadow-lg hover:shadow-xl transition-all-smooth transform hover:scale-105 text-xl flex items-center justify-center"
                >
                  <CameraIcon className="w-6 h-6 mr-3" />
                  Scan Your Meal
                </button>
                
                <button
                    onClick={() => setShowIngredientInputModal(true)}
                    className="w-full bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 text-white font-bold py-3.5 px-8 rounded-full shadow-lg hover:shadow-xl transition-all-smooth transform hover:scale-105 text-xl flex items-center justify-center"
                >
                    <LightbulbIcon className="w-6 h-6 mr-3" />
                    Recipe Ideas from Ingredients
                </button>

                {isOnboardingComplete ? (
                  <button
                    onClick={() => setShowMealPlanGeneratorModal(true)}
                    className="w-full bg-brand-accent hover:bg-brand-accent-hover dark:bg-dark-brand-accent dark:hover:bg-dark-brand-accent-hover text-brand-text-primary font-bold py-3.5 px-8 rounded-full shadow-lg hover:shadow-xl transition-all-smooth transform hover:scale-105 text-xl flex items-center justify-center"
                  >
                    <SparklesIcon className="w-6 h-6 mr-3" />
                    Personalized Meal Plan
                  </button>
                ) : (
                  <button
                    onClick={openOnboarding}
                    className="w-full bg-brand-accent hover:bg-brand-accent-hover dark:bg-dark-brand-accent dark:hover:bg-dark-brand-accent-hover text-brand-text-primary font-bold py-3.5 px-8 rounded-full shadow-lg hover:shadow-xl transition-all-smooth transform hover:scale-105 text-xl flex items-center justify-center"
                  >
                    <ClipboardListIcon className="w-6 h-6 mr-3" />
                    Complete Profile for Meal Plans
                  </button>
                )}
                
                <button
                    onClick={openOnboarding}
                    className="text-sm text-brand-text-secondary dark:text-dark-brand-text-secondary hover:text-brand-primary dark:hover:text-dark-brand-primary underline flex items-center justify-center mx-auto pt-2"
                  >
                    <UserIcon className="w-4 h-4 mr-1.5" />
                    {isOnboardingComplete ? 'Update My Profile' : 'Manage Profile'}
                 </button>

              </div>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12 relative overflow-x-hidden">
      <button
        onClick={toggleDarkMode}
        className="fixed top-4 right-4 z-[60] p-2.5 bg-brand-surface dark:bg-dark-brand-surface rounded-full shadow-md text-brand-primary dark:text-dark-brand-primary hover:scale-110 transition-all-smooth"
        aria-label="Toggle dark mode"
      >
        {isDarkMode ? <SunIcon className="w-6 h-6" /> : <MoonIcon className="w-6 h-6" />}
      </button>
      
      <div className="relative py-3 sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto w-full px-4">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </div>

      <footer className="text-center py-6 px-4 text-sm text-brand-text-secondary dark:text-dark-brand-text-secondary mt-auto">
        <button 
            onClick={toggleInfoModal}
            className="inline-flex items-center text-brand-primary dark:text-dark-brand-primary hover:underline mb-2 font-medium"
        >
            <InfoIcon className="w-5 h-5 mr-1.5" />
            Learn about Nutritional Values
        </button>
        <p>Powered by Gemini AI. Estimates are for informational purposes only.</p>
        <p>&copy; {new Date().getFullYear()} NutriSnap AI. All rights reserved.</p>
      </footer>

      <AnimatePresence>
        {showInfoModal && <InfoModal onClose={toggleInfoModal} />}
        {showOnboardingModal && <OnboardingModal currentData={userData} onSave={handleUserDataSave} onClose={() => setShowOnboardingModal(false)} />}
        {showMealPlanGeneratorModal && <MealPlanGeneratorModal onSubmit={handleGenerateMealPlan} onClose={() => setShowMealPlanGeneratorModal(false)} />}
        {showIngredientInputModal && <IngredientInputModal onSubmit={handleGenerateMealsFromIngredients} onClose={() => setShowIngredientInputModal(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default App;