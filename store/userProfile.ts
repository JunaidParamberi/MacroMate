import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type PrimaryGoal = 'lose_weight' | 'maintain_weight' | 'build_muscle' | 'improve_endurance';
export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';
export type BiologicalSex = 'male' | 'female';
export type BodyFatRange = '10-14' | '15-19' | '20-24' | '25-29' | 'unknown';
export type WeeklyPace = 'conservative' | 'moderate' | 'aggressive';
export type MealPlan = 'balanced' | 'lowCarb' | 'highProtein' | 'intermittent' | 'vegetarian';
export type LifeEvent = 'vacation' | 'competition' | 'important_date' | 'outdoor_adventure' | 'birthday' | 'holiday' | 'wedding' | 'graduation' | 'reunion' | 'marathon' | 'photo_shoot' | 'job_interview' | 'honeymoon' | 'anniversary' | 'festival' | 'convention' | 'trade_show' | 'exhibition' | 'sporting_event' | 'concert' | 'show' | 'none';
export type Lifestyle = 'very_healthy' | 'some_healthy' | 'average' | 'needs_improvement';
export type Allergy = 'none' | 'dairy' | 'gluten' | 'nuts' | 'shellfish' | 'eggs' | 'soy' | 'other';

export interface DietPreferences {
  vegan: boolean;
  keto: boolean;
  paleo: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  highProtein: boolean;
  lowCarb: boolean;
  lowFat: boolean;
  pescatarian: boolean;
  vegetarian: boolean;
  mediterranean: boolean;
  whole30: boolean;
}

export interface LifeEventData {
  type: LifeEvent;
  date: Date | null;
  title: string | null;
}

export interface NotificationSettings {
  mealReminders: boolean;
  workoutLogging: boolean;
  weeklyReports: boolean;
}

export interface UserProfile {
  // Onboarding completion
  hasCompletedOnboarding: boolean;
  
  // Step 1: Primary Goal
  primaryGoal: PrimaryGoal | null;
  
  // Step 2: Weight & Height
  currentWeight: number;
  weightUnit: 'kg' | 'lbs';
  height: number; // stored in cm
  heightUnit: 'cm' | 'ft';
  bmi: number;
  bmiCategory: 'underweight' | 'normal' | 'overweight' | 'obese';
  
  // Step 3: Activity Level
  activityLevel: ActivityLevel | null;
  
  // Step 4: Biological Sex
  biologicalSex: BiologicalSex | null;
  
  // Step 5: Date of Birth
  dateOfBirth: Date | null;
  
  // Step 6: Body Fat
  bodyFatRange: BodyFatRange | null;
  
  // Step 6b: Lifestyle & Allergies
  lifestyle: Lifestyle | null;
  allergies: Allergy[];
  
  // Step 7: Diet Preferences
  dietPreferences: DietPreferences;
  
  // Step 8: Target Weight
  targetWeight: number;
  weeklyPace: WeeklyPace;
  
  // Step 8b: Life Events
  lifeEvent: LifeEventData | null;
  
  // Step 9: Meal Plan
  mealPlan: MealPlan | null;
  
  // Step 10: Notifications
  notifications: NotificationSettings;
  
  // Calculated Data
  dailyCalorieTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatsTarget: number;
  projectedMilestone: string | null;
  estimatedGoalDate: Date | null;
  
  // Stats
  streakDays: number;
}

export interface UserProfileStore extends UserProfile {
  // Hydration state
  isHydrated: boolean;
  
  // Setters
  setHasCompletedOnboarding: (completed: boolean) => void;
  setPrimaryGoal: (goal: PrimaryGoal) => void;
  setWeight: (weight: number, unit: 'kg' | 'lbs') => void;
  setHeight: (height: number, unit: 'cm' | 'ft') => void;
  calculateBMI: () => void;
  setActivityLevel: (level: ActivityLevel) => void;
  setBiologicalSex: (sex: BiologicalSex) => void;
  setDateOfBirth: (date: Date) => void;
  setBodyFatRange: (range: BodyFatRange) => void;
  setLifestyle: (lifestyle: Lifestyle) => void;
  setAllergies: (allergies: Allergy[]) => void;
  setDietPreference: (key: keyof DietPreferences, value: boolean) => void;
  setTargetWeight: (weight: number) => void;
  setWeeklyPace: (pace: WeeklyPace) => void;
  setLifeEvent: (event: LifeEventData) => void;
  setMealPlan: (plan: MealPlan) => void;
  setNotification: (key: keyof NotificationSettings, value: boolean) => void;
  
  // Calculations
  calculateNutritionTargets: () => void;
  
  // Reset
  resetProfile: () => void;
}

const defaultDietPreferences: DietPreferences = {
  vegan: false,
  keto: false,
  paleo: false,
  glutenFree: false,
  dairyFree: false,
  highProtein: false,
  lowCarb: false,
  lowFat: false,
  pescatarian: false,
  vegetarian: false,
  mediterranean: false,
  whole30: false,
};

const defaultNotifications: NotificationSettings = {
  mealReminders: true,
  workoutLogging: true,
  weeklyReports: false,
};

const initialState: Omit<UserProfile, 'dateOfBirth' | 'estimatedGoalDate'> & { dateOfBirth: string | null; estimatedGoalDate: string | null; isHydrated: boolean } = {
  hasCompletedOnboarding: false,
  primaryGoal: null,
  currentWeight: 75,
  weightUnit: 'kg',
  height: 175,
  heightUnit: 'cm',
  bmi: 24.5,
  bmiCategory: 'normal',
  activityLevel: null,
  biologicalSex: null,
  dateOfBirth: null,
  bodyFatRange: null,
  lifestyle: null,
  allergies: ['none'],
  dietPreferences: defaultDietPreferences,
  targetWeight: 68,
  weeklyPace: 'moderate',
  lifeEvent: null,
  mealPlan: null,
  notifications: defaultNotifications,
  dailyCalorieTarget: 2450,
  proteinTarget: 185,
  carbsTarget: 240,
  fatsTarget: 82,
  projectedMilestone: '-4kg in 30 days',
  estimatedGoalDate: null,
  streakDays: 1,
  isHydrated: false,
};

// TDEE multipliers based on activity level
const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
};

export const useUserProfileStore = create<UserProfileStore>()(
  persist(
    (set, get) => ({
      ...(initialState as UserProfile),
      isHydrated: false,
      
      setHasCompletedOnboarding: (completed) => set({ hasCompletedOnboarding: completed }),
      
      setPrimaryGoal: (goal) => set({ primaryGoal: goal }),
      
      setWeight: (weight, unit) => set({ currentWeight: weight, weightUnit: unit }),
      
      setHeight: (height, unit) => set({ height, heightUnit: unit }),
      
      calculateBMI: () => {
        const state = get();
        const weightKg = state.weightUnit === 'lbs' ? state.currentWeight * 0.453592 : state.currentWeight;
        const heightM = state.height / 100;
        const bmi = weightKg / (heightM * heightM);
        
        let category: 'underweight' | 'normal' | 'overweight' | 'obese';
        if (bmi < 18.5) category = 'underweight';
        else if (bmi < 25) category = 'normal';
        else if (bmi < 30) category = 'overweight';
        else category = 'obese';
        
        set({ bmi: Math.round(bmi * 10) / 10, bmiCategory: category });
      },
      
      setActivityLevel: (level) => set({ activityLevel: level }),
      
      setBiologicalSex: (sex) => set({ biologicalSex: sex }),
      
      setDateOfBirth: (date) => set({ dateOfBirth: date }),
      
      setBodyFatRange: (range) => set({ bodyFatRange: range }),
      
      setLifestyle: (lifestyle) => set({ lifestyle }),
      
      setAllergies: (allergies) => set({ allergies }),
      
      setDietPreference: (key, value) => 
        set((state) => ({
          dietPreferences: { ...state.dietPreferences, [key]: value }
        })),
      
      setTargetWeight: (weight) => set({ targetWeight: weight }),
      
      setWeeklyPace: (pace) => set({ weeklyPace: pace }),
      
      setLifeEvent: (event) => set({ lifeEvent: event }),
      
      setMealPlan: (plan) => set({ mealPlan: plan }),
      
      setNotification: (key, value) => 
        set((state) => ({
          notifications: { ...state.notifications, [key]: value }
        })),
      
      calculateNutritionTargets: () => {
        const state = get();
        if (!state.biologicalSex || !state.activityLevel || !state.dateOfBirth) return;
        
        // Convert weight to kg if needed
        const weightKg = state.weightUnit === 'lbs' ? state.currentWeight * 0.453592 : state.currentWeight;
        const targetWeightKg = state.weightUnit === 'lbs' ? state.targetWeight * 0.453592 : state.targetWeight;
        
        // Calculate age
        const age = new Date().getFullYear() - state.dateOfBirth.getFullYear();
        
        // Estimate height (average if not provided)
        const heightCm = state.biologicalSex === 'male' ? 175 : 162;
        
        // Mifflin-St Jeor Equation for BMR
        let bmr: number;
        if (state.biologicalSex === 'male') {
          bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
        } else {
          bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
        }
        
        // Calculate TDEE
        const tdee = Math.round(bmr * activityMultipliers[state.activityLevel]);
        
        // Adjust for goal
        let calorieTarget = tdee;
        const weightDiff = weightKg - targetWeightKg;
        
        if (state.primaryGoal === 'lose_weight') {
          // Deficit based on weekly pace
          const weeklyDeficit = state.weeklyPace === 'conservative' ? 250 
            : state.weeklyPace === 'moderate' ? 500 
            : 750;
          calorieTarget = tdee - weeklyDeficit;
        } else if (state.primaryGoal === 'build_muscle') {
          calorieTarget = tdee + 300; // Surplus for muscle gain
        } else if (state.primaryGoal === 'improve_endurance') {
          calorieTarget = tdee + 100; // Slight surplus for training
        }
        
        // Macronutrient targets
        let proteinRatio = 0.30;
        let fatRatio = 0.30;
        let carbsRatio = 0.40;
        
        // Adjust macros based on goal
        if (state.primaryGoal === 'lose_weight') {
          proteinRatio = 0.40; // Higher protein for muscle preservation
          fatRatio = 0.30;
          carbsRatio = 0.30;
        } else if (state.primaryGoal === 'build_muscle') {
          proteinRatio = 0.35;
          fatRatio = 0.25;
          carbsRatio = 0.40;
        } else if (state.dietPreferences.keto) {
          proteinRatio = 0.25;
          fatRatio = 0.70;
          carbsRatio = 0.05;
        }
        
        const proteinTarget = Math.round((calorieTarget * proteinRatio) / 4);
        const fatsTarget = Math.round((calorieTarget * fatRatio) / 9);
        const carbsTarget = Math.round((calorieTarget * carbsRatio) / 4);
        
        // Calculate projected milestone
        const weeklyLossKg = state.weeklyPace === 'conservative' ? 0.25 
          : state.weeklyPace === 'moderate' ? 0.5 
          : 0.75;
        const weeksToGoal = Math.abs(weightDiff) / weeklyLossKg;
        const goalDate = new Date();
        goalDate.setDate(goalDate.getDate() + weeksToGoal * 7);
        
        // 30 day projection
        const thirtyDayLoss = Math.min(weightDiff, weeklyLossKg * 4.3);
        const projectedMilestone = weightDiff > 0 
          ? `-${Math.round(thirtyDayLoss * 10) / 10}kg in 30 days`
          : null;
        
        set({
          dailyCalorieTarget: Math.max(1200, Math.round(calorieTarget)),
          proteinTarget,
          carbsTarget,
          fatsTarget,
          projectedMilestone,
          estimatedGoalDate: goalDate,
        });
      },
      
      resetProfile: () => set(initialState as UserProfile),
    }),
    {
      name: 'user-profile-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        ...state,
        dateOfBirth: state.dateOfBirth ? state.dateOfBirth.toISOString() : null,
        estimatedGoalDate: state.estimatedGoalDate ? state.estimatedGoalDate.toISOString() : null,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Convert date strings back to Date objects
          if (typeof state.dateOfBirth === 'string') {
            state.dateOfBirth = new Date(state.dateOfBirth);
          }
          if (typeof state.estimatedGoalDate === 'string') {
            state.estimatedGoalDate = new Date(state.estimatedGoalDate);
          }
          // Mark as hydrated
          state.isHydrated = true;
        }
      },
    }
  )
);
