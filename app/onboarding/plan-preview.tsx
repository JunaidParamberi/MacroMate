import { OnboardingProgressBar } from '@/components/onboarding/OnboardingProgressBar';
import { StepContainer } from '@/components/onboarding/StepContainer';
import { Typography } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { useUserProfileStore } from '@/store/userProfile';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PlanPreviewScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);
  const { 
    currentWeight, 
    targetWeight, 
    weightUnit,
    lifeEvent,
    estimatedGoalDate,
    projectedMilestone 
  } = useUserProfileStore();

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/loading');
  };

  const formatWeight = (weight: number) => {
    return Math.round(weight);
  };

  const getEventTitle = () => {
    if (!lifeEvent || lifeEvent.type === 'none') return 'your goal';
    const titles: Record<string, string> = {
      vacation: 'the Vacation',
      competition: 'the Competition',
      important_date: 'the Big Day',
      outdoor_adventure: 'the Adventure',
      birthday: 'your Birthday',
      holiday: 'the Holiday',
    };
    return titles[lifeEvent.type] || 'your goal';
  };

  const weightDiff = currentWeight - targetWeight;
  const isLosing = weightDiff > 0;
  const today = new Date();
  const goalDate = estimatedGoalDate || new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
  const daysToGoal = Math.ceil((goalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const weeksToGoal = Math.ceil(daysToGoal / 7);

  // Format goal date
  const formatGoalDate = () => {
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    return goalDate.toLocaleDateString('en-US', options);
  };

  // Generate SVG path for weight curve
  const generateCurvePath = () => {
    const startX = 40;
    const endX = SCREEN_WIDTH - 80;
    const startY = 60;
    const endY = 180;
    const midX = (startX + endX) / 2;
    
    // Create a smooth curve
    return `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
  };

  return (
    <StepContainer
      title="The last plan you'll ever need to get in shape"
      subtitle=""
      currentStep={10}
      totalSteps={12}
      onContinue={handleContinue}
      progressBar={<OnboardingProgressBar currentStep={10} totalSteps={12} />}
    >
      <View style={styles.container}>
        {/* Goal Text */}
        <View style={styles.goalSection}>
          <Typography
            variant="bodyText"
            style={{
              fontSize: 16,
              color: isDark ? Colors.neutral[400] : Colors.neutral[500],
              textAlign: 'center',
            }}
          >
            your weight can reach
          </Typography>
          <Typography
            variant="h1"
            style={{
              fontSize: 32,
              fontWeight: '700',
              color: Colors.brand.primary,
              textAlign: 'center',
              marginTop: 8,
            }}
          >
            {formatWeight(targetWeight)} {weightUnit} by *{formatGoalDate()}
          </Typography>
          <Typography
            variant="bodyText"
            style={{
              fontSize: 16,
              color: isDark ? Colors.neutral[400] : Colors.neutral[500],
              textAlign: 'center',
              marginTop: 8,
            }}
          >
            and you can {isLosing ? 'lose' : 'gain'}
          </Typography>
          
          {/* Milestone Badge */}
          <View
            style={[
              styles.milestoneBadge,
              { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100] },
            ]}
          >
            <Typography
              variant="bodyText"
              style={{
                fontSize: 16,
                fontWeight: '600',
                color: Colors.brand.primary,
              }}
            >
              {isLosing ? '-' : '+'}{Math.abs(Math.round(weightDiff))} {weightUnit} by {getEventTitle()}
            </Typography>
          </View>
        </View>

        {/* Weight Chart */}
        <View style={styles.chartContainer}>
          {/* Start Weight Label */}
          <View style={[styles.weightLabel, styles.startWeightLabel]}>
            <View
              style={[
                styles.weightBubble,
                { backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[800] },
              ]}
            >
              <Typography style={styles.weightBubbleText}>
                {formatWeight(currentWeight)} {weightUnit}
              </Typography>
            </View>
            <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
          </View>

          {/* Curve Line */}
          <svg
            width={SCREEN_WIDTH - 48}
            height={200}
            style={{ marginTop: 20 }}
          >
            <defs>
              <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            
            {/* Area under curve */}
            <path
              d={`${generateCurvePath()} L ${SCREEN_WIDTH - 80} 200 L 40 200 Z`}
              fill="url(#curveGradient)"
            />
            
            {/* Curve line */}
            <path
              d={generateCurvePath()}
              fill="none"
              stroke="url(#curveGradient)"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>

          {/* Goal Weight Label */}
          <View style={[styles.weightLabel, styles.goalWeightLabel]}>
            <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
            <View
              style={[
                styles.weightBubble,
                { backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[800] },
              ]}
            >
              <Typography style={styles.weightBubbleText}>
                {formatWeight(targetWeight)} {weightUnit}
              </Typography>
            </View>
          </View>

          {/* Target Line */}
          <View style={styles.targetLine}>
            <View style={[styles.dottedLine, { borderColor: '#10B981' }]} />
          </View>

          {/* Date Labels */}
          <View style={styles.dateLabels}>
            <Typography
              style={{
                fontSize: 13,
                color: isDark ? Colors.neutral[500] : Colors.neutral[400],
              }}
            >
              {today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Typography>
            <Typography
              style={{
                fontSize: 13,
                color: isDark ? Colors.neutral[500] : Colors.neutral[400],
              }}
            >
              {goalDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </Typography>
          </View>
        </View>

        {/* Disclaimer */}
        <Typography
          variant="caption"
          style={{
            fontSize: 12,
            color: isDark ? Colors.neutral[500] : Colors.neutral[400],
            textAlign: 'center',
            marginTop: 20,
            lineHeight: 18,
          }}
        >
          *Based on the data of users who log their progress in the app. Consult your physician first. The chart is a non-customized illustration and results may vary.
        </Typography>
      </View>
    </StepContainer>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 20,
    },
    goalSection: {
      alignItems: 'center',
      marginBottom: 30,
    },
    milestoneBadge: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      marginTop: 12,
    },
    chartContainer: {
      height: 220,
      position: 'relative',
      marginHorizontal: -10,
    },
    weightLabel: {
      position: 'absolute',
      alignItems: 'center',
    },
    startWeightLabel: {
      left: 20,
      top: 0,
    },
    goalWeightLabel: {
      right: 20,
      bottom: 40,
    },
    weightBubble: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 8,
      marginBottom: 4,
    },
    weightBubbleText: {
      color: Colors.neutral.white,
      fontSize: 13,
      fontWeight: '600',
    },
    dot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    targetLine: {
      position: 'absolute',
      left: 40,
      right: 40,
      bottom: 48,
      height: 0,
    },
    dottedLine: {
      borderStyle: 'dashed',
      borderWidth: 1,
      borderRadius: 1,
    },
    dateLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      position: 'absolute',
      left: 20,
      right: 20,
      bottom: 0,
    },
  });
