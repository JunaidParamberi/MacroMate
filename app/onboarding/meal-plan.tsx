import { OnboardingProgressBar } from '@/components/onboarding/OnboardingProgressBar';
import { SelectionCard } from '@/components/onboarding/SelectionCard';
import { StepContainer } from '@/components/onboarding/StepContainer';
import { useUserProfileStore } from '@/store/userProfile';
import { useRouter } from 'expo-router';
import React from 'react';

const mealPlans = [
  { key: 'balanced' as const, title: 'Balanced', subtitle: 'Moderate carbs, fats and proteins', icon: 'restaurant' },
  { key: 'lowCarb' as const, title: 'Low Carb', subtitle: 'Higher protein, fewer carbs', icon: 'egg' },
  { key: 'highProtein' as const, title: 'High Protein', subtitle: 'Prioritize muscle building', icon: 'barbell' },
  { key: 'intermittent' as const, title: 'Intermittent', subtitle: 'Time-restricted eating', icon: 'time' },
  { key: 'vegetarian' as const, title: 'Vegetarian', subtitle: 'Plant-forward meals', icon: 'leaf' },
];

export default function MealPlanScreen() {
  const router = useRouter();
  const { mealPlan, setMealPlan } = useUserProfileStore();

  const handleContinue = () => {
    router.push('/onboarding/plan-preview');
  };

  return (
    <StepContainer
      title="Choose a meal plan"
      subtitle="Select the approach that matches your lifestyle."
      currentStep={11}
      totalSteps={12}
      onContinue={handleContinue}
      canContinue={true}
      continueText="Continue"
      progressBar={<OnboardingProgressBar currentStep={11} totalSteps={12} />}
    >
      {mealPlans.map((plan) => (
        <SelectionCard
          key={plan.key}
          title={plan.title}
          subtitle={plan.subtitle}
          icon={plan.icon}
          isSelected={mealPlan === plan.key}
          onPress={() => setMealPlan(plan.key)}
        />
      ))}
    </StepContainer>
  );
}
