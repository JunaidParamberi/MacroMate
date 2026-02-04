import React, { ReactNode, useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
import { Screen } from './Screen';

export interface AnimatedScreenProps {
  children: ReactNode;
  padding?: 'sm' | 'md' | 'lg';
  animationType?: 'fade' | 'slide' | 'scale';
  duration?: number;
  style?: ViewStyle;
}

export const AnimatedScreen: React.FC<AnimatedScreenProps> = ({
  children,
  padding = 'md',
  animationType = 'fade',
  duration = 600,
  style,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    const animations = [];

    if (animationType === 'fade' || animationType === 'slide') {
      animations.push(
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        })
      );
    }

    if (animationType === 'slide') {
      animations.push(
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: duration * 1.2,
          useNativeDriver: true,
        })
      );
    }

    if (animationType === 'scale') {
      animations.push(
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        })
      );
    }

    Animated.parallel(animations).start();
  }, [animationType, duration]);

  const getAnimatedStyle = (): any => {
    switch (animationType) {
      case 'slide':
        return {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        };
      case 'scale':
        return {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        };
      case 'fade':
      default:
        return {
          opacity: fadeAnim,
        };
    }
  };

  const getPaddingValue = () => {
    switch (padding) {
      case 'sm': return 12;
      case 'md': return 16;
      case 'lg': return 24;
      default: return 16;
    }
  };

  return (
    <Screen style={style}>
      <Animated.View style={[styles.container, { padding: getPaddingValue() }, getAnimatedStyle()]}>
        {children}
      </Animated.View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
