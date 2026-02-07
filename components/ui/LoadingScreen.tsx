import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, useColorScheme, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Colors } from '../../constants/theme';
import { Typography } from './Typography';

export interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  duration?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  onLoadingComplete,
  duration = 2500,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [progress, setProgress] = useState(0);

  const progressWidth = useSharedValue(0);
  const fadeAnim = useSharedValue(1);

  const logoSource = isDark
    ? require('../../assets/images/Logos/Monochrome_Dark.png')
    : require('../../assets/images/Logos/Primary_Emerald.png');

  useEffect(() => {
    // Animate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);

    return () => clearInterval(interval);
  }, [duration]);

  useEffect(() => {
    progressWidth.value = withTiming(progress, {
      duration: 50,
      easing: Easing.linear,
    });

    if (progress >= 100 && onLoadingComplete) {
      // Fade out before navigating
      fadeAnim.value = withTiming(0, { duration: 300 }, (finished) => {
        if (finished) {
          runOnJS(onLoadingComplete)();
        }
      });
    }
  }, [progress, onLoadingComplete]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: fadeAnim.value,
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: isDark ? Colors.neutral[900] : Colors.neutral.white },
        containerStyle,
      ]}
    >
      {/* Logo and Progress Section */}
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/Logos/Primary_Emerald.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressTrack,
              { backgroundColor: isDark ? Colors.neutral[700] : Colors.neutral[200] },
            ]}
          >
            <Animated.View
              style={[
                styles.progressFill,
                { backgroundColor: Colors.brand.primary },
                progressStyle,
              ]}
            />
          </View>

          {/* Loading Text */}
          <Typography
            variant="metaLabel"
            color={Colors.brand.primary}
            style={styles.loadingText}
          >
            LOADING
          </Typography>
        </View>
      </View>

      {/* Bottom Branding */}
      <View style={styles.branding}>
        <Typography
          variant="h3"
          color={isDark ? Colors.neutral.white : Colors.neutral[900]}
          style={styles.brandName}
        >
          MACROMATE
        </Typography>
        <Typography
          variant="metaLabel"
          color={isDark ? Colors.neutral[400] : Colors.neutral[500]}
          style={styles.tagline}
        >
          PRECISION NUTRITION
        </Typography>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 40,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 2,
    marginTop: 8,
  },
  branding: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
    gap: 6,
  },
  brandName: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 3,
  },
  tagline: {
    fontSize: 12,
    letterSpacing: 1,
    fontWeight: '500',
  },
});
