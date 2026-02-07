import { Typography } from '@/components/ui';
import { Colors, Shadows } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, useColorScheme, View } from 'react-native';

interface StepContainerProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  onContinue: () => void;
  canContinue?: boolean;
  continueText?: string;
  showBackButton?: boolean;
  progressBar?: React.ReactNode;
}

export function StepContainer({
  children,
  title,
  subtitle,
  currentStep,
  totalSteps,
  onBack,
  onContinue,
  canContinue = true,
  continueText = 'Continue',
  showBackButton = true,
  progressBar,
}: StepContainerProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleContinue = () => {
    if (canContinue) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      onContinue();
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {showBackButton ? (
          <Pressable style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={isDark ? Colors.neutral[400] : Colors.neutral[600]} />
          </Pressable>
        ) : (
          <View style={styles.backButtonPlaceholder} />
        )}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress Bar */}
        {progressBar && <View style={styles.progressContainer}>{progressBar}</View>}

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Typography variant="h1" style={styles.title}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="bodyText" style={styles.subtitle}>
              {subtitle}
            </Typography>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>{children}</View>

        {/* Spacer for bottom button */}
        <View style={styles.spacer} />
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <Pressable
          style={[styles.continueButton, !canContinue && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!canContinue}
        >
          <Typography variant="bodyText" style={styles.continueText}>
            {continueText}
          </Typography>
          <Ionicons
            name="arrow-forward"
            size={20}
            color={Colors.neutral.white}
            style={styles.arrowIcon}
          />
        </Pressable>
      </View>
    </View>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? Colors.neutral[900] : Colors.neutral[50],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 12,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  backButtonPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  progressContainer: {
    marginBottom: 32,
  },
  titleSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: isDark ? Colors.neutral[50] : Colors.neutral[900],
    marginBottom: 12,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
    lineHeight: 24,
  },
  content: {
    flex: 1,
  },
  spacer: {
    height: 100,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    paddingBottom: 34,
    backgroundColor: isDark ? Colors.neutral[900] : Colors.neutral[50],
    borderTopWidth: 1,
    borderTopColor: isDark ? Colors.neutral[800] : Colors.neutral[100],
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brand.primary,
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
    ...Shadows.md,
  },
  disabledButton: {
    backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[300],
  },
  continueText: {
    color: Colors.neutral.white,
    fontWeight: '700',
    fontSize: 16,
  },
  arrowIcon: {
    marginLeft: 4,
  },
});
