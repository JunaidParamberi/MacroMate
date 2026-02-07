import { Colors } from '@/constants/theme';
import { Typography } from '@/components/ui';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface OnboardingProgressBarProps {
  currentStep: number;
  totalSteps: number;
  showPercentage?: boolean;
}

export function OnboardingProgressBar({ currentStep, totalSteps, showPercentage = true }: OnboardingProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="bodyText" style={styles.stepText}>
          STEP {currentStep} OF {totalSteps}
        </Typography>
        {showPercentage && (
          <Typography variant="bodyText" style={styles.percentage}>
            {Math.round(progress)}%
          </Typography>
        )}
      </View>
      <View style={styles.barContainer}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral[500],
    letterSpacing: 0.5,
  },
  percentage: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.neutral[500],
  },
  barContainer: {
    height: 6,
    backgroundColor: Colors.neutral[200],
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.brand.primary,
    borderRadius: 3,
  },
});
