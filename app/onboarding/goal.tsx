import { OnboardingProgressBar } from '@/components/onboarding/OnboardingProgressBar';
import { SelectionCard } from '@/components/onboarding/SelectionCard';
import { StepContainer } from '@/components/onboarding/StepContainer';
import { PrimaryGoal, useUserProfileStore } from '@/store/userProfile';
import { useRouter } from 'expo-router';
import React from 'react';

const goals: { value: PrimaryGoal; title: string; subtitle: string; icon: string }[] = [
  { value: 'lose_weight', title: 'Lose Weight', subtitle: 'Burn fat and get lean', icon: 'trending-down' },
  { value: 'maintain_weight', title: 'Maintain Weight', subtitle: 'Stay fit and healthy', icon: 'fitness' },
  { value: 'build_muscle', title: 'Build Muscle', subtitle: 'Gain mass and strength', icon: 'barbell' },
  { value: 'improve_endurance', title: 'Improve Endurance', subtitle: 'Run further, longer', icon: 'bicycle' },
];

export default function GoalScreen() {
  const router = useRouter();
  const { primaryGoal, setPrimaryGoal } = useUserProfileStore();

  const handleContinue = () => {
    router.push('/onboarding/weight');
  };

  return (
    <StepContainer
      title="What's your primary goal?"
      subtitle="Select the one that best describes your focus. We'll personalize your plan based on this."
      currentStep={1}
      totalSteps={10}
      onContinue={handleContinue}
      canContinue={!!primaryGoal}
      progressBar={<OnboardingProgressBar currentStep={1} totalSteps={10} />}
      showBackButton={false}
    >
      {goals.map((goal) => (
        <SelectionCard
          key={goal.value}
          title={goal.title}
          subtitle={goal.subtitle}
          icon={goal.icon}
          isSelected={primaryGoal === goal.value}
          onPress={() => setPrimaryGoal(goal.value)}
        />
      ))}
    </StepContainer>
  );
}
