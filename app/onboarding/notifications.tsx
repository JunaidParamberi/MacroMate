import { OnboardingProgressBar } from '@/components/onboarding/OnboardingProgressBar';
import { StepContainer } from '@/components/onboarding/StepContainer';
import { Typography } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { useUserProfileStore } from '@/store/userProfile';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, useColorScheme, View } from 'react-native';

const AnimatedToggle = ({ isOn, onToggle, isDark }: { isOn: boolean; onToggle: () => void; isDark: boolean }) => {
  const translateX = useRef(new Animated.Value(isOn ? 20 : 0)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: isOn ? 20 : 0,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  }, [isOn]);

  return (
    <Pressable 
      onPress={onToggle} 
      style={[
        {
          width: 52,
          height: 32,
          borderRadius: 16,
          padding: 4,
          justifyContent: 'center',
          alignItems: 'flex-start',
        },
        { backgroundColor: isOn ? Colors.brand.primary : (isDark ? Colors.neutral[600] : Colors.neutral[200]) }
      ]}
    >
      <Animated.View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: isDark ? Colors.neutral[100] : Colors.neutral.white,
          transform: [{ translateX }],
        }}
      />
    </Pressable>
  );
};
const notificationOptions = [
  { key: 'mealReminders' as const, title: 'Meal Reminders', subtitle: 'Notify when it\'s time to eat', icon: 'restaurant' as const },
  { key: 'workoutLogging' as const, title: 'Workout Reminders', subtitle: 'Daily fitness notifications', icon: 'fitness' as const },
  { key: 'weeklyReports' as const, title: 'Progress Updates', subtitle: 'Weekly summary reports', icon: 'trending-up' as const },
];

export default function NotificationsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);
  const { notifications, setNotification } = useUserProfileStore();

  const toggleNotification = (key: keyof typeof notifications) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotification(key, !notifications[key]);
  };

  const handleContinue = () => {
    router.push('/onboarding/loading');
  };

  return (
    <StepContainer
      title="Stay on track"
      subtitle="Enable notifications to get reminders and updates about your progress."
      currentStep={12}
      totalSteps={12}
      onContinue={handleContinue}
      canContinue={true}
      continueText="Continue"
      progressBar={<OnboardingProgressBar currentStep={12} totalSteps={12} />}
    >
      <View style={styles.container}>
        {notificationOptions.map((option) => (
          <Pressable
            key={option.key}
            style={[styles.card, notifications[option.key as keyof typeof notifications] && styles.selectedCard]}
            onPress={() => toggleNotification(option.key)}
          >
            <View
              style={[
                styles.iconContainer,
                notifications[option.key as keyof typeof notifications] && styles.selectedIconContainer,
              ]}
            >
              <Ionicons
                name={option.icon}
                size={24}
                color={notifications[option.key as keyof typeof notifications] ? Colors.brand.primary : Colors.neutral[500]}
              />
            </View>
            <View style={styles.textContainer}>
              <Typography
                variant="bodyText"
                style={[
                  styles.title,
                  notifications[option.key as keyof typeof notifications] ? styles.selectedTitle : undefined,
                ]}
              >
                {option.title}
              </Typography>
              <Typography variant="caption" style={styles.subtitle}>
                {option.subtitle}
              </Typography>
            </View>
            <AnimatedToggle
              isOn={notifications[option.key as keyof typeof notifications]}
              onToggle={() => toggleNotification(option.key)}
              isDark={isDark}
            />
          </Pressable>
        ))}

        {/* All Set Card */}
        <View style={styles.allSetCard}>
          <Ionicons name="checkmark-circle" size={32} color={Colors.brand.primary} />
          <View style={styles.allSetText}>
            <Typography variant="bodyText" style={styles.allSetTitle}>
              All Set!
            </Typography>
            <Typography variant="caption" style={styles.allSetSubtitle}>
              You can change these anytime in Settings
            </Typography>
          </View>
        </View>
      </View>
    </StepContainer>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: isDark ? Colors.neutral[700] : Colors.neutral[200],
  },
  selectedCard: {
    borderColor: Colors.brand.primary,
    backgroundColor: Colors.brand.primary + '15',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  selectedIconContainer: {
    backgroundColor: Colors.brand.primary + '20',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: isDark ? Colors.neutral[100] : Colors.neutral[800],
    marginBottom: 4,
  },
  selectedTitle: {
    color: Colors.brand.primary,
  },
  subtitle: {
    fontSize: 13,
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
  },
  allSetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.brand.primary + '15',
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: Colors.brand.primary + '30',
  },
  allSetText: {
    marginLeft: 16,
    flex: 1,
  },
  allSetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.brand.primary,
    marginBottom: 2,
  },
  allSetSubtitle: {
    fontSize: 13,
    color: isDark ? Colors.neutral[400] : Colors.neutral[600],
  },
});
