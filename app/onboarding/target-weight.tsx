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
  View
} from 'react-native';

const paces = [
  { value: 'conservative' as const, label: 'Conservative', loss: '0.25 kg/week' },
  { value: 'moderate' as const, label: 'Moderate', loss: '0.5 kg/week' },
  { value: 'aggressive' as const, label: 'Aggressive', loss: '0.75 kg/week' },
];

const MIN_WEIGHT = 30;
const MAX_WEIGHT = 200;
const TICK_SPACING = 20;
const CENTER_OFFSET = 175;

export default function TargetWeightScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);
  const { targetWeight: storeTargetWeight, weeklyPace: storeWeeklyPace, weightUnit, currentWeight, setTargetWeight, setWeeklyPace } = useUserProfileStore();
  
  const scrollViewRef = useRef<ScrollView>(null);
  const [targetWeight, setLocalTargetWeight] = useState(storeTargetWeight);
  const [pace, setLocalPace] = useState(storeWeeklyPace);

  // Scroll to correct position on mount based on stored weight
  useEffect(() => {
    const offsetX = (targetWeight - MIN_WEIGHT) * TICK_SPACING;
    scrollViewRef.current?.scrollTo({ x: offsetX, animated: false });
  }, []);

  const handleContinue = () => {
    setTargetWeight(targetWeight);
    setWeeklyPace(pace);
    router.push('/onboarding/wellness-summary');
  };

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newWeight = Math.round(MIN_WEIGHT + (offsetX / TICK_SPACING));
    const clampedWeight = Math.max(MIN_WEIGHT, Math.min(MAX_WEIGHT, newWeight));
    if (clampedWeight !== targetWeight) {
      setLocalTargetWeight(clampedWeight);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const renderTicks = () => {
    const ticks = [];
    const totalTicks = (MAX_WEIGHT - MIN_WEIGHT) + 1;

    for (let i = 0; i < totalTicks; i++) {
      const weightValue = MIN_WEIGHT + i;
      const isMajor = weightValue % 10 === 0;
      const isMedium = weightValue % 5 === 0 && !isMajor;

      ticks.push(
        <View key={i} style={styles.tickContainer}>
          {isMajor && (
            <Typography
              variant="caption"
              numberOfLines={1}
              style={[
                styles.tickLabel,
                { color: isDark ? Colors.neutral[400] : Colors.neutral[500] },
              ]}
            >
              {weightValue}
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
      title="What's your target?"
      subtitle="We'll customize your plan based on this goal."
      currentStep={8}
      totalSteps={12}
      onContinue={handleContinue}
      progressBar={<OnboardingProgressBar currentStep={8} totalSteps={12} />}
    >
      <View style={styles.container}>
        {/* Target Label */}
        <Typography variant="bodyText" style={{ fontSize: 12, fontWeight: '700', color: Colors.brand.primary, letterSpacing: 1, marginBottom: 8 }}>
          TARGET
        </Typography>

        {/* Weight Display */}
        <View style={styles.weightDisplay}>
          <Typography 
            variant="h1" 
            style={{ fontSize: 64, fontWeight: '700', lineHeight: 70, color: isDark ? Colors.neutral[50] : Colors.neutral[900] }}
          >
            {targetWeight.toFixed(1)}
          </Typography>
          <Typography 
            variant="bodyText" 
            style={{ fontSize: 20, fontWeight: '500', color: isDark ? Colors.neutral[400] : Colors.neutral[400], marginLeft: 8, marginBottom: 12 }}
          >
            kg
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

        {/* Weekly Pace Card */}
        <View style={[styles.paceCard, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white, borderColor: isDark ? Colors.neutral[700] : Colors.neutral[200] }]}>
          <View style={styles.paceHeader}>
            <Typography variant="caption" style={{ fontWeight: '700', color: isDark ? Colors.neutral[400] : Colors.neutral[500], letterSpacing: 0.5 }}>
              WEEKLY PACE
            </Typography>
            <View style={styles.badge}>
              <Typography variant="caption" style={{ color: Colors.brand.primary, fontWeight: '700', fontSize: 10 }}>
                {pace.toUpperCase()}
              </Typography>
            </View>
          </View>

          <Typography variant="h3" style={{ fontSize: 18, fontWeight: '700', color: isDark ? Colors.neutral[100] : Colors.neutral[900], marginBottom: 20 }}>
            Lose {pace === 'conservative' ? '0.25' : pace === 'moderate' ? '0.5' : '0.75'} kg / week
          </Typography>

          {/* Pace Slider */}
          <View style={styles.sliderContainer}>
            <Pressable
              style={[styles.sliderDot, { backgroundColor: isDark ? Colors.neutral[600] : Colors.neutral[300] }, pace === 'conservative' && styles.activeDot]}
              onPress={() => setLocalPace('conservative')}
            />
            <Pressable
              style={[styles.sliderDot, { backgroundColor: isDark ? Colors.neutral[600] : Colors.neutral[300] }, pace === 'moderate' && styles.activeDot]}
              onPress={() => setLocalPace('moderate')}
            />
            <Pressable
              style={[styles.sliderDot, { backgroundColor: isDark ? Colors.neutral[600] : Colors.neutral[300] }, pace === 'aggressive' && styles.activeDot]}
              onPress={() => setLocalPace('aggressive')}
            />
          </View>

          <View style={styles.labelsContainer}>
            <Typography variant="caption" style={{ fontSize: 11, color: isDark ? Colors.neutral[400] : Colors.neutral[400] }}>Conservative</Typography>
            <Typography variant="caption" style={{ fontSize: 11, color: isDark ? Colors.neutral[400] : Colors.neutral[400] }}>Moderate</Typography>
            <Typography variant="caption" style={{ fontSize: 11, color: isDark ? Colors.neutral[400] : Colors.neutral[400] }}>Aggressive</Typography>
          </View>

          {/* Goal Date */}
          <View style={[styles.goalDate, { borderTopColor: isDark ? Colors.neutral[700] : Colors.neutral[100] }]}>
            <Typography variant="caption" style={{ color: isDark ? Colors.neutral[400] : Colors.neutral[500] }}>
              Estimated goal date
            </Typography>
            <Typography variant="bodyText" style={{ fontWeight: '700', color: isDark ? Colors.neutral[100] : Colors.neutral[900] }}>
              {(() => {
                const weightDiff = Math.abs(currentWeight - targetWeight);
                const weeklyLoss = pace === 'conservative' ? 0.25 : pace === 'moderate' ? 0.5 : 0.75;
                const weeks = weightDiff / weeklyLoss;
                const goalDate = new Date();
                goalDate.setDate(goalDate.getDate() + Math.round(weeks * 7));
                return goalDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
              })()}
            </Typography>
          </View>
        </View>
      </View>
    </StepContainer>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingTop: 20,
      flex: 1,
    },
    weightDisplay: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      marginBottom: 16,
      paddingTop: 10,
      height: 100,
      justifyContent: 'center',
      overflow: 'visible',
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
      height: 120,
      position: 'relative',
      marginBottom: 40,
    },
    rulerContent: {
      alignItems: 'flex-end',
      height: 120,
    },
    ticksContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      height: 100,
    },
    tickContainer: {
      width: TICK_SPACING,
      alignItems: 'center',
      height: 100,
      justifyContent: 'flex-end',
    },
    tick: {
      width: 2,
    },
    majorTick: {
      height: 60,
    },
    mediumTick: {
      height: 35,
    },
    minorTick: {
      height: 20,
    },
    tickLabel: {
      fontSize: 12,
      marginBottom: 8,
      fontWeight: '500',
      flexWrap: 'nowrap',
    },
    centerLine: {
      position: 'absolute',
      left: '50%',
      bottom: 0,
      width: 2,
      height: 60,
      transform: [{ translateX: -1 }],
    },
    paceCard: {
      width: '100%',
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
    },
    paceHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    badge: {
      backgroundColor: Colors.brand.primary + '15',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
    },
    sliderContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    sliderDot: {
      width: 16,
      height: 16,
      borderRadius: 8,
    },
    activeDot: {
      backgroundColor: Colors.brand.primary,
      width: 20,
      height: 20,
      borderRadius: 10,
    },
    labelsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    goalDate: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingTop: 16,
      borderTopWidth: 1,
    },
  });

