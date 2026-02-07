import { OnboardingProgressBar } from '@/components/onboarding/OnboardingProgressBar';
import { StepContainer } from '@/components/onboarding/StepContainer';
import { Typography } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { useUserProfileStore } from '@/store/userProfile';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

const MIN_HEIGHT_CM = 100;
const MAX_HEIGHT_CM = 250;
const TICK_SPACING = 12;
const CENTER_OFFSET = 175;

export default function HeightScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);
  const { height, heightUnit, setHeight, calculateBMI, currentWeight, weightUnit } = useUserProfileStore();
  const scrollViewRef = useRef<ScrollView>(null);

  const [localHeight, setLocalHeight] = useState(height);
  const [unit, setLocalUnit] = useState<'cm' | 'ft'>(heightUnit);

  // Scroll to correct position on mount based on stored height
  useEffect(() => {
    const offsetX = (height - MIN_HEIGHT_CM) * TICK_SPACING;
    scrollViewRef.current?.scrollTo({ x: offsetX, animated: false });
  }, []);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newHeight = Math.round(MIN_HEIGHT_CM + (offsetX / TICK_SPACING));
    const clampedHeight = Math.max(MIN_HEIGHT_CM, Math.min(MAX_HEIGHT_CM, newHeight));
    if (clampedHeight !== localHeight) {
      setLocalHeight(clampedHeight);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleContinue = () => {
    setHeight(localHeight, unit);
    // Calculate BMI using the stored weight and new height
    calculateBMI();
    router.push('/onboarding/activity');
  };

  const toggleUnit = (newUnit: 'cm' | 'ft') => {
    if (newUnit === unit) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (newUnit === 'ft') {
      // Convert cm to feet (roughly)
      const feet = Math.round(localHeight / 30.48 * 10) / 10;
      // We'll still store in cm but display in ft
      setLocalHeight(localHeight);
    }
    setLocalUnit(newUnit);
  };

  const formatHeightDisplay = (cm: number, displayUnit: 'cm' | 'ft') => {
    if (displayUnit === 'cm') {
      return `${cm}`;
    } else {
      const totalInches = cm / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      return `${feet}'${inches}"`;
    }
  };

  const renderTicks = () => {
    const ticks = [];
    const totalTicks = (MAX_HEIGHT_CM - MIN_HEIGHT_CM) + 1;

    for (let i = 0; i < totalTicks; i++) {
      const heightValue = MIN_HEIGHT_CM + i;
      const isMajor = heightValue % 10 === 0;
      const isMedium = heightValue % 5 === 0 && !isMajor;

      ticks.push(
        <View key={i} style={styles.tickContainer}>
          {isMajor && (
            <Typography
              variant="caption"
              style={[
                styles.tickLabel,
                { color: isDark ? Colors.neutral[400] : Colors.neutral[500] },
              ]}
            >
              {unit === 'cm' ? heightValue : Math.round(heightValue / 30.48 * 10) / 10}
            </Typography>
          )}
          <View
            style={[
              styles.tick,
              isMajor
                ? [styles.majorTick, { backgroundColor: isDark ? Colors.neutral[300] : Colors.neutral[700] }]
                : isMedium
                ? [styles.mediumTick, { backgroundColor: isDark ? Colors.neutral[500] : Colors.neutral[400] }]
                : [styles.minorTick, { backgroundColor: isDark ? Colors.neutral[600] : Colors.neutral[300] }],
            ]}
          />
        </View>
      );
    }
    return ticks;
  };

  return (
    <StepContainer
      title="What is your height?"
      subtitle="This helps us calculate your BMI and daily calorie needs."
      currentStep={2}
      totalSteps={12}
      onContinue={handleContinue}
      progressBar={<OnboardingProgressBar currentStep={2} totalSteps={12} />}
    >
      <View style={styles.container}>
        {/* Height Display */}
        <View style={styles.heightDisplay}>
          <Typography
            variant="h1"
            style={{
              fontSize: 72,
              fontWeight: '700',
              lineHeight: 80,
              color: isDark ? Colors.neutral[50] : Colors.neutral[900],
            }}
          >
            {formatHeightDisplay(localHeight, unit)}
          </Typography>
          <Typography
            variant="bodyText"
            style={{
              fontSize: 24,
              fontWeight: '600',
              marginLeft: 8,
              color: isDark ? Colors.neutral[400] : Colors.neutral[500],
            }}
          >
            {unit === 'cm' ? 'cm' : 'ft'}
          </Typography>
        </View>

        {/* Triangle Indicator */}
        <View style={styles.indicatorContainer}>
          <View
            style={[
              styles.triangle,
              {
                borderTopColor: isDark ? Colors.neutral[50] : Colors.neutral[900],
              },
            ]}
          />
        </View>

        {/* Horizontal Ruler */}
        <View style={styles.rulerContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.rulerContent}
          >
            <View style={{ width: CENTER_OFFSET }} />
            <View style={styles.ticksContainer}>{renderTicks()}</View>
            <View style={{ width: CENTER_OFFSET }} />
          </ScrollView>

          {/* Center Line */}
          <View
            style={[
              styles.centerLine,
              { backgroundColor: isDark ? Colors.neutral[50] : Colors.neutral[900] },
            ]}
          />
        </View>

        {/* Unit Toggle */}
        <View
          style={[
            styles.unitToggle,
            { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100] },
          ]}
        >
          <Pressable
            style={[
              styles.unitButton,
              unit === 'cm' && [
                styles.activeUnit,
                { backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral.white },
              ],
            ]}
            onPress={() => toggleUnit('cm')}
          >
            <Typography
              variant="bodyText"
              style={{
                fontWeight: unit === 'cm' ? '700' : '600',
                fontSize: 16,
                color:
                  unit === 'cm'
                    ? isDark
                      ? Colors.neutral[100]
                      : Colors.neutral[900]
                    : isDark
                    ? Colors.neutral[500]
                    : Colors.neutral[500],
              }}
            >
              cm
            </Typography>
          </Pressable>
          <Pressable
            style={[
              styles.unitButton,
              unit === 'ft' && [
                styles.activeUnit,
                { backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral.white },
              ],
            ]}
            onPress={() => toggleUnit('ft')}
          >
            <Typography
              variant="bodyText"
              style={{
                fontWeight: unit === 'ft' ? '700' : '600',
                fontSize: 16,
                color:
                  unit === 'ft'
                    ? isDark
                      ? Colors.neutral[100]
                      : Colors.neutral[900]
                    : isDark
                    ? Colors.neutral[500]
                    : Colors.neutral[500],
              }}
            >
              ft
            </Typography>
          </Pressable>
        </View>
      </View>
    </StepContainer>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingTop: 40,
      flex: 1,
    },
    heightDisplay: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginBottom: 16,
      height: 80,
      justifyContent: 'center',
    },
    indicatorContainer: {
      alignItems: 'center',
      marginBottom: 8,
    },
    triangle: {
      width: 0,
      height: 0,
      backgroundColor: 'transparent',
      borderStyle: 'solid',
      borderLeftWidth: 8,
      borderRightWidth: 8,
      borderTopWidth: 12,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
    },
    rulerContainer: {
      width: '100%',
      height: 100,
      position: 'relative',
      marginBottom: 40,
    },
    rulerContent: {
      alignItems: 'flex-end',
      height: 100,
    },
    ticksContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      height: 60,
    },
    tickContainer: {
      width: TICK_SPACING,
      alignItems: 'center',
      height: 60,
      justifyContent: 'flex-end',
    },
    tick: {
      width: 2,
    },
    majorTick: {
      height: 40,
    },
    mediumTick: {
      height: 28,
    },
    minorTick: {
      height: 16,
    },
    tickLabel: {
      fontSize: 12,
      marginBottom: 4,
      fontWeight: '500',
    },
    centerLine: {
      position: 'absolute',
      left: '50%',
      bottom: 0,
      width: 2,
      height: 60,
      transform: [{ translateX: -1 }],
    },
    unitToggle: {
      flexDirection: 'row',
      borderRadius: 12,
      padding: 4,
      marginTop: 'auto',
      marginBottom: 20,
    },
    unitButton: {
      paddingHorizontal: 28,
      paddingVertical: 12,
      borderRadius: 8,
    },
    activeUnit: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
  });
