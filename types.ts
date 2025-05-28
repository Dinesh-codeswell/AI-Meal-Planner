
export interface NutrientValue {
  value: number;
  unit: string;
}

export interface MacroNutrientDetail {
  protein: NutrientValue;
  carbohydrates: NutrientValue;
  fats: NutrientValue;
}

export interface MicroNutrientDetail {
  name: string;
  amount: string | number; // Can be "trace", "present", or numeric value
  unit: string;
}

export interface NutrientData {
  mealName: string;
  description: string;
  calories: NutrientValue;
  macronutrients: MacroNutrientDetail;
  micronutrients: MicroNutrientDetail[];
  confidenceScore?: number;
  warnings?: string[];
}

export interface ImagePart {
  inlineData: {
    mimeType: string;
    data: string;
  };
}

// Onboarding & User Profile
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type DietaryPreference = 'omnivore' | 'vegetarian' | 'vegan';
export type WeightUnit = 'kg' | 'lbs';
export type HeightUnit = 'cm' | 'ft_in';

export interface UserData {
  name?: string; // Optional
  age?: number;
  weight?: number;
  weightUnit?: WeightUnit;
  height?: number; // cm for 'cm', total inches for 'ft_in'
  heightUnit?: HeightUnit;
  activityLevel?: ActivityLevel;
  dietaryPreference?: DietaryPreference;
  allergies?: string; // Comma-separated or free text
  calorieGoal?: number; // Optional daily calorie goal
  onboardingCompleted: boolean;
}

// Meal Recommendation (User Profile Based)
export type PlanType = 'single_meal' | 'daily' | 'weekly';
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealSuggestion {
  mealName: string; // e.g., "Breakfast Suggestion", "Lunch: Quinoa Bowl"
  description: string;
  estimatedCalories?: number;
  estimatedProtein?: number; // in grams
  estimatedCarbs?: number; // in grams
  estimatedFats?: number; // in grams
  keyIngredients?: string[]; // Ingredients suggested by AI for this meal
  recipeHighlights?: string[]; // Brief steps or notes
  notes?: string; // e.g., "High in fiber", "Good source of Omega-3"
  imageSearchQuery?: string; // e.g., "grilled chicken salad bowl"
}

export interface DailyPlan {
  dayOfWeek?: string; // e.g., "Monday", "Day 1"
  meals: MealSuggestion[]; // Could be 3-4 meals (breakfast, lunch, dinner, snack)
  dailyTotals?: {
    calories?: number;
    protein?: number;
    // carbs/fats if easily provided by AI
  };
}

export interface GeneratedMealPlan {
  planTitle: string;
  targetCaloriesPerDay?: number;
  planType: PlanType; // 'single_meal', 'daily', or 'weekly'
  content: MealSuggestion | DailyPlan | DailyPlan[]; // Single meal, single day, or array of days for weekly
  notes?: string; // General notes about the plan
}

// Meal Recommendation (Ingredient Based)
// Reusing MealSuggestion for individual meal details.
export interface GeneratedIngredientMeals {
  planTitle: string; // e.g., "Meal Ideas from Your Ingredients"
  userInputIngredients: string[]; // List of ingredients user provided
  content: MealSuggestion[]; // Array of meal suggestions
  notes?: string; // General notes, e.g., "Consider adding a side salad for more vegetables."
}
