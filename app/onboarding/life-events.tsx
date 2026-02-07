import { OnboardingProgressBar } from '@/components/onboarding/OnboardingProgressBar';
import { StepContainer } from '@/components/onboarding/StepContainer';
import { Typography } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { LifeEvent, useUserProfileStore } from '@/store/userProfile';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Pressable,
    StyleSheet,
    useColorScheme,
    View,
} from 'react-native';

const lifeEventOptions: { value: LifeEvent; label: string; emoji: string }[] = [
  { value: 'vacation', label: 'Vacation', emoji: '✈️' },
  { value: 'wedding', label: 'Wedding', emoji: '💒' },
  { value: 'competition', label: 'Competition', emoji: '🏆' },
  { value: 'marathon', label: 'Marathon / Race', emoji: '🏃' },
  { value: 'graduation', label: 'Graduation', emoji: '🎓' },
  { value: 'reunion', label: 'Family Reunion', emoji: '👨‍👩‍👧‍👦' },
  { value: 'photo_shoot', label: 'Photo Shoot', emoji: '📸' },
  { value: 'job_interview', label: 'Job Interview', emoji: '💼' },
  { value: 'important_date', label: 'Important date', emoji: '📅' },
  { value: 'outdoor_adventure', label: 'Outdoor adventure', emoji: '🏕️' },
  { value: 'birthday', label: 'Birthday', emoji: '🎂' },
  { value: 'holiday', label: 'Holiday', emoji: '🏝️' },
  { value: 'none', label: 'None of these', emoji: '❌' },
  { value: 'honeymoon', label: 'Honeymoon', emoji: '❤️' },
  { value: 'anniversary', label: 'Anniversary', emoji: '💕' },
  { value: 'festival', label: 'Festival', emoji: '🎉' },
  { value: 'convention', label: 'Convention', emoji: '👥' },
  { value: 'trade_show', label: 'Trade Show', emoji: '📈' },
  { value: 'exhibition', label: 'Exhibition', emoji: '🎨' },
  { value: 'sporting_event', label: 'Sporting Event', emoji: '🏈' },
  { value: 'concert', label: 'Concert', emoji: '🎵' },
  { value: 'show', label: 'Show', emoji: '🎭' },
];

export default function LifeEventsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);
  const { lifeEvent, setLifeEvent } = useUserProfileStore();

  const [selectedEvent, setSelectedEvent] = useState<LifeEvent | null>(lifeEvent?.type || null);

  const handleEventSelect = (value: LifeEvent) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedEvent(value);
  };

  const handleContinue = () => {
    if (selectedEvent) {
      if (selectedEvent === 'none') {
        setLifeEvent({ type: 'none', date: null, title: null });
        router.push('/onboarding/notifications');
      } else {
        setLifeEvent({ type: selectedEvent, date: null, title: null });
        router.push('/onboarding/event-date');
      }
    }
  };

  const isContinueDisabled = !selectedEvent;

  return (
    <StepContainer
      title="Do you have any significant life events coming up soon?"
      subtitle="Having something to look forward to can be a powerful motivator for achieving your goal."
      currentStep={9}
      totalSteps={12}
      onContinue={handleContinue}
      canContinue={!isContinueDisabled}
      progressBar={<OnboardingProgressBar currentStep={9} totalSteps={12} />}
    >
      <View style={styles.container}>
        <View style={styles.optionsContainer}>
          {lifeEventOptions.map((option) => {
            const isSelected = selectedEvent === option.value;
            return (
              <Pressable
                key={option.value}
                style={[
                  styles.eventCard,
                  {
                    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[50],
                    borderColor: isSelected
                      ? Colors.brand.primary
                      : isDark
                      ? Colors.neutral[700]
                      : Colors.neutral[200],
                  },
                ]}
                onPress={() => handleEventSelect(option.value)}
              >
                <Typography
                  variant="bodyText"
                  style={{
                    fontSize: 17,
                    fontWeight: isSelected ? '600' : '500',
                    color: isDark ? Colors.neutral[100] : Colors.neutral[900],
                    flex: 1,
                  }}
                >
                  {option.label}
                </Typography>
                <Typography style={styles.emoji}>{option.emoji}</Typography>
              </Pressable>
            );
          })}
        </View>
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
    optionsContainer: {
      gap: 12,
    },
    eventCard: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 18,
      borderRadius: 16,
      borderWidth: 2,
    },
    emoji: {
      fontSize: 32,
      lineHeight: 36,
      marginLeft: 12,
    },
  });
