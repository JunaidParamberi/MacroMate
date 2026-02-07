import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  timestamp: string;
  imageUrl?: string;
  aiAnalyzed?: boolean;
}

export interface ExerciseItem {
  id: string;
  name: string;
  calories: number;
  duration: number;
  type: 'cardio' | 'strength' | 'sports';
  timestamp: string;
}

interface DailyLogState {
  // Current day data (YYYY-MM-DD as key)
  foodLogs: Record<string, FoodItem[]>;
  exerciseLogs: Record<string, ExerciseItem[]>;
  waterIntake: Record<string, number>; // ml
  steps: Record<string, number>;
  activeMinutes: Record<string, number>;
  
  // Current date tracking
  currentDate: string;
  
  // Actions
  addFood: (food: Omit<FoodItem, 'id' | 'timestamp'>, date?: string) => void;
  removeFood: (foodId: string, date?: string) => void;
  addExercise: (exercise: Omit<ExerciseItem, 'id' | 'timestamp'>, date?: string) => void;
  removeExercise: (exerciseId: string, date?: string) => void;
  addWater: (amount: number, date?: string) => void;
  setWater: (amount: number, date?: string) => void;
  addSteps: (amount: number, date?: string) => void;
  setSteps: (amount: number, date?: string) => void;
  addActiveMinutes: (amount: number, date?: string) => void;
  setActiveMinutes: (amount: number, date?: string) => void;
  
  // Getters for current day
  getTodaysFood: () => FoodItem[];
  getTodaysExercise: () => ExerciseItem[];
  getTodaysWater: () => number;
  getTodaysSteps: () => number;
  getTodaysActiveMinutes: () => number;
  getTodaysTotals: () => { calories: number; protein: number; carbs: number; fats: number; exercise: number };
  
  // Hydration
  isHydrated: boolean;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const getTodayKey = () => new Date().toISOString().split('T')[0];

export const useDailyLogStore = create<DailyLogState>()(
  persist(
    (set, get) => ({
      foodLogs: {},
      exerciseLogs: {},
      waterIntake: {},
      steps: {},
      activeMinutes: {},
      currentDate: getTodayKey(),
      isHydrated: false,

      addFood: (food, date = getTodayKey()) => {
        const newFood: FoodItem = {
          ...food,
          id: generateId(),
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          foodLogs: {
            ...state.foodLogs,
            [date]: [...(state.foodLogs[date] || []), newFood],
          },
        }));
      },

      removeFood: (foodId, date = getTodayKey()) => {
        set((state) => ({
          foodLogs: {
            ...state.foodLogs,
            [date]: (state.foodLogs[date] || []).filter((f) => f.id !== foodId),
          },
        }));
      },

      addExercise: (exercise, date = getTodayKey()) => {
        const newExercise: ExerciseItem = {
          ...exercise,
          id: generateId(),
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          exerciseLogs: {
            ...state.exerciseLogs,
            [date]: [...(state.exerciseLogs[date] || []), newExercise],
          },
        }));
      },

      removeExercise: (exerciseId, date = getTodayKey()) => {
        set((state) => ({
          exerciseLogs: {
            ...state.exerciseLogs,
            [date]: (state.exerciseLogs[date] || []).filter((e) => e.id !== exerciseId),
          },
        }));
      },

      addWater: (amount, date = getTodayKey()) => {
        set((state) => ({
          waterIntake: {
            ...state.waterIntake,
            [date]: (state.waterIntake[date] || 0) + amount,
          },
        }));
      },

      setWater: (amount, date = getTodayKey()) => {
        set((state) => ({
          waterIntake: {
            ...state.waterIntake,
            [date]: amount,
          },
        }));
      },

      addSteps: (amount, date = getTodayKey()) => {
        set((state) => ({
          steps: {
            ...state.steps,
            [date]: (state.steps[date] || 0) + amount,
          },
        }));
      },

      setSteps: (amount, date = getTodayKey()) => {
        set((state) => ({
          steps: {
            ...state.steps,
            [date]: amount,
          },
        }));
      },

      addActiveMinutes: (amount, date = getTodayKey()) => {
        set((state) => ({
          activeMinutes: {
            ...state.activeMinutes,
            [date]: (state.activeMinutes[date] || 0) + amount,
          },
        }));
      },

      setActiveMinutes: (amount, date = getTodayKey()) => {
        set((state) => ({
          activeMinutes: {
            ...state.activeMinutes,
            [date]: amount,
          },
        }));
      },

      getTodaysFood: () => {
        const state = get();
        const today = getTodayKey();
        return state.foodLogs[today] || [];
      },

      getTodaysExercise: () => {
        const state = get();
        const today = getTodayKey();
        return state.exerciseLogs[today] || [];
      },

      getTodaysWater: () => {
        const state = get();
        const today = getTodayKey();
        return state.waterIntake[today] || 0;
      },

      getTodaysSteps: () => {
        const state = get();
        const today = getTodayKey();
        return state.steps[today] || 0;
      },

      getTodaysActiveMinutes: () => {
        const state = get();
        const today = getTodayKey();
        return state.activeMinutes[today] || 0;
      },

      getTodaysTotals: () => {
        const food = get().getTodaysFood();
        const exercise = get().getTodaysExercise();
        
        return {
          calories: food.reduce((sum, f) => sum + f.calories, 0),
          protein: food.reduce((sum, f) => sum + f.protein, 0),
          carbs: food.reduce((sum, f) => sum + f.carbs, 0),
          fats: food.reduce((sum, f) => sum + f.fats, 0),
          exercise: exercise.reduce((sum, e) => sum + e.calories, 0),
        };
      },
    }),
    {
      name: 'macromate-daily-log',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
        }
      },
    }
  )
);
