import { GoogleGenAI } from '@google/genai';

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('Gemini API key not found');
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export interface MealAnalysis {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  confidence: 'high' | 'medium' | 'low';
  explanation: string;
}

export interface DailyInsight {
  title: string;
  message: string;
  action?: string;
  type: 'tip' | 'warning' | 'achievement' | 'suggestion';
}

export interface MealSuggestion {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  description: string;
  why: string;
}

const MODEL_NAME = 'gemini-2.0-flash';

class GeminiService {
  async analyzeMealFromText(description: string): Promise<MealAnalysis> {
    if (!ai) {
      throw new Error('Gemini API not initialized');
    }
    
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `Analyze this food/meal and provide nutritional information. Be realistic and accurate for ANY type of cuisine (Indian, Asian, Western, Mediterranean, etc.).

Food: "${description}"

Respond ONLY with a JSON object in this exact format:
{
  "foodName": "specific name of the food",
  "calories": number (kcal),
  "protein": number (grams),
  "carbs": number (grams),
  "fats": number (grams),
  "confidence": "high" | "medium" | "low",
  "explanation": "brief explanation of your estimate"
}

Examples:
- "burger" → Standard beef burger with bun
- "fried chicken" → 1 piece crispy fried chicken
- "pappadam" → Indian lentil cracker
- "mutton curry" → Indian goat meat curry with gravy
- "rice" → 1 cup cooked white rice
- "dosa" → Indian rice crepe
- "pad thai" → Thai noodle dish

Rules:
- Use realistic portion sizes if not specified (assume 1 serving)
- Be conservative with calorie estimates
- If uncertain, use lower confidence level
- Always provide your best estimate even for vague descriptions`,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{}';
      const result = JSON.parse(text);
      
      // Validate the result has required fields
      if (!result.foodName || !result.calories) {
        throw new Error('Invalid AI response structure');
      }
      
      return result;
    } catch (error) {
      console.error('Meal analysis error:', error);
      // Return a reasonable fallback based on description length/complexity
      const desc = description.toLowerCase();
      
      // Simple heuristic for fallback calories
      let fallbackCalories = 300;
      let fallbackProtein = 15;
      let fallbackCarbs = 35;
      let fallbackFat = 12;
      
      if (desc.includes('burger') || desc.includes('pizza') || desc.includes('fries')) {
        fallbackCalories = 450; fallbackProtein = 20; fallbackCarbs = 45; fallbackFat = 22;
      } else if (desc.includes('salad') || desc.includes('vegetable')) {
        fallbackCalories = 150; fallbackProtein = 5; fallbackCarbs = 20; fallbackFat = 8;
      } else if (desc.includes('chicken') || desc.includes('meat') || desc.includes('curry')) {
        fallbackCalories = 350; fallbackProtein = 30; fallbackCarbs = 15; fallbackFat = 18;
      } else if (desc.includes('rice') || desc.includes('noodle') || desc.includes('pasta')) {
        fallbackCalories = 300; fallbackProtein = 8; fallbackCarbs = 55; fallbackFat = 6;
      }
      
      return {
        foodName: description,
        calories: fallbackCalories,
        protein: fallbackProtein,
        carbs: fallbackCarbs,
        fats: fallbackFat,
        confidence: 'medium',
        explanation: 'Estimated based on food type - AI analysis encountered an issue',
      };
    }
  }

  async analyzeMealFromImage(base64Image: string, mimeType: string): Promise<MealAnalysis> {
    if (!ai) {
      throw new Error('Gemini API not initialized');
    }

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: {
          parts: [
            { inlineData: { data: base64Image, mimeType } },
            { text: `Look at this food image and provide nutritional information. Be realistic and accurate.

Respond ONLY with a JSON object:
{
  "foodName": "specific name of the food you see",
  "calories": number (kcal),
  "protein": number (grams),
  "carbs": number (grams),
  "fats": number (grams),
  "confidence": "high" | "medium" | "low",
  "explanation": "brief explanation of what you see and your estimate"
}

Rules:
- Estimate portion size based on typical serving
- Be conservative with calorie estimates
- If image is unclear, use lower confidence level` }
          ]
        },
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{}';
      return JSON.parse(text);
    } catch (error) {
      console.error('Image analysis error:', error);
      return {
        foodName: 'Unknown Food',
        calories: 300,
        protein: 15,
        carbs: 35,
        fats: 12,
        confidence: 'low',
        explanation: 'Could not analyze image - AI unavailable',
      };
    }
  }

  async generateDailyInsight(userData: {
    goal: string;
    dailyCalories: number;
    consumedCalories: number;
    remainingCalories: number;
    proteinConsumed: number;
    proteinTarget: number;
    streakDays: number;
    weightProgress?: number;
  }): Promise<DailyInsight> {
    if (!ai) {
      throw new Error('Gemini API not initialized');
    }

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `Generate a personalized, encouraging daily insight for a fitness app user.

User Data:
- Goal: ${userData.goal}
- Daily calorie target: ${userData.dailyCalories}
- Calories consumed today: ${userData.consumedCalories}
- Remaining calories: ${userData.remainingCalories}
- Protein consumed: ${userData.proteinConsumed}g / ${userData.proteinTarget}g target
- Current streak: ${userData.streakDays} days
${userData.weightProgress ? `- Weight progress: ${userData.weightProgress > 0 ? '+' : ''}${userData.weightProgress}kg` : ''}

Respond ONLY with a JSON object:
{
  "title": "short catchy title (2-5 words)",
  "message": "personalized message (1-2 sentences max)",
  "action": "specific actionable suggestion (optional, 5-8 words)",
  "type": "tip" | "warning" | "achievement" | "suggestion"
}

Rules:
- Be encouraging but realistic
- Reference actual numbers when relevant
- Keep it short and actionable
- Use "suggestion" for meal ideas, "tip" for advice, "warning" if behind on goals, "achievement" if on track`,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '{}';
      return JSON.parse(text);
    } catch (error) {
      console.error('Insight generation error:', error);
      if (userData.remainingCalories < 200) {
        return {
          title: 'Almost There!',
          message: `You've used ${Math.round((userData.consumedCalories / userData.dailyCalories) * 100)}% of your calories. Great discipline!`,
          action: 'Plan a light evening snack',
          type: 'achievement',
        };
      }
      if (userData.proteinConsumed < userData.proteinTarget * 0.5) {
        return {
          title: 'Protein Focus Needed',
          message: `You've only hit ${Math.round((userData.proteinConsumed / userData.proteinTarget) * 100)}% of your protein goal.`,
          action: 'Add chicken, eggs, or Greek yogurt',
          type: 'warning',
        };
      }
      return {
        title: 'Keep It Up!',
        message: `You're ${Math.round((userData.consumedCalories / userData.dailyCalories) * 100)}% through your day with ${userData.remainingCalories} calories remaining.`,
        action: 'Stay consistent with your meals',
        type: 'tip',
      };
    }
  }

  async suggestMeals(context: {
    remainingCalories: number;
    remainingProtein: number;
    remainingCarbs: number;
    remainingFats: number;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    preferences?: string[];
    restrictions?: string[];
  }): Promise<MealSuggestion[]> {
    if (!ai) {
      throw new Error('Gemini API not initialized');
    }

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `Suggest 3 meal options that fit the user's remaining macros.

Context:
- Meal type: ${context.mealType}
- Remaining calories: ${context.remainingCalories}
- Remaining protein: ${context.remainingProtein}g
- Remaining carbs: ${context.remainingCarbs}g  
- Remaining fats: ${context.remainingFats}g
${context.preferences?.length ? `- Preferences: ${context.preferences.join(', ')}` : ''}
${context.restrictions?.length ? `- Restrictions: ${context.restrictions.join(', ')}` : ''}

Respond ONLY with a JSON array of 3 meals:
[
  {
    "name": "meal name",
    "calories": number,
    "protein": number,
    "carbs": number,
    "fats": number,
    "description": "brief description with portion",
    "why": "why this fits their macros"
  }
]

Rules:
- Each meal should be realistic and appetizing
- Totals should fit within remaining macros
- Provide variety (different cuisines/proteins)
- Be specific with portions`,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const text = response.text || '[]';
      return JSON.parse(text);
    } catch (error) {
      console.error('Meal suggestion error:', error);
      return [
        {
          name: 'Grilled Chicken Salad',
          calories: 350,
          protein: 35,
          carbs: 15,
          fats: 18,
          description: '200g grilled chicken breast with mixed greens and olive oil dressing',
          why: 'High protein, moderate fats to keep you full',
        },
        {
          name: 'Greek Yogurt Bowl',
          calories: 280,
          protein: 20,
          carbs: 30,
          fats: 8,
          description: '200g Greek yogurt with berries and honey',
          why: 'Good balance of protein and carbs for energy',
        },
        {
          name: 'Egg White Omelette',
          calories: 250,
          protein: 25,
          carbs: 8,
          fats: 12,
          description: '3 egg whites + 1 whole egg with spinach and mushrooms',
          why: 'Low calorie, high protein option',
        },
      ];
    }
  }

  async generateWeeklySummary(stats: {
    totalCaloriesConsumed: number;
    calorieGoal: number;
    avgDailyCalories: number;
    totalWorkouts: number;
    weightChange?: number;
    goal: string;
  }): Promise<string> {
    if (!ai) {
      throw new Error('Gemini API not initialized');
    }

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `Generate a brief, encouraging weekly summary for a fitness app user.

Weekly Stats:
- Average daily calories: ${stats.avgDailyCalories} / goal ${stats.calorieGoal}
- Total workouts: ${stats.totalWorkouts}
- Goal: ${stats.goal}
${stats.weightChange !== undefined ? `- Weight change: ${stats.weightChange > 0 ? '+' : ''}${stats.weightChange}kg` : ''}

Respond with 2-3 sentences max. Be encouraging and specific about their progress. Keep it under 120 characters if possible.`,
      });

      return response.text?.trim() || `Great week! You averaged ${Math.round(stats.avgDailyCalories)} calories and completed ${stats.totalWorkouts} workouts. Keep pushing!`;
    } catch (error) {
      console.error('Weekly summary error:', error);
      return `Great week! You averaged ${Math.round(stats.avgDailyCalories)} calories and completed ${stats.totalWorkouts} workouts. Keep pushing!`;
    }
  }

  async chatWithTrainer(userMessage: string, userContext: string): Promise<string> {
    if (!ai) {
      throw new Error('Gemini API not initialized');
    }

    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: `You are an expert AI Fitness Trainer. Provide helpful, encouraging, and accurate fitness advice. Be conversational but professional.

User Context:
${userContext}

User Message: "${userMessage}"

Guidelines:
- Keep responses concise (2-4 sentences max)
- Be encouraging and motivational
- Reference their specific goals and progress when relevant
- Provide actionable advice
- If they ask about meals, suggest foods that fit their macros
- If they ask about workouts, consider their goals
- Be honest about what you can/cannot do

Respond naturally as a fitness trainer would.`,
        config: {
          temperature: 0.7,
          maxOutputTokens: 300,
        },
      });

      return response.text?.trim() || "I'm here to help with your fitness journey! What would you like to know?";
    } catch (error) {
      console.error('Trainer chat error:', error);
      return "I'm having trouble connecting right now. Try asking about your meal plan, workout ideas, or progress tracking!";
    }
  }
}

export const geminiService = new GeminiService();
export default geminiService;

