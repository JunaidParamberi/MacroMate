import { Typography } from '@/components/ui';
import { Colors } from '@/constants/theme';
import { useUserProfileStore } from '@/store/userProfile';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
    StyleSheet,
    useColorScheme,
    View,
} from 'react-native';

export default function LoadingScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);
  const { calculateNutritionTargets } = useUserProfileStore();

  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Analyzing your profile...');
  const animatedValue = useRef(new Animated.Value(0)).current;
  const rotationValue = useRef(new Animated.Value(0)).current;

  const loadingStages = [
    { progress: 0, text: 'Analyzing your profile...' },
    { progress: 15, text: 'Calculating BMI...' },
    { progress: 30, text: 'Setting nutrition targets...' },
    { progress: 45, text: 'Creating meal plan...' },
    { progress: 60, text: 'Optimizing macros...' },
    { progress: 75, text: 'Generating workout suggestions...' },
    { progress: 90, text: 'Finalizing your plan...' },
    { progress: 100, text: 'Ready!' },
  ];

  useEffect(() => {
    calculateNutritionTargets();

    const progressAnimation = Animated.timing(animatedValue, {
      toValue: 1,
      duration: 8000,
      easing: Easing.ease,
      useNativeDriver: false,
    });

    const rotationAnimation = Animated.loop(
      Animated.timing(rotationValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    progressAnimation.start();
    rotationAnimation.start();

    const listener = animatedValue.addListener(({ value }) => {
      const currentProgress = Math.round(value * 100);
      setProgress(currentProgress);
      
      // Find current stage based on progress
      const currentStage = loadingStages.findLast(stage => currentProgress >= stage.progress);
      if (currentStage) {
        setLoadingText(currentStage.text);
      }
    });

    const timeout = setTimeout(() => {
      router.replace('/onboarding/review');
    }, 8500);

    return () => {
      animatedValue.removeListener(listener);
      clearTimeout(timeout);
    };
  }, []);

  const spin = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.circleContainer}>
        <Animated.View style={[styles.ring, { transform: [{ rotate: spin }] }]}>
          <View style={styles.ringSegment} />
        </Animated.View>
        <View style={styles.progressCircle}>
          <Typography variant="h1" style={{ fontSize: 48, fontWeight: '700', color: isDark ? Colors.neutral[100] : Colors.neutral[900], lineHeight: 56 }}>
            {progress}%
          </Typography>
        </View>
      </View>

      <Typography variant="bodyText" style={{ fontSize: 16, color: isDark ? Colors.neutral[400] : Colors.neutral[500], marginTop: 40, textAlign: 'center', minHeight: 24 }}>
        {loadingText}
      </Typography>

      <View style={styles.socialProofContainer}>
        <Typography variant="h2" style={{ fontSize: 28, fontWeight: '700', color: isDark ? Colors.neutral[100] : Colors.neutral[900], textAlign: 'center' }}>
          3+ million people
        </Typography>
        <Typography variant="bodyText" style={{ fontSize: 18, color: Colors.brand.primary, textAlign: 'center', marginTop: 8 }}>
          have chosen Calorie Counter
        </Typography>

        <View style={[styles.testimonialCard, { backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral[100] }]}>
          <View style={styles.testimonialHeader}>
            <View style={styles.avatar}>
              <Typography style={styles.avatarText}>👩</Typography>
            </View>
            <Typography variant="bodyText" style={{ fontSize: 15, fontWeight: '600', color: isDark ? Colors.neutral[200] : Colors.neutral[800], flex: 1 }}>
              Katherine
            </Typography>
            <View style={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <Typography key={i} style={styles.star}>⭐</Typography>
              ))}
            </View>
          </View>
          <Typography variant="bodyText" style={{ fontSize: 14, color: isDark ? Colors.neutral[400] : Colors.neutral[600], lineHeight: 20, marginTop: 10 }}>
            I had success with losing 10 lbs. This has also helped me to be accountable for exercising and also learning about sleeping patterns.
          </Typography>
        </View>
      </View>
    </View>
  );
}

const getStyles = (isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDark ? Colors.neutral[900] : Colors.neutral[50],
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    circleContainer: {
      width: 200,
      height: 200,
      alignItems: 'center',
      justifyContent: 'center',
    },
    ring: {
      position: 'absolute',
      width: 200,
      height: 200,
    },
    ringSegment: {
      width: 200,
      height: 200,
      borderRadius: 100,
      borderWidth: 12,
      borderColor: Colors.brand.primary,
      borderTopColor: 'transparent',
      borderLeftColor: 'transparent',
    },
    progressCircle: {
      width: 176,
      height: 176,
      borderRadius: 88,
      backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    socialProofContainer: {
      marginTop: 50,
      width: '100%',
    },
    testimonialCard: {
      marginTop: 20,
      padding: 16,
      borderRadius: 16,
    },
    testimonialHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[300],
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontSize: 20,
    },
    stars: {
      flexDirection: 'row',
      gap: 2,
    },
    star: {
      fontSize: 14,
    },
  });
