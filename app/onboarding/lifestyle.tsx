import { OnboardingProgressBar } from '@/components/onboarding/OnboardingProgressBar';
import { StepContainer } from '@/components/onboarding/StepContainer';
import { Typography } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { Allergy, Lifestyle, useUserProfileStore } from '@/store/userProfile';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

const lifestyleOptions: { value: Lifestyle; label: string; subtitle: string; icon: string }[] = [
  { value: 'very_healthy', label: 'Very Healthy', subtitle: 'I eat clean and exercise regularly', icon: '🥗' },
  { value: 'some_healthy', label: 'Some Healthy Habits', subtitle: 'I try to be healthy when I can', icon: '🌱' },
  { value: 'average', label: 'Average', subtitle: 'I have a balanced approach', icon: '⚖️' },
  { value: 'needs_improvement', label: 'Needs Improvement', subtitle: 'Looking to make changes', icon: '🔄' },
];

const allergyOptions: { value: Allergy; label: string; icon: string }[] = [
  { value: 'none', label: 'No allergies', icon: '✅' },
  { value: 'dairy', label: 'Dairy', icon: '🥛' },
  { value: 'gluten', label: 'Gluten', icon: '🌾' },
  { value: 'nuts', label: 'Nuts', icon: '🥜' },
  { value: 'shellfish', label: 'Shellfish', icon: '🦐' },
  { value: 'eggs', label: 'Eggs', icon: '🥚' },
  { value: 'soy', label: 'Soy', icon: '🫘' },
  { value: 'other', label: 'Other', icon: '⚠️' },
];

export default function LifestyleScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);
  const { lifestyle, allergies, setLifestyle, setAllergies } = useUserProfileStore();

  const [selectedLifestyle, setSelectedLifestyle] = useState<Lifestyle | null>(lifestyle);
  const [selectedAllergies, setSelectedAllergies] = useState<Allergy[]>(allergies || ['none']);

  const handleLifestyleSelect = (value: Lifestyle) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedLifestyle(value);
  };

  const handleAllergyToggle = (value: Allergy) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (value === 'none') {
      setSelectedAllergies(['none']);
    } else {
      setSelectedAllergies(prev => {
        const withoutNone = prev.filter(a => a !== 'none');
        if (prev.includes(value)) {
          const newAllergies = withoutNone.filter(a => a !== value);
          return newAllergies.length === 0 ? ['none'] : newAllergies;
        } else {
          return [...withoutNone, value];
        }
      });
    }
  };

  const handleContinue = () => {
    if (selectedLifestyle) {
      setLifestyle(selectedLifestyle);
      setAllergies(selectedAllergies);
      router.push('/onboarding/diet');
    }
  };

  const isContinueDisabled = !selectedLifestyle;

  return (
    <StepContainer
      title="Tell us about yourself"
      subtitle="This helps us personalize your meal plan and recommendations."
      currentStep={6}
      totalSteps={12}
      onContinue={handleContinue}
      canContinue={!isContinueDisabled}
      progressBar={<OnboardingProgressBar currentStep={6} totalSteps={12} />}
    >
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Lifestyle Section */}
        <View style={styles.section}>
          <Typography
            variant="bodyText"
            style={{
              fontSize: 16,
              fontWeight: '600',
              marginBottom: 12,
              color: isDark ? Colors.neutral[300] : Colors.neutral[700],
            }}
          >
            How would you describe your current lifestyle?
          </Typography>
          
          <View style={styles.optionsContainer}>
            {lifestyleOptions.map((option) => {
              const isSelected = selectedLifestyle === option.value;
              return (
                <Pressable
                  key={option.value}
                  style={[
                    styles.lifestyleCard,
                    {
                      backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[50],
                      borderColor: isSelected
                        ? Colors.brand.primary
                        : isDark
                        ? Colors.neutral[700]
                        : Colors.neutral[200],
                    },
                  ]}
                  onPress={() => handleLifestyleSelect(option.value)}
                >
                  <Typography style={styles.icon}>{option.icon}</Typography>
                  <View style={styles.lifestyleTextContainer}>
                    <Typography
                      variant="bodyText"
                      style={{
                        fontSize: 16,
                        fontWeight: isSelected ? '700' : '600',
                        color: isDark ? Colors.neutral[100] : Colors.neutral[900],
                      }}
                    >
                      {option.label}
                    </Typography>
                    <Typography
                      variant="caption"
                      style={{
                        fontSize: 13,
                        color: isDark ? Colors.neutral[400] : Colors.neutral[500],
                        marginTop: 2,
                      }}
                    >
                      {option.subtitle}
                    </Typography>
                  </View>
                  <View
                    style={[
                      styles.checkCircle,
                      {
                        backgroundColor: isSelected
                          ? Colors.brand.primary
                          : isDark
                          ? Colors.neutral[700]
                          : Colors.neutral[200],
                      },
                    ]}
                  >
                    {isSelected && (
                      <Typography style={styles.checkmark}>✓</Typography>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Allergies Section */}
        <View style={styles.section}>
          <Typography
            variant="bodyText"
            style={{
              fontSize: 16,
              fontWeight: '600',
              marginBottom: 12,
              color: isDark ? Colors.neutral[300] : Colors.neutral[700],
            }}
          >
            Do you have any allergies?
          </Typography>
          
          <View style={styles.allergyGrid}>
            {allergyOptions.map((option) => {
              const isSelected = selectedAllergies.includes(option.value);
              return (
                <Pressable
                  key={option.value}
                  style={[
                    styles.allergyChip,
                    {
                      backgroundColor: isSelected
                        ? Colors.brand.primary + '20'
                        : isDark
                        ? Colors.neutral[800]
                        : Colors.neutral[50],
                      borderColor: isSelected
                        ? Colors.brand.primary
                        : isDark
                        ? Colors.neutral[700]
                        : Colors.neutral[200],
                    },
                  ]}
                  onPress={() => handleAllergyToggle(option.value)}
                >
                  <Typography style={styles.allergyIcon}>{option.icon}</Typography>
                  <Typography
                    variant="caption"
                    style={{
                      fontSize: 13,
                      fontWeight: isSelected ? '600' : '500',
                      color: isSelected
                        ? Colors.brand.primary
                        : isDark
                        ? Colors.neutral[300]
                        : Colors.neutral[700],
                    }}
                  >
                    {option.label}
                  </Typography>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </StepContainer>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      paddingTop: 20,
      paddingBottom: 20,
    },
    section: {
      marginBottom: 24,
    },
    optionsContainer: {
      gap: 10,
    },
    lifestyleCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 16,
      borderWidth: 2,
      marginBottom: 10,
    },
    icon: {
      fontSize: 28,
      lineHeight: 32,
      marginRight: 12,
    },
    lifestyleTextContainer: {
      flex: 1,
    },
    checkCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkmark: {
      color: Colors.neutral.white,
      fontSize: 14,
      fontWeight: '700',
    },
    allergyGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    allergyChip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 12,
      borderWidth: 1.5,
      gap: 6,
    },
    allergyIcon: {
      fontSize: 18,
    },
  });
