import { Typography } from '@/components/ui';
import { Colors, Shadows } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, useColorScheme, View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';


export default function WelcomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const styles = getStyles(isDark);

  const handleGetStarted = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/onboarding/goal');
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.delay(100)} style={styles.logoSection}>
          <View style={styles.logoContainer}>
                 <Image
                   source={require('../../assets/images/Logos/Primary_Emerald.png')}
                   style={styles.logo}
                   resizeMode="contain"
                 />
                  <Typography
                           variant="h3"
                           color={isDark ? Colors.neutral.white : Colors.neutral[900]}
                           style={styles.brandName}
                         >
                           MACROMATE
                         </Typography>
               </View>
               
      </Animated.View>

      {/* Hero Illustration */}
      <Animated.View entering={FadeInUp.delay(200)} style={styles.illustrationContainer}>
        <View style={styles.illustration}>
          {/* Background circles */}
          <View style={[styles.bgCircle, styles.bgCircle1]} />
          <View style={[styles.bgCircle, styles.bgCircle2]} />
          
          {/* Central icon container */}
          <LinearGradient
            colors={isDark 
              ? [Colors.brand.primary + '30', Colors.brand.accent + '20']
              : [Colors.brand.primary + '20', Colors.brand.accent + '10']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.mainCircle}
          >
            <Ionicons name="flame" size={64} color={Colors.brand.primary} />
          </LinearGradient>
          
          {/* Floating icons around */}
          <Animated.View entering={FadeIn.delay(400)} style={[styles.floatIcon, styles.floatIcon1]}>
            <View style={styles.iconBubble}>
              <Ionicons name="barbell" size={24} color={Colors.brand.primary} />
            </View>
          </Animated.View>
          
          <Animated.View entering={FadeIn.delay(500)} style={[styles.floatIcon, styles.floatIcon2]}>
            <View style={styles.iconBubble}>
              <Ionicons name="nutrition" size={24} color={Colors.brand.accent} />
            </View>
          </Animated.View>
          
          <Animated.View entering={FadeIn.delay(600)} style={[styles.floatIcon, styles.floatIcon3]}>
            <View style={styles.iconBubble}>
              <Ionicons name="trending-up" size={24} color={Colors.activityColors.gym} />
            </View>
          </Animated.View>
          
          <Animated.View entering={FadeIn.delay(700)} style={[styles.floatIcon, styles.floatIcon4]}>
            <View style={styles.iconBubble}>
              <Ionicons name="heart" size={24} color={Colors.cardio} />
            </View>
          </Animated.View>
        </View>
      </Animated.View>

      {/* Content */}
      <Animated.View entering={FadeInUp.delay(300)} style={styles.content}>
        <Typography variant="h1" style={styles.title}>
          Your Personal{'\n'}Fitness Companion
        </Typography>
        <Typography variant="bodyText" style={styles.subtitle}>
          Track nutrition, log workouts, and achieve your goals with AI-powered insights tailored just for you.
        </Typography>
      </Animated.View>

      {/* Bottom Button */}
      <Animated.View entering={FadeInUp.delay(400)} style={styles.bottomContainer}>
        <Pressable style={styles.getStartedButton} onPress={handleGetStarted}>
          <Typography variant="bodyText" style={styles.buttonText}>
            Get Started
          </Typography>
          <Ionicons name="arrow-forward" size={20} color={Colors.neutral[900]} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const getStyles = (isDark: boolean) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: isDark ? Colors.neutral[900] : Colors.neutral[50],
    paddingHorizontal: 24,
  },
  logoSection: {
    alignItems: 'center',
    paddingTop: 80,
    marginBottom: 20,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: 32,
    height: 280,
  },
  illustration: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bgCircle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.3,
  },
  bgCircle1: {
    width: 200,
    height: 200,
    backgroundColor: Colors.brand.primary + '30',
    top: 40,
    left: 40,
  },
  bgCircle2: {
    width: 150,
    height: 150,
    backgroundColor: Colors.brand.accent + '20',
    bottom: 60,
    right: 40,
  },
  mainCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.lg,
    borderWidth: 4,
    borderColor: isDark ? Colors.neutral[800] : Colors.neutral.white,
  },
  floatIcon: {
    position: 'absolute',
  },
  floatIcon1: { top: 20, left: 20 },
  floatIcon2: { top: 20, right: 20 },
  floatIcon3: { bottom: 40, left: 10 },
  floatIcon4: { bottom: 60, right: 10 },
  iconBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: isDark ? Colors.neutral[800] : Colors.neutral.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: isDark ? Colors.neutral[50] : Colors.neutral[900],
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    color: isDark ? Colors.neutral[400] : Colors.neutral[500],
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brand.primary,
    paddingVertical: 18,
    borderRadius: 16,
    gap: 8,
    ...Shadows.md,
  },
  buttonText: {
    color: Colors.neutral[900],
    fontWeight: '700',
    fontSize: 16,
  },
    logoContainer: {
    marginBottom: 40,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 80,
    height: 80,

  },
   brandName: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 3,
  },
});
