
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { NutrientData, ImagePart, UserData, GeneratedMealPlan, PlanType, MealType, GeneratedIngredientMeals } from '../types';
import { GEMINI_MODEL_NAME, GEMINI_API_PROMPT, GEMINI_MEAL_PLAN_PROMPT_TEMPLATE, GEMINI_INGREDIENT_MEAL_PROMPT_TEMPLATE } from '../constants';

// --- START OF SIMULATED BACKEND LOGIC ---
// CRITICAL SECURITY NOTE: In a real deployment, the API_KEY and GoogleGenAI initialization
// MUST reside on your backend server. The frontend should NEVER handle the API key directly.
// The client-side SDK usage below is for local development and simulation ONLY.
// Exposing your API key in client-side code will lead to its unauthorized use and potential charges.
const API_KEY_FROM_ENV = process.env.API_KEY; 

if (!API_KEY_FROM_ENV) {
  console.warn("CRITICAL WARNING: API_KEY environment variable is not set. This app will simulate API calls. For actual Gemini interaction, a valid API key is required and MUST be managed by a backend server in production to prevent misuse and secure your key.");
}
// This 'ai' instance is for client-side simulation. In production, it lives on the backend.
const ai = new GoogleGenAI({ apiKey: API_KEY_FROM_ENV || "SIMULATED_MISSING_API_KEY_CLIENT_SIDE" }); 
// --- END OF SIMULATED BACKEND LOGIC ---


export const analyzeMealImage = async (base64Image: string): Promise<NutrientData> => {
  // --- PRODUCTION: REAL BACKEND CALL (Example) ---
  /*
  try {
    const response = await fetch('/api/analyze-meal', { // Your backend endpoint
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Meal analysis failed with status: ${response.status}`);
    }
    return await response.json() as NutrientData;
  } catch (error) {
    console.error("Error calling backend for meal analysis:", error);
    if (error instanceof Error) throw error;
    throw new Error("An unknown error occurred while analyzing meal via backend.");
  }
  */
  // --- END OF PRODUCTION BACKEND CALL ---
  
  // --- DEVELOPMENT/SIMULATION: CLIENT-SIDE SDK CALL (Remove this block when using a real backend) ---
  if (!API_KEY_FROM_ENV || API_KEY_FROM_ENV === "SIMULATED_MISSING_API_KEY_CLIENT_SIDE") { 
    return Promise.reject(new Error("API key is not configured for client-side simulation. In production, this check and the API call are handled by the backend."));
  }

  const imageMimeType = base64Image.startsWith('data:image/jpeg') ? 'image/jpeg' : 'image/png';
  const pureBase64Data = base64Image.split(',')[1];

  const imagePart: ImagePart = {
    inlineData: {
      mimeType: imageMimeType,
      data: pureBase64Data,
    },
  };

  const textPart = {
    text: GEMINI_API_PROMPT,
  };

  let rawResponseText = "";
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
      },
    });
    
    rawResponseText = response.text;
    let jsonStr = rawResponseText.trim();
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }
    
    try {
      const parsedData = JSON.parse(jsonStr) as NutrientData;
      if (!parsedData.mealName || !parsedData.calories || !parsedData.macronutrients) {
          console.warn("Parsed nutrient data is missing key fields:", parsedData);
          parsedData.mealName = parsedData.mealName || "Unknown Meal";
          parsedData.description = parsedData.description || "Could not determine meal details.";
          parsedData.calories = parsedData.calories || { value: 0, unit: 'kcal'};
          parsedData.macronutrients = parsedData.macronutrients || { 
              protein: {value: 0, unit: 'g'}, 
              carbohydrates: {value: 0, unit: 'g'}, 
              fats: {value: 0, unit: 'g'}
          };
          parsedData.micronutrients = parsedData.micronutrients || [];
          parsedData.warnings = parsedData.warnings || ["AI analysis might be incomplete due to response format issues."];
      }
      return parsedData;
    } catch (parseError: any) {
      console.error("Failed to parse JSON response from Gemini (Nutrient Analysis):", parseError);
      console.error("Raw Gemini response text (Nutrient Analysis):", rawResponseText);
      throw new Error(`The AI returned nutrient analysis with an invalid JSON structure. Please try again. Details: ${parseError.message}. Raw response (partial): ${jsonStr.substring(0, 200)}...`);
    }

  } catch (error) {
    console.error("Error calling Gemini API (Nutrient Analysis - Client Simulation):", error);
    if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
            throw new Error("Invalid API Key for nutrient analysis. Please check your configuration. (Client-side simulation)");
        }
        if (error.message.startsWith("The AI returned nutrient analysis with an invalid JSON structure")) {
            throw error;
        }
         throw new Error(`AI nutrient analysis failed: ${error.message} (Client-side simulation)`);
    }
    throw new Error("An unknown error occurred during AI nutrient analysis. (Client-side simulation)");
  }
  // --- END OF DEVELOPMENT/SIMULATION CLIENT-SIDE SDK CALL ---
};


export const generateMealPlan = async (
  userData: UserData, 
  planType: PlanType, 
  mealType?: MealType
): Promise<GeneratedMealPlan> => {
  // --- PRODUCTION: REAL BACKEND CALL (Example) ---
  /*
  try {
    const response = await fetch('/api/generate-meal-plan', { // Your backend endpoint
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userData, planType, mealType }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Meal plan generation failed with status: ${response.status}`);
    }
    return await response.json() as GeneratedMealPlan;
  } catch (error) {
    console.error("Error calling backend for meal plan generation:", error);
    if (error instanceof Error) throw error;
    throw new Error("An unknown error occurred while generating meal plan via backend.");
  }
  */
  // --- END OF PRODUCTION BACKEND CALL ---

  // --- DEVELOPMENT/SIMULATION: CLIENT-SIDE SDK CALL (Remove this block when using a real backend) ---
  if (!API_KEY_FROM_ENV || API_KEY_FROM_ENV === "SIMULATED_MISSING_API_KEY_CLIENT_SIDE") { 
    return Promise.reject(new Error("API key is not configured for client-side simulation. In production, this check and the API call are handled by the backend."));
  }

  let planTypeSpecific = "";
  if (planType === 'single_meal') {
    planTypeSpecific = mealType ? mealType.charAt(0).toUpperCase() + mealType.slice(1) : "Meal";
  } else if (planType === 'daily') {
    planTypeSpecific = "Full Day";
  } else if (planType === 'weekly') {
    planTypeSpecific = "Full Week";
  }
  
  const heightCm = userData.heightUnit === 'ft_in' && userData.height ? userData.height * 2.54 : userData.height;
  const weightKg = userData.weightUnit === 'lbs' && userData.weight ? userData.weight * 0.453592 : userData.weight;

  const prompt = GEMINI_MEAL_PLAN_PROMPT_TEMPLATE
    .replace(/\$\{age\}/g, String(userData.age || 'N/A'))
    .replace(/\$\{weight\}/g, String(userData.weight ? (userData.weightUnit === 'kg' ? weightKg?.toFixed(1) : userData.weight.toFixed(1)) : 'N/A'))
    .replace(/\$\{weightUnit\}/g, userData.weightUnit === 'kg' ? 'kg' : (userData.weight ? 'lbs' : 'N/A'))
    .replace(/\$\{height\}/g, String(userData.height ? (userData.heightUnit === 'cm' ? heightCm?.toFixed(0) : userData.height.toFixed(1)) : 'N/A'))
    .replace(/\$\{heightUnit\}/g, userData.heightUnit === 'cm' ? 'cm' : (userData.height ? 'inches total' : 'N/A'))
    .replace(/\$\{activityLevel\}/g, userData.activityLevel || 'N/A')
    .replace(/\$\{dietaryPreference\}/g, userData.dietaryPreference || 'N/A')
    .replace(/\$\{allergies\}/g, userData.allergies || 'None specified')
    .replace(/\$\{calorieGoal\}/g, String(userData.calorieGoal || 'Not specified'))
    .replace(/\$\{calorieGoal_numeric_or_null_if_not_provided\}/g, String(userData.calorieGoal || null))
    .replace(/\$\{planType\}/g, planType)
    .replace(/\$\{planTypeSpecific\}/g, planTypeSpecific);

  let rawResponseText = "";
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    rawResponseText = response.text;
    let jsonStr = rawResponseText.trim();
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }

    try {
      const parsedPlan = JSON.parse(jsonStr) as GeneratedMealPlan;
      if (!parsedPlan.planTitle || !parsedPlan.planType || !parsedPlan.content) {
        console.warn("Parsed meal plan is missing key fields:", parsedPlan);
        throw new Error("AI response for meal plan was incomplete or malformed based on expected fields.");
      }
      return parsedPlan;
    } catch (parseError: any) {
      console.error("Failed to parse JSON response from Gemini (Meal Plan):", parseError);
      console.error("Raw Gemini response text (Meal Plan):", rawResponseText);
      throw new Error(`The AI returned a meal plan with an invalid JSON structure. Please try again. Details: ${parseError.message}. Raw response (partial): ${jsonStr.substring(0, 200)}...`);
    }

  } catch (error) {
    console.error("Error calling Gemini API (Meal Plan - Client Simulation):", error);
    if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
            throw new Error("Invalid API Key for meal plan generation. Please check your configuration. (Client-side simulation)");
        }
        if (error.message.startsWith("The AI returned a meal plan with an invalid JSON structure") || error.message.includes("AI response for meal plan was incomplete")) {
            throw error;
        }
         throw new Error(`AI meal plan generation failed: ${error.message} (Client-side simulation)`);
    }
    throw new Error("An unknown error occurred during AI meal plan generation. (Client-side simulation)");
  }
  // --- END OF DEVELOPMENT/SIMULATION CLIENT-SIDE SDK CALL ---
};

export const generateMealsFromIngredients = async (
  ingredients: string,
): Promise<GeneratedIngredientMeals> => {
  // --- PRODUCTION: REAL BACKEND CALL (Example) ---
  /*
  try {
    const response = await fetch('/api/generate-from-ingredients', { // Your backend endpoint
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Ingredient-based meal generation failed with status: ${response.status}`);
    }
    return await response.json() as GeneratedIngredientMeals;
  } catch (error) {
    console.error("Error calling backend for ingredient-based meal generation:", error);
    if (error instanceof Error) throw error;
    throw new Error("An unknown error occurred while generating meals from ingredients via backend.");
  }
  */
  // --- END OF PRODUCTION BACKEND CALL ---

  // --- DEVELOPMENT/SIMULATION: CLIENT-SIDE SDK CALL (Remove this block when using a real backend) ---
  if (!API_KEY_FROM_ENV || API_KEY_FROM_ENV === "SIMULATED_MISSING_API_KEY_CLIENT_SIDE") { 
    return Promise.reject(new Error("API key is not configured for client-side simulation. In production, this check and the API call are handled by the backend."));
  }

  const ingredientsArray = ingredients.split(/[,;\n]+/).map(item => item.trim()).filter(item => item.length > 0);
  const ingredientsPreview = ingredientsArray.slice(0, 3).join(', ') + (ingredientsArray.length > 3 ? '...' : '');


  const prompt = GEMINI_INGREDIENT_MEAL_PROMPT_TEMPLATE
    .replace(/\$\{ingredients\}/g, ingredientsArray.join(', '))
    .replace(/\$\{ingredientsPreview\}/g, ingredientsPreview);

  let rawResponseText = "";
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    rawResponseText = response.text;
    let jsonStr = rawResponseText.trim();
    const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[1]) {
      jsonStr = match[1].trim();
    }

    try {
      const parsedMeals = JSON.parse(jsonStr) as GeneratedIngredientMeals;
      if (!parsedMeals.planTitle || !parsedMeals.content || !Array.isArray(parsedMeals.content)) {
        console.warn("Parsed ingredient meal suggestions are missing key fields or have incorrect structure:", parsedMeals);
        throw new Error("AI response for ingredient meals was incomplete or malformed.");
      }
      // Ensure userInputIngredients is populated if AI doesn't directly return it in the expected structure
      if(!parsedMeals.userInputIngredients || parsedMeals.userInputIngredients.length === 0) {
        parsedMeals.userInputIngredients = ingredientsArray;
      }
      return parsedMeals;
    } catch (parseError: any) {
      console.error("Failed to parse JSON response from Gemini (Ingredient Meals):", parseError);
      console.error("Raw Gemini response text (Ingredient Meals):", rawResponseText);
      throw new Error(`The AI returned ingredient meal suggestions with an invalid JSON structure. Please try again. Details: ${parseError.message}. Raw response (partial): ${jsonStr.substring(0, 200)}...`);
    }

  } catch (error) {
    console.error("Error calling Gemini API (Ingredient Meals - Client Simulation):", error);
    if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
            throw new Error("Invalid API Key for ingredient meal generation. Please check your configuration. (Client-side simulation)");
        }
        if (error.message.startsWith("The AI returned ingredient meal suggestions with an invalid JSON structure") || error.message.includes("AI response for ingredient meals was incomplete")) {
            throw error;
        }
         throw new Error(`AI ingredient meal generation failed: ${error.message} (Client-side simulation)`);
    }
    throw new Error("An unknown error occurred during AI ingredient meal generation. (Client-side simulation)");
  }
  // --- END OF DEVELOPMENT/SIMULATION CLIENT-SIDE SDK CALL ---
};
