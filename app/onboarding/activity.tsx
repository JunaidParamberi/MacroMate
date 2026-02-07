import { OnboardingProgressBar } from '@/components/onboarding/OnboardingProgressBar';
import { SelectionCard } from '@/components/onboarding/SelectionCard';
import { StepContainer } from '@/components/onboarding/StepContainer';
import { ActivityLevel, useUserProfileStore } from '@/store/userProfile';
import { useRouter } from 'expo-router';
import React from 'react';

const activityLevels: { value: ActivityLevel; title: string; subtitle: string; icon: string }[] = [
  { value: 'sedentary', title: 'Sedentary', subtitle: 'Little or no exercise, desk job', icon: 'desktop' },
  { value: 'lightly_active', title: 'Lightly Active', subtitle: 'Light exercise 1-3 days/week', icon: 'walk' },
  { value: 'moderately_active', title: 'Moderately Active', subtitle: 'Moderate exercise 3-5 days/week', icon: 'bicycle' },
  { value: 'very_active', title: 'Very Active', subtitle: 'Hard exercise 6-7 days/week', icon: 'fitness' },
];

export default function ActivityScreen() {
  const router = useRouter();
  const { activityLevel, setActivityLevel } = useUserProfileStore();

  const handleContinue = () => {
    router.push('/onboarding/sex');
  };

  return (
    <StepContainer
      title="What is your activity level?"
      subtitle="This helps us calculate your daily calorie needs more accurately based on your lifestyle."
      currentStep={3}
      totalSteps={10}
      onContinue={handleContinue}
      canContinue={!!activityLevel}
      progressBar={<OnboardingProgressBar currentStep={3} totalSteps={10} />}
    >
      {activityLevels.map((level) => (
        <SelectionCard
          key={level.value}
          title={level.title}
          subtitle={level.subtitle}
          icon={level.icon}
          isSelected={activityLevel === level.value}
          onPress={() => setActivityLevel(level.value)}
        />
      ))}
    </StepContainer>
  );
}
