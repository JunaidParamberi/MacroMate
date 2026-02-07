import { OnboardingProgressBar } from '@/components/onboarding/OnboardingProgressBar';
import { StepContainer } from '@/components/onboarding/StepContainer';
import { Typography } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { useUserProfileStore } from '@/store/userProfile';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

export default function WellnessSummaryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);
  const { 
    bmi, 
    bmiCategory, 
    currentWeight, 
    weightUnit, 
    height, 
    lifestyle, 
    allergies, 
    activityLevel 
  } = useUserProfileStore();

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/life-events');
  };

  const getBmiColor = () => {
    switch (bmiCategory) {
      case 'underweight': return '#3B82F6'; // blue
      case 'normal': return '#10B981'; // green
      case 'overweight': return '#F59E0B'; // yellow
      case 'obese': return '#EF4444'; // red
      default: return Colors.brand.primary;
    }
  };

  const getBmiLabel = () => {
    switch (bmiCategory) {
      case 'underweight': return 'Underweight';
      case 'normal': return 'Normal';
      case 'overweight': return 'Overweight';
      case 'obese': return 'Obese';
      default: return 'Normal';
    }
  };

  const getLifestyleLabel = () => {
    switch (lifestyle) {
      case 'very_healthy': return 'Very healthy lifestyle';
      case 'some_healthy': return 'I have some healthy habits';
      case 'average': return 'Average lifestyle';
      case 'needs_improvement': return 'Needs improvement';
      default: return 'Average lifestyle';
    }
  };

  const getActivityLabel = () => {
    switch (activityLevel) {
      case 'sedentary': return 'Sedentary';
      case 'lightly_active': return 'Lightly active';
      case 'moderately_active': return 'Moderately active';
      case 'very_active': return 'Very active';
      default: return 'Lightly active';
    }
  };

  const getAllergiesLabel = () => {
    if (allergies.includes('none')) return 'No allergies';
    if (allergies.length === 1) return `Allergic to ${allergies[0]}`;
    return `${allergies.length} allergies noted`;
  };

  const weightDisplay = weightUnit === 'lbs' 
    ? Math.round(currentWeight * 0.453592 * 10) / 10 
    : currentWeight;
  const normalBmi = 21.5;

  return (
    <StepContainer
      title="Summary of your overall wellness"
      subtitle=""
      currentStep={8}
      totalSteps={12}
      onContinue={handleContinue}
      progressBar={<OnboardingProgressBar currentStep={8} totalSteps={12} />}
    >
      <View style={styles.container}>
        {/* BMI Card */}
        <View
          style={[
            styles.bmiCard,
            { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[50] },
          ]}
        >
          <View style={styles.bmiHeader}>
            <Typography
              variant="bodyText"
              style={{
                fontSize: 15,
                fontWeight: '500',
                color: isDark ? Colors.neutral[300] : Colors.neutral[700],
              }}
            >
              Body Mass Index (BMI)
            </Typography>
            <Typography
              variant="bodyText"
              style={{
                fontSize: 15,
                fontWeight: '600',
                color: isDark ? Colors.neutral[200] : Colors.neutral[800],
              }}
            >
              {getBmiLabel()}: {normalBmi}
            </Typography>
          </View>

          {/* BMI Scale */}
          <View style={styles.bmiScaleContainer}>
            <View style={styles.bmiScale}>
              <View style={[styles.bmiSegment, { backgroundColor: '#10B981', flex: 18.5 }]} />
              <View style={[styles.bmiSegment, { backgroundColor: '#F59E0B', flex: 6.5 }]} />
              <View style={[styles.bmiSegment, { backgroundColor: '#EF4444', flex: 5 }]} />
            </View>
            
            {/* BMI Indicator */}
            <View 
              style={[
                styles.bmiIndicator,
                { 
                  left: `${Math.min(Math.max((bmi / 40) * 100, 5), 95)}%`,
                  backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[800],
                }
              ]}
            >
              <Typography style={styles.bmiIndicatorText}>You: {bmi}</Typography>
              <View style={[styles.indicatorArrow, { borderTopColor: isDark ? Colors.neutral[700] : Colors.neutral[800] }]} />
            </View>

            {/* Labels */}
            <View style={styles.bmiLabels}>
              <Typography style={[styles.bmiLabel, { color: isDark ? Colors.neutral[400] : Colors.neutral[500] }]}>Normal</Typography>
              <Typography style={[styles.bmiLabel, { color: isDark ? Colors.neutral[400] : Colors.neutral[500] }]}>Overweight</Typography>
              <Typography style={[styles.bmiLabel, { color: isDark ? Colors.neutral[400] : Colors.neutral[500] }]}>Obese</Typography>
            </View>
          </View>
        </View>

        {/* Info Cards */}
        <View style={styles.infoSection}>
          {/* BMI Row */}
          <View style={styles.infoRow}>
            <View style={[styles.iconContainer, { backgroundColor: Colors.brand.primary + '20' }]}>
              <Typography style={styles.icon}>👤</Typography>
            </View>
            <View style={styles.infoText}>
              <Typography
                variant="caption"
                style={{
                  fontSize: 13,
                  color: isDark ? Colors.neutral[400] : Colors.neutral[500],
                }}
              >
                Bodymass index
              </Typography>
              <Typography
                variant="bodyText"
                style={{
                  fontSize: 17,
                  fontWeight: '600',
                  color: isDark ? Colors.neutral[100] : Colors.neutral[900],
                }}
              >
                {bmi}
              </Typography>
            </View>
          </View>

          {/* Lifestyle Row */}
          <View style={styles.infoRow}>
            <View style={[styles.iconContainer, { backgroundColor: '#3B82F6' + '20' }]}>
              <Typography style={styles.icon}>⚡</Typography>
            </View>
            <View style={styles.infoText}>
              <Typography
                variant="caption"
                style={{
                  fontSize: 13,
                  color: isDark ? Colors.neutral[400] : Colors.neutral[500],
                }}
              >
                Lifestyle
              </Typography>
              <Typography
                variant="bodyText"
                style={{
                  fontSize: 17,
                  fontWeight: '600',
                  color: isDark ? Colors.neutral[100] : Colors.neutral[900],
                }}
              >
                {getLifestyleLabel()}
              </Typography>
            </View>
          </View>

          {/* Activity Row */}
          <View style={styles.infoRow}>
            <View style={[styles.iconContainer, { backgroundColor: '#EF4444' + '20' }]}>
              <Typography style={styles.icon}>🏃</Typography>
            </View>
            <View style={styles.infoText}>
              <Typography
                variant="caption"
                style={{
                  fontSize: 13,
                  color: isDark ? Colors.neutral[400] : Colors.neutral[500],
                }}
              >
                Activity level
              </Typography>
              <Typography
                variant="bodyText"
                style={{
                  fontSize: 17,
                  fontWeight: '600',
                  color: isDark ? Colors.neutral[100] : Colors.neutral[900],
                }}
              >
                {getActivityLabel()}
              </Typography>
            </View>
          </View>

          {/* Allergies Row */}
          <View style={styles.infoRow}>
            <View style={[styles.iconContainer, { backgroundColor: '#F59E0B' + '20' }]}>
              <Typography style={styles.icon}>🍽️</Typography>
            </View>
            <View style={styles.infoText}>
              <Typography
                variant="caption"
                style={{
                  fontSize: 13,
                  color: isDark ? Colors.neutral[400] : Colors.neutral[500],
                }}
              >
                Allergies
              </Typography>
              <Typography
                variant="bodyText"
                style={{
                  fontSize: 17,
                  fontWeight: '600',
                  color: isDark ? Colors.neutral[100] : Colors.neutral[900],
                }}
              >
                {getAllergiesLabel()}
              </Typography>
            </View>
          </View>
        </View>
      </View>
    </StepContainer>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 10,
    },
    bmiCard: {
      padding: 20,
      borderRadius: 20,
      marginBottom: 24,
    },
    bmiHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    bmiScaleContainer: {
      marginTop: 10,
    },
    bmiScale: {
      flexDirection: 'row',
      height: 12,
      borderRadius: 6,
      overflow: 'hidden',
    },
    bmiSegment: {
      height: '100%',
    },
    bmiIndicator: {
      position: 'absolute',
      top: -35,
      transform: [{ translateX: -30 }],
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
      alignItems: 'center',
    },
    bmiIndicatorText: {
      color: Colors.neutral.white,
      fontSize: 13,
      fontWeight: '600',
    },
    indicatorArrow: {
      position: 'absolute',
      bottom: -6,
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: 6,
      borderRightWidth: 6,
      borderTopWidth: 6,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
    },
    bmiLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 8,
    },
    bmiLabel: {
      fontSize: 12,
      fontWeight: '500',
    },
    infoSection: {
      gap: 16,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      fontSize: 24,
    },
    infoText: {
      flex: 1,
    },
  });
