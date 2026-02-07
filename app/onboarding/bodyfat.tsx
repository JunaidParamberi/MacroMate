import { OnboardingProgressBar } from '@/components/onboarding/OnboardingProgressBar';
import { StepContainer } from '@/components/onboarding/StepContainer';
import { Typography } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { BodyFatRange, useUserProfileStore } from '@/store/userProfile';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';

const bodyFatRanges = [
  { value: '10-14', label: '10-14%', description: 'Lean / Athletic', icon: 'body' },
  { value: '15-19', label: '15-19%', description: 'Defined / Fit', icon: 'body' },
  { value: '20-24', label: '20-24%', description: 'Average', icon: 'body' },
  { value: '25-29', label: '25-29%', description: 'Soft', icon: 'body' },
  { value: 'unknown', label: 'I don\'t know', description: 'We\'ll estimate based on other data', icon: 'help-circle' },
];

export default function BodyFatScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);
  const { bodyFatRange, setBodyFatRange } = useUserProfileStore();

  const handleContinue = () => {
    router.push('/onboarding/lifestyle');
  };

  return (
    <StepContainer
      title="Estimate your body fat"
      subtitle="Select the range that most closely matches your current physique. This helps refine your calorie target."
      currentStep={6}
      totalSteps={12}
      onContinue={handleContinue}
      canContinue={!!bodyFatRange}
      progressBar={<OnboardingProgressBar currentStep={6} totalSteps={12} />}
    >
      <View style={styles.grid}>
        {bodyFatRanges.map((range) => (
          <Pressable
            key={range.value}
            style={[
              styles.card, 
              { 
                backgroundColor: bodyFatRange === range.value 
                  ? Colors.brand.primary + '08' 
                  : isDark ? Colors.neutral[800] : Colors.neutral.white,
                borderColor: bodyFatRange === range.value 
                  ? Colors.brand.primary 
                  : isDark ? Colors.neutral[700] : Colors.neutral[200],
              }
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setBodyFatRange(range.value as BodyFatRange);
            }}
          >
            <View style={[styles.iconContainer, { backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[100] }]}>
              <Ionicons 
                name={range.icon as any} 
                size={32} 
                color={bodyFatRange === range.value ? Colors.brand.primary : isDark ? Colors.neutral[400] : Colors.neutral[500]} 
              />
            </View>
            <Typography 
              variant="bodyText" 
              style={{ 
                fontSize: 16, 
                fontWeight: '700', 
                marginBottom: 4,
                color: bodyFatRange === range.value ? Colors.brand.primary : isDark ? Colors.neutral[100] : Colors.neutral[900]
              }}
            >
              {range.label}
            </Typography>
            <Typography 
              variant="caption" 
              style={{ fontSize: 12, color: isDark ? Colors.neutral[400] : Colors.neutral[500], textAlign: 'center' }}
            >
              {range.description}
            </Typography>
            {bodyFatRange === range.value && (
              <View style={styles.checkmark}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.brand.primary} />
              </View>
            )}
          </Pressable>
        ))}
      </View>
    </StepContainer>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: 20,
  },
  card: {
    width: '47%',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkmark: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
});
