import { OnboardingProgressBar } from '@/components/onboarding/OnboardingProgressBar';
import { StepContainer } from '@/components/onboarding/StepContainer';
import { Typography } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { useUserProfileStore } from '@/store/userProfile';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, useColorScheme, View } from 'react-native';
 
export default function ReviewScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);
  const { 
    primaryGoal, 
    activityLevel,
    currentWeight,
    weightUnit,
    targetWeight,
    height,
    heightUnit,
    bmi,
    bmiCategory,
    lifestyle,
    allergies,
    lifeEvent,
    calculateNutritionTargets,
    setHasCompletedOnboarding,
    dailyCalorieTarget,
    proteinTarget,
    carbsTarget,
    fatsTarget,
    projectedMilestone
  } = useUserProfileStore();
 
  const [customCalories, setCustomCalories] = useState<number>(dailyCalorieTarget);
  const [isCustom, setIsCustom] = useState<boolean>(false);
 
  useEffect(() => {
    calculateNutritionTargets();
  }, []);
 
  const adjustCalories = (delta: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCustomCalories((prev: number) => Math.max(1200, prev + delta));
    setIsCustom(true);
  };
 
  const goalLabels: Record<string, string> = {
    lose_weight: 'Lose Weight',
    maintain_weight: 'Maintain',
    build_muscle: 'Build Muscle',
    improve_endurance: 'Endurance',
  };

  const getLifestyleLabel = () => {
    switch (lifestyle) {
      case 'very_healthy': return 'Very Healthy';
      case 'some_healthy': return 'Some Healthy Habits';
      case 'average': return 'Average';
      case 'needs_improvement': return 'Needs Improvement';
      default: return 'Not set';
    }
  };

  const getBmiLabel = () => {
    switch (bmiCategory) {
      case 'underweight': return 'Underweight';
      case 'normal': return 'Normal';
      case 'overweight': return 'Overweight';
      case 'obese': return 'Obese';
      default: return 'Unknown';
    }
  };

  const getAllergiesLabel = () => {
    if (!allergies || allergies.includes('none')) return 'None';
    return allergies.map(a => a.charAt(0).toUpperCase() + a.slice(1)).join(', ');
  };

  const getLifeEventLabel = () => {
    if (!lifeEvent || lifeEvent.type === 'none') return 'None';
    const labels: Record<string, string> = {
      vacation: 'Vacation',
      competition: 'Competition',
      important_date: 'Important Date',
      outdoor_adventure: 'Outdoor Adventure',
      birthday: 'Birthday',
      holiday: 'Holiday',
      wedding: 'Wedding',
      graduation: 'Graduation',
      reunion: 'Family Reunion',
      marathon: 'Marathon / Race',
      photo_shoot: 'Photo Shoot',
      job_interview: 'Job Interview',
      honeymoon: 'Honeymoon',
      anniversary: 'Anniversary',
      festival: 'Festival',
      convention: 'Convention',
      trade_show: 'Trade Show',
      exhibition: 'Exhibition',
      sporting_event: 'Sporting Event',
      concert: 'Concert',
      show: 'Show',
    };
    return labels[lifeEvent.type] || lifeEvent.type;
  };
 
  const handleFinish = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setHasCompletedOnboarding(true);
    // Small delay to ensure state is persisted before navigation
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 100);
  };
 
  const displayCalories = isCustom ? customCalories : dailyCalorieTarget;
 
  return (
    <StepContainer
      title="Your Plan"
      subtitle="Review and customize your nutrition targets"
      currentStep={10}
      totalSteps={10}
      onContinue={handleFinish}
      continueText="Start Journey"
      showBackButton={true}
      progressBar={<OnboardingProgressBar currentStep={10} totalSteps={10} />}
    >
      <View style={styles.container}>
        {/* Calorie Target - Hero */}
        <View style={styles.calorieCard}>
          <Typography variant="caption" style={styles.targetLabel}>
            DAILY TARGET
          </Typography>
          <View style={styles.calorieRow}>
            <Typography variant="h1" style={styles.calorieNumber}>
              {displayCalories.toLocaleString()}
            </Typography>
            <Typography variant="bodyText" style={styles.calorieUnit}>
              kcal
            </Typography>
          </View>
          
          {/* Adjustment */}
          <View style={styles.adjustRow}>
            <Pressable style={styles.minusButton} onPress={() => adjustCalories(-50)}>
              <Ionicons name="remove" size={18} color={Colors.brand.primary} />
            </Pressable>
            <Typography variant="caption" style={styles.adjustText}>
              {isCustom ? 'Custom' : 'AI Recommended'}
            </Typography>
            <Pressable style={styles.plusButton} onPress={() => adjustCalories(50)}>
              <Ionicons name="add" size={18} color={Colors.brand.primary} />
            </Pressable>
          </View>
 
          {isCustom && (
            <Pressable style={styles.resetPill} onPress={() => {
              setCustomCalories(dailyCalorieTarget);
              setIsCustom(false);
            }}>
              <Typography variant="caption" style={styles.resetText}>
                Reset to {dailyCalorieTarget.toLocaleString()}
              </Typography>
            </Pressable>
          )}
        </View>
 
        {/* Macros - Simple Row */}
        <View style={styles.macroRow}>
          <View style={styles.macroBox}>
            <Typography variant="bodyText" style={styles.macroNumber}>{proteinTarget}g</Typography>
            <Typography variant="caption" style={styles.macroName}>Protein</Typography>
          </View>
          <View style={styles.macroBox}>
            <Typography variant="bodyText" style={styles.macroNumber}>{carbsTarget}g</Typography>
            <Typography variant="caption" style={styles.macroName}>Carbs</Typography>
          </View>
          <View style={styles.macroBox}>
            <Typography variant="bodyText" style={styles.macroNumber}>{fatsTarget}g</Typography>
            <Typography variant="caption" style={styles.macroName}>Fats</Typography>
          </View>
        </View>
 
        {/* Goal Badge */}
        <View style={styles.goalBadge}>
          <Ionicons name="flag" size={16} color={Colors.brand.primary} />
          <Typography variant="bodyText" style={styles.goalText}>
            {primaryGoal ? goalLabels[primaryGoal] : 'Not set'}
          </Typography>
          {projectedMilestone && (
            <>
              <View style={styles.dot} />
              <Typography variant="caption" style={styles.milestoneText}>
                {projectedMilestone}
              </Typography>
            </>
          )}
        </View>
 
        {/* Summary */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Typography variant="caption" style={styles.summaryLabel}>Current Weight</Typography>
            <Typography variant="bodyText" style={styles.summaryValue}>
              {currentWeight} {weightUnit}
            </Typography>
          </View>
          <View style={styles.summaryRow}>
            <Typography variant="caption" style={styles.summaryLabel}>Height</Typography>
            <Typography variant="bodyText" style={styles.summaryValue}>
              {height} {heightUnit === 'cm' ? 'cm' : 'ft'}
            </Typography>
          </View>
          <View style={styles.summaryRow}>
            <Typography variant="caption" style={styles.summaryLabel}>BMI</Typography>
            <Typography variant="bodyText" style={styles.summaryValue}>
              {bmi} ({getBmiLabel()})
            </Typography>
          </View>
          <View style={styles.summaryRow}>
            <Typography variant="caption" style={styles.summaryLabel}>Target</Typography>
            <Typography variant="bodyText" style={styles.summaryValue}>
              {targetWeight} {weightUnit}
            </Typography>
          </View>
          <View style={styles.summaryRow}>
            <Typography variant="caption" style={styles.summaryLabel}>Activity</Typography>
            <Typography variant="bodyText" style={styles.summaryValue}>
              {activityLevel?.replace(/_/g, ' ') || 'Not set'}
            </Typography>
          </View>
          <View style={styles.summaryRow}>
            <Typography variant="caption" style={styles.summaryLabel}>Lifestyle</Typography>
            <Typography variant="bodyText" style={styles.summaryValue}>
              {getLifestyleLabel()}
            </Typography>
          </View>
          <View style={styles.summaryRow}>
            <Typography variant="caption" style={styles.summaryLabel}>Allergies</Typography>
            <Typography variant="bodyText" style={styles.summaryValue}>
              {getAllergiesLabel()}
            </Typography>
          </View>
          <View style={[styles.summaryRow, { borderBottomWidth: 0 }]}>
            <Typography variant="caption" style={styles.summaryLabel}>Life Event</Typography>
            <Typography variant="bodyText" style={styles.summaryValue}>
              {getLifeEventLabel()}
            </Typography>
          </View>
        </View>
 
        {/* Edit Note */}
        <Typography variant="caption" style={styles.editNote}>
          Tap any item in your profile to edit later
        </Typography>
      </View>
    </StepContainer>
  );
}
 
const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  calorieCard: {
    backgroundColor: isDark ? Colors.brand.primary + '12' : Colors.brand.primary + '08',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: isDark ? Colors.brand.primary + '20' : Colors.brand.primary + '15',
  },
  targetLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.brand.primary,
    letterSpacing: 1,
    marginBottom: 8,
  },
  calorieRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 20,
  },
  calorieNumber: {
    fontSize: 56,
    fontWeight: '800',
    color: isDark ? Colors.neutral[100] : Colors.neutral[900],
    letterSpacing: -2,
    lineHeight: 64,
  },
  calorieUnit: {
    fontSize: 18,
    fontWeight: '500',
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  adjustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  minusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  adjustText: {
    fontSize: 13,
    fontWeight: '500',
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
  },
  resetPill: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100],
    borderRadius: 12,
  },
  resetText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.brand.primary,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20,
  },
  macroBox: {
    flex: 1,
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[50],
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: isDark ? Colors.neutral[700] : Colors.neutral[200],
  },
  macroNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: isDark ? Colors.neutral[100] : Colors.neutral[900],
  },
  macroName: {
    fontSize: 11,
    fontWeight: '600',
    color: isDark ? Colors.neutral[500] : Colors.neutral[500],
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  goalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 24,
    paddingVertical: 12,
  },
  goalText: {
    fontSize: 15,
    fontWeight: '600',
    color: isDark ? Colors.neutral[200] : Colors.neutral[800],
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: isDark ? Colors.neutral[600] : Colors.neutral[400],
  },
  milestoneText: {
    fontSize: 13,
    color: Colors.brand.primary,
    fontWeight: '600',
  },
  summarySection: {
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: isDark ? Colors.neutral[700] : Colors.neutral[200],
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? Colors.neutral[700] : Colors.neutral[100],
  },
  summaryLabel: {
    fontSize: 13,
    color: isDark ? Colors.neutral[500] : Colors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: isDark ? Colors.neutral[200] : Colors.neutral[900],
  },
  editNote: {
    fontSize: 13,
    color: isDark ? Colors.neutral[500] : Colors.neutral[500],
    textAlign: 'center',
    fontStyle: 'italic',
  },
});