
export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';
export const USER_DATA_KEY = 'nutrisnapUserData';

export const GEMINI_API_PROMPT = `Analyze the meal in this image. Provide an estimate of its nutritional content.
Identify the main components of the meal and briefly describe it.
Respond ONLY in JSON format with the following structure:
{
  "mealName": "e.g., Grilled Chicken Salad",
  "description": "A brief description of the identified meal and its main components.",
  "calories": {
    "value": 250,
    "unit": "kcal"
  },
  "macronutrients": {
    "protein": { "value": 30, "unit": "g" },
    "carbohydrates": { "value": 10, "unit": "g" },
    "fats": { "value": 10, "unit": "g" }
  },
  "micronutrients": [
    {"name": "Vitamin C", "amount": "50", "unit": "mg"},
    {"name": "Iron", "amount": "3", "unit": "mg"},
    {"name": "Sodium", "amount": "trace", "unit": "N/A"}
  ],
  "confidenceScore": 0.85,
  "warnings": ["e.g., High in sodium", "e.g., Estimation may vary based on portion size"]
}
If you cannot identify specific micronutrient amounts, list them with "amount": "trace" or "present", and "unit": "N/A".
Focus on common nutrients. If the image is unclear or not food, try to state that in the mealName or description and provide low/zero/null values for nutrients and a low confidence score.
The values for calories and macronutrients must be numbers.`;

export const FALLBACK_IMAGE_URL = 'https://picsum.photos/400/300'; // Generic fallback
export const MEAL_IMAGE_FALLBACK_URL = 'https://source.unsplash.com/random/400x300/?food,healthy'; // Fallback for meal items

export const GEMINI_MEAL_PLAN_PROMPT_TEMPLATE = `
You are a helpful AI nutritionist. Based on the following user profile and request, generate a personalized meal plan.

User Profile:
- Age: \${age} years
- Weight: \${weight} \${weightUnit}
- Height: \${height} \${heightUnit}
- Activity Level: \${activityLevel}
- Dietary Preference: \${dietaryPreference}
- Allergies/Dislikes: \${allergies}
- Daily Calorie Goal: \${calorieGoal} kcal (if not specified, aim for a generally healthy range based on profile, e.g. 1800-2500, or state if you cannot determine without a goal)

Request:
- Plan Type: \${planType} (\${planTypeSpecific})

Output Requirements:
- Respond ONLY in JSON format.
- Ensure all meal descriptions are appealing and provide a good variety.
- For key ingredients, list 3-5 main items.
- For recipe highlights, provide 2-3 brief, actionable steps or preparation notes.
- For each meal suggestion, include an "imageSearchQuery" field with 2-4 descriptive keywords for finding a representative image (e.g., "grilled salmon asparagus lemon", "oatmeal berries nuts").
- If estimating nutritional values (calories, protein), ensure they are reasonable for the described meal.
- If a weekly plan is requested, provide 7 daily plans.
- If a daily plan is requested, provide meals for breakfast, lunch, dinner, and one snack.
- If a single meal is requested, provide one detailed meal suggestion.

JSON Structure:

If planType is "single_meal":
{
  "planTitle": "Personalized \${planTypeSpecific} Suggestion",
  "planType": "single_meal",
  "targetCaloriesPerDay": \${calorieGoal_numeric_or_null_if_not_provided},
  "content": {
    "mealName": "e.g., Energizing Breakfast Bowl",
    "description": "Detailed description of the meal.",
    "estimatedCalories": 450,
    "estimatedProtein": 20,
    "estimatedCarbs": 60,
    "estimatedFats": 15,
    "keyIngredients": ["Oats", "Berries", "Almonds", "Chia Seeds"],
    "recipeHighlights": ["Cook oats with milk or water.", "Top with berries, almonds, and chia seeds.", "Add a drizzle of honey if desired."],
    "notes": "Excellent source of fiber and antioxidants.",
    "imageSearchQuery": "oatmeal berries almonds chia seeds"
  }
}

If planType is "daily":
{
  "planTitle": "Personalized Daily Meal Plan",
  "planType": "daily",
  "targetCaloriesPerDay": \${calorieGoal_numeric_or_null_if_not_provided},
  "content": {
    "dayOfWeek": "Today's Plan",
    "meals": [
      // 3-4 MealSuggestion objects for breakfast, lunch, dinner, snack
      // Example MealSuggestion:
      // { "mealName": "Breakfast: Scrambled Eggs & Whole Wheat Toast", "description": "...", "estimatedCalories": 350, "imageSearchQuery": "scrambled eggs toast spinach", ... },
      // { "mealName": "Lunch: Lentil Soup & Side Salad", "description": "...", "estimatedCalories": 500, "imageSearchQuery": "lentil soup green salad", ... },
      // { "mealName": "Dinner: Baked Chicken Breast with Quinoa & Steamed Broccoli", "description": "...", "estimatedCalories": 600, "imageSearchQuery": "baked chicken quinoa broccoli", ... },
      // { "mealName": "Snack: Apple with Peanut Butter", "description": "...", "estimatedCalories": 200, "imageSearchQuery": "apple slices peanut butter", ... }
    ],
    "dailyTotals": { // Approximate
      "calories": 1650,
      "protein": 80
    }
  }
}

If planType is "weekly":
{
  "planTitle": "Personalized Weekly Meal Plan",
  "planType": "weekly",
  "targetCaloriesPerDay": \${calorieGoal_numeric_or_null_if_not_provided},
  "content": [
    // 7 DailyPlan objects, each structured like the "daily" plan's "content"
    // Example DailyPlan for Monday:
    // { "dayOfWeek": "Monday", "meals": [ {..., "imageSearchQuery": "..."} , ...], "dailyTotals": {...} },
    // ... and so on for Tuesday to Sunday
  ]
}

Please ensure the JSON is valid and complete according to the requested plan type.
If any user profile information is missing or unclear (e.g. "N/A" for allergies), adapt the plan as best as possible or make reasonable assumptions, mentioning them in a general note if significant.
Prioritize whole foods and balanced meals.
`;

export const GEMINI_INGREDIENT_MEAL_PROMPT_TEMPLATE = `
You are a creative AI chef. Based on the list of ingredients provided by the user, generate 2-4 diverse meal suggestions. 
For each suggestion, include a brief description, an estimated calorie count, a list of the key user-provided ingredients utilized, a few recipe highlights, and an image search query.

User Provided Ingredients:
\${ingredients}

Output Requirements:
- Respond ONLY in JSON format.
- The main JSON object should have a "planTitle" (e.g., "Meal Ideas from Your Ingredients"), "userInputIngredients" (an array of strings from the user input, split by comma/newline), and "content" (an array of MealSuggestion objects).
- Each MealSuggestion object should contain:
  - "mealName": A catchy and descriptive name for the meal (e.g., "Quick Tomato & Spinach Pasta").
  - "description": A brief, appealing description of the meal.
  - "estimatedCalories": A numeric estimate of calories per serving.
  - "keyIngredients": An array of strings listing the primary user-provided ingredients used in this specific meal suggestion.
  - "recipeHighlights": An array of 2-4 strings with brief, actionable cooking steps or preparation notes.
  - "imageSearchQuery": A string with 2-4 descriptive keywords for finding a representative image (e.g., "tomato spinach pasta garlic herbs").
  - "notes" (optional): Any brief additional notes, like "Ready in 20 minutes" or "Good for a light lunch."
- If some ingredients seem incompatible or insufficient for a full meal, try to make the best suggestions possible or note limitations.
- Focus on creative and practical meal ideas.

JSON Structure:
{
  "planTitle": "Meal Ideas from: \${ingredientsPreview}",
  "userInputIngredients": ["ingredient1", "ingredient2", "etc."],
  "content": [
    {
      "mealName": "e.g., Speedy Chicken Stir-fry",
      "description": "A quick and flavorful stir-fry using your chicken and vegetables.",
      "estimatedCalories": 450,
      "keyIngredients": ["Chicken", "Broccoli", "Soy Sauce"],
      "recipeHighlights": [
        "Slice chicken and chop broccoli.",
        "Stir-fry chicken until cooked, add broccoli.",
        "Season with soy sauce and other spices you have."
      ],
      "imageSearchQuery": "chicken broccoli stir fry soy sauce",
      "notes": "Serve with rice or noodles if available."
    },
    {
      "mealName": "e.g., Cheesy Veggie Omelette",
      "description": "A simple omelette packed with your available vegetables and cheese.",
      "estimatedCalories": 300,
      "keyIngredients": ["Eggs", "Cheese", "Spinach", "Mushrooms"],
      "recipeHighlights": [
        "Whisk eggs.",
        "Sauté mushrooms and spinach.",
        "Pour eggs into pan, add veggies and cheese, cook until set."
      ],
      "imageSearchQuery": "cheese vegetable omelette spinach mushroom",
      "notes": "Great for breakfast or a light meal."
    }
    // ... potentially 1-2 more suggestions
  ],
  "notes": "These suggestions are based on the ingredients you provided. You might need other common pantry staples like oil, salt, pepper, etc."
}

Ensure the JSON is valid and complete.
`;
