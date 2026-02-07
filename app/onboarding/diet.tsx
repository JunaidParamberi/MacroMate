import { OnboardingProgressBar } from '@/components/onboarding/OnboardingProgressBar';
import { SelectionCard } from '@/components/onboarding/SelectionCard';
import { StepContainer } from '@/components/onboarding/StepContainer';
import { useUserProfileStore } from '@/store/userProfile';
import { useRouter } from 'expo-router';
import React from 'react';

const dietOptions = [
  { key: 'vegan' as const, title: 'Vegan', subtitle: 'Plant-based, no animal products', icon: 'leaf' },
  { key: 'vegetarian' as const, title: 'Vegetarian', subtitle: 'No meat, may include dairy/eggs', icon: 'egg' },
  { key: 'pescatarian' as const, title: 'Pescatarian', subtitle: 'Fish and seafood, no other meat', icon: 'fish' },
  { key: 'keto' as const, title: 'Keto', subtitle: 'High fat, very low carb', icon: 'flash' },
  { key: 'paleo' as const, title: 'Paleo', subtitle: 'Whole foods, hunter-gatherer style', icon: 'bonfire' },
  { key: 'mediterranean' as const, title: 'Mediterranean', subtitle: 'Whole grains, olive oil, fish', icon: 'sunny' },
  { key: 'highProtein' as const, title: 'High Protein', subtitle: 'Prioritize muscle building', icon: 'barbell' },
  { key: 'lowCarb' as const, title: 'Low Carb', subtitle: 'Fewer carbs, moderate protein/fat', icon: 'trending-down' },
  { key: 'lowFat' as const, title: 'Low Fat', subtitle: 'Reduced fat intake', icon: 'water' },
  { key: 'glutenFree' as const, title: 'Gluten-Free', subtitle: 'No wheat, barley, or rye', icon: 'nutrition' },
  { key: 'dairyFree' as const, title: 'Dairy-Free', subtitle: 'No milk or dairy derivatives', icon: 'close-circle' },
  { key: 'whole30' as const, title: 'Whole30', subtitle: '30-day elimination diet', icon: 'calendar' },
];

export default function DietScreen() {
  const router = useRouter();
  const { dietPreferences, setDietPreference } = useUserProfileStore();

  const handleContinue = () => {
    router.push('/onboarding/target-weight');
  };

  return (
    <StepContainer
      title="Any preferences or allergies?"
      subtitle="Select all that apply. We'll tailor your meal plans accordingly."
      currentStep={7}
      totalSteps={12}
      onContinue={handleContinue}
      canContinue={true}
      continueText="Continue"
      progressBar={<OnboardingProgressBar currentStep={7} totalSteps={12} />}
    >
      {dietOptions.map((option) => (
        <SelectionCard
          key={option.key}
          title={option.title}
          subtitle={option.subtitle}
          icon={option.icon}
          isSelected={dietPreferences[option.key]}
          onPress={() => setDietPreference(option.key, !dietPreferences[option.key])}
        />
      ))}
    </StepContainer>
  );
}
