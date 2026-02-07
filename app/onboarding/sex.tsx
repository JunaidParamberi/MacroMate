import { OnboardingProgressBar } from '@/components/onboarding/OnboardingProgressBar';
import { SelectionCard } from '@/components/onboarding/SelectionCard';
import { StepContainer } from '@/components/onboarding/StepContainer';
import { BiologicalSex, useUserProfileStore } from '@/store/userProfile';
import { useRouter } from 'expo-router';
import React from 'react';

const sexes: { value: BiologicalSex; title: string; icon: string }[] = [
  { value: 'male', title: 'Male', icon: 'male' },
  { value: 'female', title: 'Female', icon: 'female' },
];

export default function SexScreen() {
  const router = useRouter();
  const { biologicalSex, setBiologicalSex } = useUserProfileStore();

  const handleContinue = () => {
    router.push('/onboarding/dob');
  };

  return (
    <StepContainer
      title="What is your biological sex?"
      subtitle="We use this to calculate your basal metabolic rate and nutritional requirements."
      currentStep={4}
      totalSteps={10}
      onContinue={handleContinue}
      canContinue={!!biologicalSex}
      progressBar={<OnboardingProgressBar currentStep={4} totalSteps={10} />}
    >
      {sexes.map((sex) => (
        <SelectionCard
          key={sex.value}
          title={sex.title}
          icon={sex.icon}
          isSelected={biologicalSex === sex.value}
          onPress={() => setBiologicalSex(sex.value)}
        />
      ))}
    </StepContainer>
  );
}
